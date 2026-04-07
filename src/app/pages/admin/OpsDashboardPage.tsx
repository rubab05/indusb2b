import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ActivityLogEntry,
  OpsStats,
  operationsService,
} from "../../../services/operations.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ClipboardList, RotateCcw, LifeBuoy, ArrowRight } from "lucide-react";

const STATUS_BAR_COLORS: Record<string, string> = {
  New: "#6B7280",
  Processing: "#3B82F6",
  Packed: "#F59E0B",
  Shipped: "#8B5CF6",
  Delivered: "#10B981",
};

function StatCard({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string | number;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <p className="text-xs text-gray-500 tracking-wide uppercase">{label}</p>
      <p className={`text-4xl font-light mt-2 ${valueClass ?? "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ACTION_COLORS: Record<string, string> = {
  ORDER_UPDATE: "bg-blue-100 text-blue-700",
  APPROVAL: "bg-green-100 text-green-700",
  CONTENT_EDIT: "bg-gray-100 text-gray-700",
  PRICING_CHANGE: "bg-amber-100 text-amber-700",
  RETURN: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
};

const ACTION_LABELS: Record<string, string> = {
  ORDER_UPDATE: "Order",
  APPROVAL: "Approval",
  CONTENT_EDIT: "Content",
  PRICING_CHANGE: "Pricing",
  RETURN: "Return",
  LOGIN: "Login",
};

export default function OpsDashboardPage() {
  const [stats, setStats] = useState<OpsStats | null>(null);
  const [log, setLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      operationsService.getOpsStats(),
      operationsService.getActivityLog(),
    ]).then(([s, l]) => {
      setStats(s);
      setLog(l.slice(0, 20));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-16 text-center text-gray-400 text-sm">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-gray-900 tracking-tight">Operations Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of fulfilment, support, and recent activity</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Fulfilment"
          value={stats!.pendingFulfilment}
          sub="orders awaiting dispatch"
        />
        <StatCard
          label="Avg Fulfilment Time"
          value={`${stats!.avgFulfilmentDays} days`}
          sub="order to delivery"
        />
        <StatCard
          label="Open Support Tickets"
          value={stats!.openSupportTickets}
          sub="across all partners"
        />
        <StatCard
          label="Overdue Tickets"
          value={stats!.overdueSupportTickets}
          sub="> 48h without response"
          valueClass={stats!.overdueSupportTickets > 0 ? "text-red-600" : "text-gray-900"}
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats!.ordersByStatus} barSize={32}>
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 0, fontSize: 12 }}
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar dataKey="count" radius={0}>
                {stats!.ordersByStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_BAR_COLORS[entry.status] ?? "#9CA3AF"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="bg-white border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">Recent Activity</h2>
            <Link to="/admin/operations/logs" className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="overflow-y-auto flex-1 space-y-2" style={{ maxHeight: 220 }}>
            {log.map((entry) => (
              <div key={entry.id} className="flex gap-3 items-start py-2 border-b border-gray-50">
                <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium flex-shrink-0 mt-0.5 ${ACTION_COLORS[entry.actionType]}`}>
                  {ACTION_LABELS[entry.actionType]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 line-clamp-2">{entry.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{entry.userName} · {timeAgo(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-medium text-gray-900 mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/operations/orders"
            className="flex items-center gap-3 bg-white border border-gray-200 p-5 hover:border-gray-400 transition-colors group"
          >
            <ClipboardList className="w-5 h-5 text-gray-400 group-hover:text-gray-700" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-gray-900">All Orders</p>
              <p className="text-xs text-gray-500 mt-0.5">Kanban & table view</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-600" strokeWidth={1.5} />
          </Link>
          <Link
            to="/admin/operations/returns"
            className="flex items-center gap-3 bg-white border border-gray-200 p-5 hover:border-gray-400 transition-colors group"
          >
            <RotateCcw className="w-5 h-5 text-gray-400 group-hover:text-gray-700" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-gray-900">Returns</p>
              <p className="text-xs text-gray-500 mt-0.5">Issues & resolutions</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-600" strokeWidth={1.5} />
          </Link>
          <Link
            to="/admin/operations/support"
            className="flex items-center gap-3 bg-white border border-gray-200 p-5 hover:border-gray-400 transition-colors group"
          >
            <LifeBuoy className="w-5 h-5 text-gray-400 group-hover:text-gray-700" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-gray-900">Support Tickets</p>
              <p className="text-xs text-gray-500 mt-0.5">All partners</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-600" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
