import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supportService } from "../../../services/support.service";
import { SupportTicket, TicketStatus } from "../../../types/support";
import { Plus, MessageSquare } from "lucide-react";

const STATUS_STYLES: Record<TicketStatus, string> = {
  Open: "bg-green-100 text-green-800",
  InProgress: "bg-blue-100 text-blue-800",
  Resolved: "bg-gray-100 text-gray-600",
  Closed: "bg-gray-100 text-gray-400",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  Open: "Open",
  InProgress: "In Progress",
  Resolved: "Resolved",
  Closed: "Closed",
};

export default function SupportListPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");

  useEffect(() => {
    supportService.list().then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const filtered = tickets.filter(
    (t) => statusFilter === "" || t.status === statusFilter,
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Support</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your support requests.</p>
        </div>
        <Link
          to="/dashboard/support/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide flex-shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          NEW REQUEST
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "")}
          className="px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors bg-white"
        >
          <option value="">All statuses</option>
          {(["Open", "InProgress", "Resolved", "Closed"] as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-sm text-gray-500 mb-4">No support tickets yet.</p>
            <Link
              to="/dashboard/support/new"
              className="text-sm text-gray-900 underline hover:text-gray-600"
            >
              Create your first request
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Ticket #", "Subject", "Category", "Priority", "Status", "Created"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widests text-gray-500 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      to={`/dashboard/support/${ticket.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {ticket.ticketNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{ticket.subject}</td>
                  <td className="px-4 py-3 text-gray-500">{ticket.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${ticket.priority === "High" || ticket.priority === "Urgent" ? "text-red-600 font-medium" : "text-gray-500"}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-sm ${STATUS_STYLES[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{ticket.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
