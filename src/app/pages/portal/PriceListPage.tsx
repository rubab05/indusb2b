import { useEffect, useState } from "react";
import { pricingService, CATEGORIES } from "../../../services/pricing.service";
import { PriceListItem, StockStatus } from "../../../types/commerce";
import { Search, Download } from "lucide-react";

const STOCK_STYLES: Record<StockStatus, string> = {
  "In Stock": "text-green-700",
  "Low Stock": "text-yellow-700",
  "Out of Stock": "text-red-500",
};

function effectivePrice(item: PriceListItem, qty: number): number {
  const applicable = [...item.bulkTiers]
    .reverse()
    .find((t) => qty >= t.minQty);
  return applicable ? applicable.pricePerUnit : item.unitPrice;
}

export default function PriceListPage() {
  const [items, setItems] = useState<PriceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    pricingService.getPriceList().then((data) => { setItems(data); setLoading(false); });
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = category === "All" || item.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function downloadCSV() {
    const header = "Product,SKU,Category,MOQ,Unit Price,Stock Status";
    const rows = filtered.map((i) =>
      `"${i.productName}","${i.sku}","${i.category}",${i.moq},£${i.unitPrice.toFixed(2)},${i.stockStatus}`,
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "homatz-price-list.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Price List</h1>
          <p className="text-sm text-gray-500 mt-1">Wholesale prices — visible to approved partners only.</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors text-sm tracking-wide flex-shrink-0"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          DOWNLOAD CSV
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-sm border transition-colors ${
              category === cat
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search product or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No products match your search.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Product", "SKU", "MOQ", "Unit Price", "Bulk Tiers", "Stock"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widests text-gray-500 font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{item.productName}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.sku}</td>
                  <td className="px-4 py-3 text-gray-700">{item.moq}</td>
                  <td className="px-4 py-3 text-gray-900">£{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.bulkTiers.map((tier) => (
                        <span key={tier.label} className="text-xs bg-yellow-50 text-yellow-800 border border-yellow-200 px-1.5 py-0.5">
                          {tier.label}: £{tier.pricePerUnit.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${STOCK_STYLES[item.stockStatus]}`}>
                    {item.stockStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Prices shown exclude VAT. All prices are subject to change. Contact your account manager for bespoke pricing.
      </p>
    </div>
  );
}
