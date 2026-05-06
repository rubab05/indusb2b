import { useState } from "react";
import { pricingService } from "../../../services/pricing.service";
import { orderingService } from "../../../services/ordering.service";
import { PriceListItem } from "../../../types/commerce";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ParsedLine {
  sku: string;
  qty: number;
  item: PriceListItem | null;
  error?: string;
}

function parseInput(text: string): Array<{ sku: string; qty: number }> {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[\t,\s]+/);
      const sku = parts[0]?.trim().toUpperCase() ?? "";
      const qty = parseInt(parts[1] ?? "", 10);
      return { sku, qty: isNaN(qty) ? 0 : qty };
    })
    .filter((l) => l.sku);
}

export default function QuickOrderPage() {
  const [inputText, setInputText] = useState("");
  const [parsed, setParsed] = useState<ParsedLine[] | null>(null);
  const [looking, setLooking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [address, setAddress] = useState({
    name: "",
    company: "",
    line1: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  });
  const [notes, setNotes] = useState("");

  async function handleLookup() {
    const lines = parseInput(inputText);
    if (!lines.length) return;
    setLooking(true);
    const skus = lines.map((l) => l.sku);
    const found = await pricingService.getBySkus(skus);
    const result: ParsedLine[] = lines.map(({ sku, qty }) => {
      const item = found.find((p) => p.sku.toUpperCase() === sku) ?? null;
      let error: string | undefined;
      if (!item) error = "SKU not found";
      else if (qty < item.moq) error = `MOQ is ${item.moq} — quantity adjusted`;
      return { sku, qty: item ? Math.max(item.moq, qty) : qty, item, error };
    });
    setParsed(result);
    setLooking(false);
  }

  async function handleSubmit() {
    if (!parsed) return;
    const valid = parsed.filter((l) => l.item);
    if (!valid.length) return;
    setSubmitting(true);
    const orderNumber = await orderingService.submitQuickOrder(
      valid.map((l) => ({ item: l.item!, qty: l.qty })),
      address,
      notes,
    );
    setConfirmed(orderNumber);
    setSubmitting(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setInputText(text.replace(/\r/g, ""));
      setParsed(null);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Order Submitted</h1>
          <p className="text-sm text-gray-500 mt-2">Your quick order has been received.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 py-6 px-8">
          <p className="text-xs tracking-widests text-gray-500 mb-1">ORDER REFERENCE</p>
          <p className="text-2xl font-light text-gray-900">{confirmed}</p>
        </div>
        <button onClick={() => { setConfirmed(null); setInputText(""); setParsed(null); }} className="px-8 py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide">
          PLACE ANOTHER ORDER
        </button>
      </div>
    );
  }

  const validLines = parsed?.filter((l) => l.item) ?? [];
  const subtotal = validLines.reduce((sum, l) => {
    const tier = [...l.item!.bulkTiers].reverse().find((t) => l.qty >= t.minQty);
    return sum + (tier ? tier.pricePerUnit : l.item!.unitPrice) * l.qty;
  }, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Quick Order</h1>
        <p className="text-sm text-gray-500 mt-1">Paste SKU and quantity pairs, one per line, then look up and confirm.</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs tracking-widests text-gray-700">SKU &amp; QUANTITY (one per line)</label>
          <label className="text-xs text-gray-500 underline cursor-pointer hover:text-gray-900 transition-colors">
            Upload CSV
            <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
        <textarea
          rows={8}
          value={inputText}
          onChange={(e) => { setInputText(e.target.value); setParsed(null); }}
          placeholder={"SP-4524-SS  12\nBM-4060-BK  48\nHH-56-ASS  120"}
          className="w-full px-4 py-3 text-sm font-mono border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors"
        />
        <p className="text-xs text-gray-400">Format: SKU [space or comma or tab] quantity — one per line. CSV with same format is also accepted.</p>
        <button
          onClick={handleLookup}
          disabled={looking || !inputText.trim()}
          className="px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors text-sm tracking-wide disabled:opacity-50"
        >
          {looking ? "LOOKING UP..." : "LOOK UP PRODUCTS"}
        </button>
      </div>

      {parsed && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs tracking-widests text-gray-500">MATCHED PRODUCTS</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["SKU", "Product", "Qty", "Unit Price", "Line Total", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widests text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parsed.map((line, i) => {
                const tier = line.item ? [...line.item.bulkTiers].reverse().find((t) => line.qty >= t.minQty) : null;
                const unitP = tier ? tier.pricePerUnit : line.item?.unitPrice ?? 0;
                return (
                  <tr key={i} className={line.item ? "hover:bg-gray-50" : "bg-red-50"}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{line.sku}</td>
                    <td className="px-4 py-3 text-gray-900">{line.item?.productName ?? <span className="text-red-500 text-xs">Not found</span>}</td>
                    <td className="px-4 py-3 text-gray-700">{line.qty}</td>
                    <td className="px-4 py-3 text-gray-700">{line.item ? `£${unitP.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{line.item ? `£${(unitP * line.qty).toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3">
                      {line.error && (
                        <span className="flex items-center gap-1 text-xs text-yellow-700">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                          {line.error}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {validLines.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs tracking-widests text-gray-500 mb-1">DELIVERY ADDRESS</label>
                  <div className="space-y-2">
                    <input type="text" value={address.name} onChange={(e) => setAddress((p) => ({ ...p, name: e.target.value }))} placeholder="Contact name *" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input type="text" value={address.company} onChange={(e) => setAddress((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input type="text" value={address.line1} onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))} placeholder="Address line 1 *" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))} placeholder="City *" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                      <input type="text" value={address.postcode} onChange={(e) => setAddress((p) => ({ ...p, postcode: e.target.value }))} placeholder="Postcode *" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widests text-gray-500 mb-1">ORDER NOTES</label>
                  <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">
                  Subtotal: £{subtotal.toFixed(2)}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide disabled:opacity-50"
                >
                  {submitting ? "SUBMITTING..." : `CONFIRM ORDER (${validLines.length} line${validLines.length !== 1 ? "s" : ""})`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
