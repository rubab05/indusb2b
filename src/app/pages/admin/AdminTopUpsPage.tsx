import { useEffect, useState } from "react";
import { api } from "../../../lib/api-client";
import { ApiError } from "../../../lib/api-client";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AdminTopUpRequest {
  id: string;
  userId: string;
  amount: string | number;
  method: string;
  reference: string | null;
  status: string;
  createdAt: string;
  user?: { companyName: string; email: string };
}

interface RawTopUpWithUser extends AdminTopUpRequest {
  user?: { companyName: string; email: string };
}

function toNum(v: string | number): number {
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status.toUpperCase()}
    </span>
  );
}

type StatusFilter = "pending" | "confirmed" | "failed" | "all";

export default function AdminTopUpsPage() {
  const [topUps, setTopUps] = useState<AdminTopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [processing, setProcessing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const raw = await api.get<RawTopUpWithUser[]>("/admin/topups", { limit: "100" });
      setTopUps(raw);
    } catch {
      toast.error("Failed to load top-up requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleConfirm(id: string) {
    setProcessing(id);
    try {
      await api.post(`/admin/topups/${id}/confirm`);
      toast.success("Top-up confirmed — balance updated");
      await load();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to confirm top-up";
      toast.error(msg);
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(id: string) {
    setProcessing(id);
    try {
      await api.post(`/admin/topups/${id}/reject`, { reason: "Rejected by admin" });
      toast.success("Top-up rejected");
      await load();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to reject top-up";
      toast.error(msg);
    } finally {
      setProcessing(null);
    }
  }

  const filtered = statusFilter === "all"
    ? topUps
    : topUps.filter((t) => t.status === statusFilter);

  const pendingCount = topUps.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Top-Up Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve dropship partner balance top-ups.
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-900 transition-colors"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          Refresh
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {(["pending", "confirmed", "failed", "all"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-xs tracking-wide transition-colors ${
              statusFilter === s
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-600 hover:border-gray-900"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">No {statusFilter === "all" ? "" : statusFilter} top-up requests</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Date", "Partner", "Reference", "Amount", "Method", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widests text-gray-500 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(req.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {req.user ? (
                      <div>
                        <p className="text-sm text-gray-900">{req.user.companyName}</p>
                        <p className="text-xs text-gray-500">{req.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-mono">{req.userId.slice(0, 8)}…</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {req.reference ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-700">
                    £{toNum(req.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs capitalize">
                    {req.method.replace("-", " ")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleConfirm(req.id)}
                          disabled={processing === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={processing === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-xs hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
