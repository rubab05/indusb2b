import { useEffect, useState } from "react";
import {
  ActivityLogEntry,
  ActivityActionType,
  ActivityLogFilters,
  operationsService,
} from "../../../services/operations.service";
import { toast } from "sonner";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const ACTION_TYPES: ActivityActionType[] = [
  "ORDER_UPDATE",
  "APPROVAL",
  "CONTENT_EDIT",
  "PRICING_CHANGE",
  "RETURN",
  "LOGIN",
];

const ACTION_LABELS: Record<ActivityActionType, string> = {
  ORDER_UPDATE: "Order Update",
  APPROVAL: "Approval",
  CONTENT_EDIT: "Content Edit",
  PRICING_CHANGE: "Pricing Change",
  RETURN: "Return",
  LOGIN: "Login",
};

const ACTION_COLORS: Record<ActivityActionType, string> = {
  ORDER_UPDATE: "bg-blue-100 text-blue-700",
  APPROVAL: "bg-green-100 text-green-700",
  CONTENT_EDIT: "bg-gray-100 text-gray-700",
  PRICING_CHANGE: "bg-amber-100 text-amber-700",
  RETURN: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
};

const ALL_USERS = ["Sarah Mitchell", "Mike Thompson", "Alex Davies"];
const PAGE_SIZE = 15;

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function downloadCSV(csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ActivityLogPage() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<{
    actionType: ActivityActionType | "";
    userName: string;
    startDate: string;
    endDate: string;
  }>({ actionType: "", userName: "", startDate: "", endDate: "" });

  useEffect(() => {
    load();
  }, [filters]);

  async function load() {
    setLoading(true);
    setPage(1);
    const f: ActivityLogFilters = {};
    if (filters.actionType) f.actionType = filters.actionType;
    if (filters.userName) f.userName = filters.userName;
    if (filters.startDate) f.startDate = filters.startDate;
    if (filters.endDate) f.endDate = filters.endDate;
    const data = await operationsService.getActivityLog(f);
    setEntries(data);
    setLoading(false);
  }

  async function handleExport() {
    setExporting(true);
    const f: ActivityLogFilters = {};
    if (filters.actionType) f.actionType = filters.actionType;
    if (filters.userName) f.userName = filters.userName;
    const csv = await operationsService.exportActivityLogCSV(f);
    downloadCSV(csv);
    toast.success("Activity log exported");
    setExporting(false);
  }

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const pageEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function setFilter(key: keyof typeof filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-0.5">{entries.length} entries</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Action Type</label>
          <select
            value={filters.actionType}
            onChange={(e) => setFilter("actionType", e.target.value)}
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="">All types</option>
            {ACTION_TYPES.map((t) => (
              <option key={t} value={t}>{ACTION_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">User</label>
          <select
            value={filters.userName}
            onChange={(e) => setFilter("userName", e.target.value)}
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="">All users</option>
            {ALL_USERS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">From Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilter("startDate", e.target.value)}
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilter("endDate", e.target.value)}
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Timestamp</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">User</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Action</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Description</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Entity</th>
              </tr>
            </thead>
            <tbody>
              {pageEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">{formatTs(entry.timestamp)}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs whitespace-nowrap">{entry.userName}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.actionType]}`}>
                      {ACTION_LABELS[entry.actionType]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 max-w-md">{entry.description}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {entry.entityType && (
                      <span className="font-medium">{entry.entityType}</span>
                    )}
                    {entry.entityId && (
                      <span className="text-gray-400 ml-1 font-mono">{entry.entityId}</span>
                    )}
                  </td>
                </tr>
              ))}
              {pageEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">No log entries found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, entries.length)} of {entries.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-sm text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 border text-sm transition-colors ${p === page ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-sm text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
