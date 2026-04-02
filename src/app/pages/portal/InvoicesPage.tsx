import { useEffect, useState } from "react";
import { Link } from "react-router";
import { invoicesService, Invoice, InvoiceStatus } from "../../../services/invoices.service";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
};

const PAGE_SIZE = 6;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    invoicesService.list().then((data) => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  const filtered = invoices.filter(
    (inv) => statusFilter === "" || inv.status === statusFilter,
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDownload(inv: Invoice) {
    setDownloading(inv.id);
    await invoicesService.download(inv.id);
    setDownloading(null);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">View and download your trade invoices.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as InvoiceStatus | ""); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors bg-white"
        >
          <option value="">All statuses</option>
          {(["Paid", "Pending", "Overdue"] as InvoiceStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">No invoices found.</p>
            {statusFilter && (
              <button
                onClick={() => { setStatusFilter(""); setPage(1); }}
                className="mt-3 text-sm text-gray-900 underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Invoice #", "Order #", "Date", "Due Date", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widests text-gray-500 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/dashboard/orders/${inv.orderId}`}
                      className="text-gray-600 hover:text-gray-900 underline transition-colors"
                    >
                      {inv.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{inv.date}</td>
                  <td className={`px-4 py-3 text-sm ${inv.status === "Overdue" ? "text-red-600 font-medium" : "text-gray-500"}`}>
                    {inv.dueDate}
                  </td>
                  <td className="px-4 py-3 text-gray-900">£{inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-sm ${STATUS_STYLES[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDownload(inv)}
                      disabled={downloading === inv.id}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {downloading === inv.id ? "..." : "PDF"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 text-xs border transition-colors ${
                  page === i + 1
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
