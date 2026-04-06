import { useEffect, useState } from "react";
import { dropshipService } from "../../../services/dropship.service";
import { Transaction, TransactionType } from "../../../types/commerce";
import { ArrowUpRight, ArrowDownRight, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const TYPES: Array<{ label: string; value: TransactionType | "" }> = [
  { label: "All Types", value: "" },
  { label: "Top-up", value: "top-up" },
  { label: "Order", value: "order" },
  { label: "Refund", value: "refund" },
  { label: "Adjustment", value: "adjustment" },
];

const PAGE_SIZE = 8;

function typeBadge(type: Transaction["type"]) {
  const map: Record<string, string> = {
    "top-up": "bg-green-100 text-green-700",
    order: "bg-gray-100 text-gray-700",
    refund: "bg-blue-100 text-blue-700",
    adjustment: "bg-purple-100 text-purple-700",
  };
  return map[type] ?? "bg-gray-100 text-gray-600";
}

export default function DropshipLedgerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    dropshipService
      .getTransactions({
        type: typeFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
      .then((data) => {
        setTransactions(data);
        setPage(1);
        setLoading(false);
      });
  }, [typeFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setTypeFilter("");
    setStartDate("");
    setEndDate("");
  }

  function handleDownload() {
    toast.success("Statement download started");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Transaction Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Full history of all balance transactions.</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          Download
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType | "")}
            className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 bg-white transition-colors"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : paged.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No transactions found</p>
            <button onClick={resetFilters} className="text-xs text-gray-500 underline mt-2 hover:text-gray-900 transition-colors">
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Date", "Type", "Reference", "Description", "Amount", "Balance"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 text-xs">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 font-medium ${typeBadge(tx.type)}`}>{tx.type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{tx.reference}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{tx.description}</td>
                    <td className="px-4 py-3 font-medium">
                      <span className={`flex items-center gap-1 ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {tx.amount > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        £{Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">£{tx.runningBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, transactions.length)} of {transactions.length}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs ${p === page ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"} transition-colors`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
