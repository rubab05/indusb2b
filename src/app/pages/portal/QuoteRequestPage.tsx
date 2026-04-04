import { useEffect, useState } from "react";
import { pricingService } from "../../../services/pricing.service";
import { orderingService } from "../../../services/ordering.service";
import { PriceListItem } from "../../../types/commerce";
import { Plus, Trash2, CheckCircle2, Search } from "lucide-react";

interface QuoteLine { item: PriceListItem; qty: number }

export default function QuoteRequestPage() {
  const [catalogue, setCatalogue] = useState<PriceListItem[]>([]);
  const [search, setSearch] = useState("");
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [requirements, setRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    pricingService.getPriceList().then(setCatalogue);
  }, []);

  const suggestions = search.length >= 2
    ? catalogue.filter(
        (p) =>
          !lines.some((l) => l.item.id === p.id) &&
          (p.productName.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase())),
      ).slice(0, 6)
    : [];

  function addLine(item: PriceListItem) {
    setLines((prev) => [...prev, { item, qty: item.moq }]);
    setSearch("");
  }

  function updateQty(id: string, val: string) {
    const n = parseInt(val, 10);
    if (isNaN(n)) return;
    setLines((prev) => prev.map((l) => l.item.id === id ? { ...l, qty: Math.max(1, n) } : l));
    setErrors((e) => { const n2 = { ...e }; delete n2[id]; return n2; });
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.item.id !== id));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!lines.length) e.lines = "Add at least one product";
    if (!requirements.trim()) e.requirements = "Please describe your requirements";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    const result = await orderingService.submitQuoteRequest({
      lines: lines.map((l) => ({ sku: l.item.sku, productName: l.item.productName, qty: l.qty })),
      specialRequirements: requirements,
    });
    setConfirmed(result.referenceNumber);
    setSubmitting(false);
  }

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Quote Request Submitted</h1>
          <p className="text-sm text-gray-500 mt-2">We'll review your request and get back to you within 1–2 working days.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 py-6 px-8">
          <p className="text-xs tracking-widests text-gray-500 mb-1">REFERENCE NUMBER</p>
          <p className="text-2xl font-light text-gray-900">{confirmed}</p>
        </div>
        <button
          onClick={() => { setConfirmed(null); setLines([]); setRequirements(""); }}
          className="px-8 py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide"
        >
          SUBMIT ANOTHER QUOTE
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Request a Quote</h1>
        <p className="text-sm text-gray-500 mt-1">Select products, add quantities, and describe any special requirements.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product search */}
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <p className="text-xs tracking-widests text-gray-700">ADD PRODUCTS</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-200 shadow-sm mt-0.5">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addLine(item)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <span className="text-gray-900">{item.productName}</span>
                    <span className="text-xs text-gray-400 font-mono">{item.sku}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {errors.lines && <p className="text-xs text-red-500">{errors.lines}</p>}

          {lines.length > 0 && (
            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{line.item.productName}</p>
                    <p className="text-xs text-gray-400 font-mono">{line.item.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input
                      type="number"
                      value={line.qty}
                      min={1}
                      onChange={(e) => updateQty(line.item.id, e.target.value)}
                      className="w-20 text-center text-sm border border-gray-200 py-1 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {lines.length === 0 && (
            <div className="py-6 text-center border border-dashed border-gray-200">
              <Plus className="w-6 h-6 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm text-gray-400">Search above to add products</p>
            </div>
          )}
        </div>

        {/* Special requirements */}
        <div className="bg-white border border-gray-200 p-6 space-y-3">
          <label className="block text-xs tracking-widests text-gray-700">
            SPECIAL REQUIREMENTS *
          </label>
          <textarea
            rows={5}
            value={requirements}
            onChange={(e) => { setRequirements(e.target.value); setErrors((e2) => { const n = { ...e2 }; delete n.requirements; return n; }); }}
            placeholder="Describe any special pricing, packaging, lead time, or delivery requirements..."
            className={`w-full px-4 py-3 text-sm border ${errors.requirements ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-gray-400 resize-none transition-colors`}
          />
          {errors.requirements && <p className="text-xs text-red-500">{errors.requirements}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide disabled:opacity-50"
        >
          {submitting ? "SUBMITTING..." : "SUBMIT QUOTE REQUEST"}
        </button>
      </form>
    </div>
  );
}
