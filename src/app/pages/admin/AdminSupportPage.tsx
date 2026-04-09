import { useEffect, useState } from "react";
import { SupportTicket, TicketStatus, TicketPriority, TicketCategory, TicketMessage } from "../../../types/support";
import { supportService } from "../../../services/support.service";
import { toast } from "sonner";
import { X, Search } from "lucide-react";

// ─── Extended admin fields (augmented in-memory on the ticket) ────────────────

interface AdminTicketMeta {
  assignedAgent: string | null;
  internalNotes: { text: string; user: string; date: string }[];
  partnerName: string;
}

// We augment tickets with admin metadata stored separately keyed by id
const adminMeta: Record<string, AdminTicketMeta> = {
  "tkt-001": { assignedAgent: "Sarah", internalNotes: [{ text: "Re-dispatch confirmed. Tracking sent to partner.", user: "Sarah", date: "19 Mar 2026, 12:05" }], partnerName: "Demo Wholesale Ltd" },
  "tkt-002": { assignedAgent: "Mike", internalNotes: [], partnerName: "Demo Wholesale Ltd" },
  "tkt-003": { assignedAgent: null, internalNotes: [{ text: "Accounts team checking incoming bank payments for 3 Apr batch.", user: "Alex", date: "28 Mar 2026, 10:35" }], partnerName: "Demo Wholesale Ltd" },
};

function getAdminMeta(id: string): AdminTicketMeta {
  if (!adminMeta[id]) {
    adminMeta[id] = { assignedAgent: null, internalNotes: [], partnerName: "Unknown Partner" };
  }
  return adminMeta[id];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-gray-100 text-gray-700",
  CLOSED: "bg-gray-200 text-gray-500",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  NORMAL: "bg-gray-100 text-gray-600",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

const CATEGORY_COLORS: Record<TicketCategory, string> = {
  "Order Issue": "bg-blue-50 text-blue-700",
  "Product Query": "bg-teal-50 text-teal-700",
  "Account": "bg-purple-50 text-purple-700",
  "Billing": "bg-amber-50 text-amber-700",
  "Other": "bg-gray-100 text-gray-600",
};

const AGENTS = ["Sarah", "Mike", "Alex", "Unassigned"];
const PRIORITIES: TicketPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>;
}
function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[priority]}`}>{priority}</span>;
}
function CategoryBadge({ category }: { category: TicketCategory }) {
  return <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}>{category}</span>;
}

function formatNow(): string {
  return new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
        <h2 className="text-base font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
          <button
            disabled={loading}
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }}
            className={`flex-1 py-2.5 text-white text-sm transition-colors disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Detail Sheet ──────────────────────────────────────────────────────

function TicketDetailSheet({
  ticket,
  onClose,
  onUpdate,
}: {
  ticket: SupportTicket;
  onClose: () => void;
  onUpdate: (t: SupportTicket, meta: AdminTicketMeta) => void;
}) {
  const meta = getAdminMeta(ticket.id);
  const [localMeta, setLocalMeta] = useState<AdminTicketMeta>({ ...meta, internalNotes: [...meta.internalNotes] });
  const [reply, setReply] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [sending, setSending] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const [localTicket, setLocalTicket] = useState<SupportTicket>({ ...ticket, messages: [...ticket.messages] });

  function updateLocalTicket(t: SupportTicket) {
    setLocalTicket(t);
    onUpdate(t, localMeta);
  }

  async function handleAssign(agent: string) {
    const val = agent === "Unassigned" ? null : agent;
    const updated = { ...localMeta, assignedAgent: val };
    setLocalMeta(updated);
    adminMeta[ticket.id] = updated;
    onUpdate(localTicket, updated);
    toast.success("Agent assigned");
  }

  async function handlePriority(priority: TicketPriority) {
    await supportService.updateStatus(ticket.id, localTicket.status);
    const updated = { ...localTicket, priority };
    setLocalTicket(updated);
    onUpdate(updated, localMeta);
    toast.success(`Priority set to ${priority}`);
  }

  async function handleReply() {
    if (!reply.trim()) return;
    setSending(true);
    const msg: TicketMessage = {
      id: `m${localTicket.messages.length + 1}`,
      author: "support",
      authorName: "HOMATZ Admin",
      body: reply.trim(),
      createdAt: new Date().toISOString(),
    };
    // Mutate via supportService reply
    await supportService.reply(ticket.id, reply.trim());
    const updated = { ...localTicket, messages: [...localTicket.messages, msg] };
    setLocalTicket(updated);
    onUpdate(updated, localMeta);
    setReply("");
    toast.success("Reply sent");
    setSending(false);
  }

  function handleAddInternalNote() {
    if (!internalNote.trim()) return;
    setAddingNote(true);
    const note = { text: internalNote.trim(), user: "Admin", date: formatNow() };
    const updatedMeta = { ...localMeta, internalNotes: [...localMeta.internalNotes, note] };
    setLocalMeta(updatedMeta);
    adminMeta[ticket.id] = updatedMeta;
    onUpdate(localTicket, updatedMeta);
    setInternalNote("");
    toast.success("Note added");
    setAddingNote(false);
  }

  async function handleClose() {
    await supportService.close(ticket.id);
    const updated = { ...localTicket, status: "CLOSED" as TicketStatus };
    setLocalTicket(updated);
    onUpdate(updated, localMeta);
    setShowCloseConfirm(false);
    toast.success("Ticket closed");
  }

  async function handleReopen() {
    await supportService.updateStatus(ticket.id, "OPEN");
    const updated = { ...localTicket, status: "OPEN" as TicketStatus };
    setLocalTicket(updated);
    onUpdate(updated, localMeta);
    setShowReopenConfirm(false);
    toast.success("Ticket reopened");
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full overflow-y-auto z-10">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-xs text-gray-500 font-mono">{localTicket.ticketNumber}</p>
              <h2 className="text-base font-semibold text-gray-900 leading-tight">{localTicket.subject}</h2>
              <div className="flex gap-2 mt-1 flex-wrap">
                <StatusBadge status={localTicket.status} />
                <PriorityBadge priority={localTicket.priority} />
                <CategoryBadge category={localTicket.category} />
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 flex-shrink-0"><X className="w-5 h-5" strokeWidth={1.5} /></button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Ticket meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-500">Partner</p>
                <p className="text-gray-900 font-medium mt-0.5">{localMeta.partnerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900 font-medium mt-0.5">{new Date(localTicket.createdAt).toLocaleDateString('en-GB')}</p>
              </div>
              {localTicket.relatedOrderId && (
                <div>
                  <p className="text-gray-500">Related Order</p>
                  <p className="text-gray-900 font-mono font-medium mt-0.5">{localTicket.relatedOrderId}</p>
                </div>
              )}
            </div>

            {/* Assign + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Assign to Agent</label>
                <select
                  value={localMeta.assignedAgent ?? "Unassigned"}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Priority</label>
                <div className="flex gap-1 flex-wrap">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriority(p)}
                      className={`px-2 py-1 text-xs border transition-colors ${localTicket.priority === p ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Message Thread</h3>
              <div className="space-y-3">
                {localTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.author === "support" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 text-sm ${
                        msg.author === "support"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 border border-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-xs font-medium opacity-70 mb-1">{msg.authorName}</p>
                      <p className="leading-relaxed">{msg.body}</p>
                      <p className="text-xs opacity-50 mt-1">{new Date(msg.createdAt).toLocaleString('en-GB')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Reply */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Reply to Partner</h3>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Write a reply visible to the partner..."
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
              <button
                onClick={handleReply}
                disabled={!reply.trim() || sending}
                className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>

            {/* Internal Notes */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-amber-900">Internal Notes</h3>
                <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 font-medium">Admin Only</span>
              </div>
              {localMeta.internalNotes.length === 0 && (
                <p className="text-xs text-amber-700 mb-2">No internal notes.</p>
              )}
              <div className="space-y-2 mb-3">
                {localMeta.internalNotes.map((n, i) => (
                  <div key={i} className="bg-white border border-amber-100 p-3 text-xs">
                    <p className="text-gray-800">{n.text}</p>
                    <p className="text-gray-500 mt-1">{n.user} · {n.date}</p>
                  </div>
                ))}
              </div>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={2}
                placeholder="Add admin-only note..."
                className="w-full border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none bg-white"
              />
              <button
                onClick={handleAddInternalNote}
                disabled={!internalNote.trim() || addingNote}
                className="mt-2 px-4 py-2 bg-amber-700 text-white text-sm disabled:opacity-40 hover:bg-amber-800 transition-colors"
              >
                Add Note
              </button>
            </div>

            {/* Close / Reopen */}
            <div className="pt-2 border-t border-gray-100">
              {localTicket.status !== "CLOSED" ? (
                <button
                  onClick={() => setShowCloseConfirm(true)}
                  className="px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:border-gray-500 transition-colors"
                >
                  Close Ticket
                </button>
              ) : (
                <button
                  onClick={() => setShowReopenConfirm(true)}
                  className="px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:border-gray-500 transition-colors"
                >
                  Reopen Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCloseConfirm && (
        <ConfirmDialog
          title="Close Ticket"
          message={`Are you sure you want to close ticket ${localTicket.ticketNumber}?`}
          confirmLabel="Close Ticket"
          confirmClass="bg-gray-900 hover:bg-gray-700"
          onConfirm={handleClose}
          onClose={() => setShowCloseConfirm(false)}
        />
      )}
      {showReopenConfirm && (
        <ConfirmDialog
          title="Reopen Ticket"
          message={`Reopen ticket ${localTicket.ticketNumber}?`}
          confirmLabel="Reopen"
          confirmClass="bg-gray-900 hover:bg-gray-700"
          onConfirm={handleReopen}
          onClose={() => setShowReopenConfirm(false)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TicketWithMeta = { ticket: SupportTicket; meta: AdminTicketMeta };

const PARTNER_NAMES: Record<string, string> = {
  "tkt-001": "Demo Wholesale Ltd",
  "tkt-002": "Demo Wholesale Ltd",
  "tkt-003": "Demo Wholesale Ltd",
};

export default function AdminSupportPage() {
  const [rows, setRows] = useState<TicketWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TicketWithMeta | null>(null);

  const [filters, setFilters] = useState({
    status: "" as TicketStatus | "",
    priority: "" as TicketPriority | "",
    category: "" as TicketCategory | "",
    search: "",
    agent: "",
  });

  useEffect(() => {
    supportService.list().then((tickets) => {
      const data: TicketWithMeta[] = tickets.map((t) => {
        const meta = getAdminMeta(t.id);
        if (!meta.partnerName || meta.partnerName === "Unknown Partner") {
          meta.partnerName = PARTNER_NAMES[t.id] ?? "Demo Wholesale Ltd";
        }
        return { ticket: t, meta };
      });
      setRows(data);
      setLoading(false);
    });
  }, []);

  const filtered = rows.filter(({ ticket, meta }) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.agent) {
      const agent = meta.assignedAgent ?? "Unassigned";
      if (agent !== filters.agent) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !ticket.ticketNumber.toLowerCase().includes(q) &&
        !ticket.subject.toLowerCase().includes(q) &&
        !meta.partnerName.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  function handleUpdate(t: SupportTicket, meta: AdminTicketMeta) {
    setRows((prev) =>
      prev.map((r) => (r.ticket.id === t.id ? { ticket: t, meta } : r))
    );
    if (selected?.ticket.id === t.id) setSelected({ ticket: t, meta });
  }

  if (loading) return <div className="py-16 text-center text-gray-400 text-sm">Loading tickets...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-gray-900 tracking-tight">Support Tickets</h1>
        <p className="text-sm text-gray-500 mt-0.5">{rows.length} tickets across all partners</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search..."
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as TicketStatus | "" })}
          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="">All statuses</option>
          {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value as TicketPriority | "" })}
          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value as TicketCategory | "" })}
          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="">All categories</option>
          {(["Order Issue", "Product Query", "Account", "Billing", "Other"] as TicketCategory[]).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.agent}
          onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="">All agents</option>
          {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Ticket #</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Subject</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Partner</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Category</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Priority</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Status</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Assigned</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ ticket, meta }) => (
              <tr
                key={ticket.id}
                onClick={() => setSelected({ ticket, meta })}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-900">{ticket.ticketNumber}</td>
                <td className="py-3 px-4 text-gray-800 max-w-[200px] truncate">{ticket.subject}</td>
                <td className="py-3 px-4 text-gray-600 text-xs">{meta.partnerName}</td>
                <td className="py-3 px-4"><CategoryBadge category={ticket.category} /></td>
                <td className="py-3 px-4"><PriorityBadge priority={ticket.priority} /></td>
                <td className="py-3 px-4"><StatusBadge status={ticket.status} /></td>
                <td className="py-3 px-4 text-gray-600 text-xs">{meta.assignedAgent ?? "—"}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{new Date(ticket.createdAt).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">No tickets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <TicketDetailSheet
          ticket={selected.ticket}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
