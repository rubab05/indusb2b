import { useEffect, useState } from "react";
import { Link } from "react-router";
import { pricingService, CATEGORIES } from "../../../services/pricing.service";
import { orderingService } from "../../../services/ordering.service";
import { dropshipService } from "../../../services/dropship.service";
import { PriceListItem, OrderLineInput, DropshipBalance } from "../../../types/commerce";
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle2, Wallet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "../../../lib/api-client";

function lineTotal(line: OrderLineInput): number {
  const tier = [...line.item.bulkTiers].reverse().find((t) => line.qty >= t.minQty);
  return (tier ? tier.pricePerUnit : line.item.unitPrice) * line.qty;
}

export default function DropshipOrderPage() {
  const [catalogue, setCatalogue] = useState<PriceListItem[]>([]);
  const [balance, setBalance] = useState<DropshipBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [orderLines, setOrderLines] = useState<OrderLineInput[]>([]);
  const [address, setAddress] = useState({
    name: "",
    company: "",
    line1: "",
    city: "",
    postcode: "",
    country: "UK",
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [moqErrors, setMoqErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      pricingService.getPriceList(),
      dropshipService.getBalance(),
    ]).then(([items, bal]) => {
      setCatalogue(items);
      setBalance(bal);
      setLoading(false);
    });
  }, []);

  const filtered = catalogue.filter((item) => {
    const matchCat = category === "All" || item.category === category;
    const q = search.toLowerCase();
    return matchCat && (!q || item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q));
  });

  const subtotal = orderLines.reduce((sum, l) => sum + lineTotal(l), 0);
  const insufficientBalance = balance ? subtotal > balance.currentBalance : false;
  const accountLocked = balance?.isLocked ?? false;

  function addItem(item: PriceListItem) {
    setOrderLines((prev) => {
      if (prev.find((l) => l.item.id === item.id)) return prev;
      return [...prev, { item, qty: item.moq }];
    });
  }

  function updateQty(itemId: string, delta: number) {
    setOrderLines((prev) =>
      prev.map((l) => l.item.id === itemId ? { ...l, qty: Math.max(l.item.moq, l.qty + delta) } : l),
    );
    setMoqErrors((e) => { const n = { ...e }; delete n[itemId]; return n; });
  }

  function setQty(itemId: string, val: string) {
    const n = parseInt(val, 10);
    if (isNaN(n)) return;
    setOrderLines((prev) => prev.map((l) => l.item.id === itemId ? { ...l, qty: Math.max(1, n) } : l));
  }

  function removeItem(itemId: string) {
    setOrderLines((prev) => prev.filter((l) => l.item.id !== itemId));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    orderLines.forEach((l) => {
      if (l.qty < l.item.moq) errors[l.item.id] = `Min quantity: ${l.item.moq}`;
    });
    setMoqErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    if (!orderLines.length || !validate()) return;
    if (accountLocked) {
      toast.error("Your account is locked. Please top up your balance.");
      return;
    }
    if (insufficientBalance) {
      toast.error("Insufficient balance. Please top up before placing this order.");
      return;
    }
    setSubmitting(true);
    try {
      const orderNumber = await orderingService.submitBulkOrder(orderLines, address, notes);
      setConfirmed(orderNumber);
      // Refresh balance after order
      dropshipService.getBalance().then(setBalance);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to place order. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Order Placed</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your order has been received and your balance has been debited.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 py-6 px-8">
          <p className="text-xs tracking-widest text-gray-500 mb-1">ORDER REFERENCE</p>
          <p className="text-2xl font-light text-gray-900">{confirmed}</p>
        </div>
        {balance && (
          <div className="bg-blue-50 border border-blue-100 py-4 px-6">
            <p className="text-xs text-blue-600">REMAINING BALANCE</p>
            <p className="text-xl font-light text-blue-800">£{balance.currentBalance.toFixed(2)}</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setConfirmed(null); setOrderLines([]); }}
            className="px-8 py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide"
          >
            PLACE ANOTHER ORDER
          </button>
          <Link to="/dashboard/orders" className="text-sm text-gray-500 underline hover:text-gray-900">
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">New Order</h1>
        <p className="text-sm text-gray-500 mt-1">Browse products and submit your order. Balance is debited on placement.</p>
      </div>

      {/* Balance status */}
      {balance && (
        <div className={`border p-4 flex items-center gap-4 ${accountLocked ? "bg-red-50 border-red-200" : insufficientBalance ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-200"}`}>
          {(accountLocked || insufficientBalance) ? (
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${accountLocked ? "text-red-600" : "text-yellow-600"}`} strokeWidth={1.5} />
          ) : (
            <Wallet className="w-5 h-5 text-gray-500 flex-shrink-0" strokeWidth={1.5} />
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Available balance: <span className="font-medium">£{balance.currentBalance.toFixed(2)}</span>
              {subtotal > 0 && (
                <span className={`ml-3 ${insufficientBalance ? "text-red-600" : "text-gray-500"}`}>
                  · Order total: <span className="font-medium">£{subtotal.toFixed(2)}</span>
                  {!insufficientBalance && (
                    <span className="text-green-600 ml-2">· After order: £{(balance.currentBalance - subtotal).toFixed(2)}</span>
                  )}
                </span>
              )}
            </p>
            {accountLocked && <p className="text-xs text-red-600 mt-0.5">Account locked — top up to place orders.</p>}
            {!accountLocked && insufficientBalance && <p className="text-xs text-yellow-700 mt-0.5">Insufficient balance — reduce your order or top up.</p>}
          </div>
          {(accountLocked || insufficientBalance) && (
            <Link
              to="/dashboard/dropship/topup"
              className="flex-shrink-0 px-4 py-2 bg-yellow-500 text-gray-900 text-xs tracking-wide hover:bg-yellow-400 transition-colors"
            >
              TOP UP
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left — product browser */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search product or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 bg-white transition-colors"
            >
              {["All", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-400">No products found.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Product", "SKU", "MOQ", "Unit Price", "Stock", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((item) => {
                    const inOrder = orderLines.some((l) => l.item.id === item.id);
                    return (
                      <tr key={item.id} className={`transition-colors ${inOrder ? "bg-yellow-50" : "hover:bg-gray-50"}`}>
                        <td className="px-4 py-3 text-gray-900">{item.productName}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.sku}</td>
                        <td className="px-4 py-3 text-gray-700">{item.moq}</td>
                        <td className="px-4 py-3 text-gray-900">£{item.unitPrice.toFixed(2)}</td>
                        <td className={`px-4 py-3 text-xs font-medium ${item.stockStatus === "In Stock" ? "text-green-700" : item.stockStatus === "Low Stock" ? "text-yellow-700" : "text-red-500"}`}>
                          {item.stockStatus}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => addItem(item)}
                            disabled={inOrder || item.stockStatus === "Out of Stock"}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" strokeWidth={2} />
                            {inOrder ? "Added" : "Add"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right — order summary */}
        <div className="xl:w-80 flex-shrink-0 space-y-4">
          <div className="bg-white border border-gray-200 p-5 space-y-4 sticky top-24">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              <p className="text-xs tracking-widest text-gray-700">ORDER SUMMARY</p>
            </div>

            {orderLines.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No products added yet.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {orderLines.map((line) => (
                  <div key={line.item.id} className="space-y-1.5">
                    <div className="flex justify-between gap-2">
                      <span className="text-xs text-gray-700 flex-1 leading-snug">{line.item.productName}</span>
                      <button onClick={() => removeItem(line.item.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(line.item.id, -line.item.moq)} className="w-6 h-6 border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                        <Minus className="w-3 h-3" strokeWidth={2} />
                      </button>
                      <input
                        type="number"
                        value={line.qty}
                        onChange={(e) => setQty(line.item.id, e.target.value)}
                        className="w-16 text-center text-sm border border-gray-200 py-0.5 focus:outline-none focus:border-gray-400"
                        min={line.item.moq}
                      />
                      <button onClick={() => updateQty(line.item.id, line.item.moq)} className="w-6 h-6 border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                        <Plus className="w-3 h-3" strokeWidth={2} />
                      </button>
                      <span className="text-xs text-gray-500 ml-auto">£{lineTotal(line).toFixed(2)}</span>
                    </div>
                    {moqErrors[line.item.id] && (
                      <p className="text-xs text-red-500">{moqErrors[line.item.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {orderLines.length > 0 && (
              <>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span className={insufficientBalance ? "text-red-600" : ""}>£{subtotal.toFixed(2)}</span>
                </div>

                {insufficientBalance && (
                  <p className="text-xs text-red-600">Balance insufficient by £{(subtotal - (balance?.currentBalance ?? 0)).toFixed(2)}</p>
                )}

                <div>
                  <label className="block text-xs tracking-widest text-gray-500 mb-1.5">DELIVERY ADDRESS</label>
                  <div className="grid grid-cols-1 gap-2">
                    <input type="text" value={address.name} onChange={(e) => setAddress((p) => ({ ...p, name: e.target.value }))} placeholder="Contact name" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input type="text" value={address.company} onChange={(e) => setAddress((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input type="text" value={address.line1} onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))} placeholder="Address line 1" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))} placeholder="City" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                      <input type="text" value={address.postcode} onChange={(e) => setAddress((p) => ({ ...p, postcode: e.target.value }))} placeholder="Postcode" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    </div>
                    <input type="text" value={address.country} onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))} placeholder="Country" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-gray-500 mb-1.5">ORDER NOTES</label>
                  <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
                </div>

                <button
                  onClick={submit}
                  disabled={submitting || accountLocked || insufficientBalance}
                  className="w-full py-3 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "PLACING ORDER..." : accountLocked ? "ACCOUNT LOCKED" : insufficientBalance ? "INSUFFICIENT BALANCE" : "PLACE ORDER"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
