import { useEffect, useState } from "react";
import {
  ReturnRequest,
  ReturnStatus,
  ReturnReason,
  ResolutionType,
  operationsService,
} from "../../../services/operations.service";
import { toast } from "sonner";
import { X, Plus, ExternalLink } from "lucide-react";

const STATUS_COLORS: Record<ReturnStatus, string> = {
  REPORTED: "bg-gray-100 text-gray-700",
  INVESTIGATING: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const REASON_LABELS: Record<ReturnReason, string> = {
  DAMAGED: "Damaged",
  WRONG_ITEM: "Wrong Item",
  MISSING_ITEM: "Missing Item",
  QUALITY_ISSUE: "Quality Issue",
  OTHER: "Other",
};

const RESOLUTION_TYPES: ResolutionType[] = ["REFUND", "REPLACEMENT", "CREDIT", "REJECTED"];

function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

// ─── Create Return Dialog ─────────────────────────────────────────────────────

function CreateReturnDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (r: ReturnRequest) => void;
}) {
  const [form, setForm] = useState({
    orderNumber: "",
    partnerName: "",
    reason: "DAMAGED" as ReturnReason,
    description: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.orderNumber.trim() || !form.description.trim()) return;
    setSaving(true);
    const created = await operationsService.createReturn({
      orderNumber: form.orderNumber.trim(),
      partnerName: form.partnerName.trim() || "Unknown Partner",
      reason: form.reason,
      description: form.description.trim(),
    });
    onCreated(created);
    toast.success(`Return ${created.returnNumber} created`);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-lg w-full mx-4 shadow-xl z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Create Return / Issue</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" strokeWidth={1.5} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Order Number</label>
            <input
              type="text"
              required
              value={form.orderNumber}
              onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
              placeholder="ORD-2026-XXXX"
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Partner Name</label>
            <input
              type="text"
              value={form.partnerName}
              onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
              placeholder="Company name"
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Reason</label>
            <select
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value as ReturnReason })}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              {(Object.keys(REASON_LABELS) as ReturnReason[]).map((r) => (
                <option key={r} value={r}>{REASON_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue..."
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gray-900 text-white text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors">
              {saving ? "Creating..." : "Create Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Resolution Dialog ────────────────────────────────────────────────────────

function ResolveDialog({
  onClose,
  onResolve,
}: {
  onClose: () => void;
  onResolve: (type: ResolutionType, notes: string) => Promise<void>;
}) {
  const [type, setType] = useState<ResolutionType>("REFUND");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) return;
    setSaving(true);
    await onResolve(type, notes.trim());
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-md w-full mx-4 shadow-xl z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Resolve Return</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" strokeWidth={1.5} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Resolution Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ResolutionType)}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              {RESOLUTION_TYPES.filter((t) => t !== "REJECTED").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Resolution Notes</label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the resolution..."
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-green-700 text-white text-sm disabled:opacity-40 hover:bg-green-800 transition-colors">
              {saving ? "Resolving..." : "Confirm Resolution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

function ReturnDetailSheet({
  ret,
  onClose,
  onUpdate,
}: {
  ret: ReturnRequest;
  onClose: () => void;
  onUpdate: (updated: ReturnRequest) => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);

  async function handleAddNote() {
    if (!note.trim()) return;
    setSaving(true);
    const updated = await operationsService.addReturnNote(ret.id, note.trim());
    if (updated) { onUpdate(updated); setNote(""); toast.success("Note added"); }
    setSaving(false);
  }

  async function handleStartInvestigation() {
    const updated = await operationsService.updateReturnStatus(ret.id, "INVESTIGATING");
    if (updated) { onUpdate(updated); toast.success("Status → Investigating"); }
  }

  async function handleResolve(type: ResolutionType, notes: string) {
    const updated = await operationsService.updateReturnStatus(ret.id, "RESOLVED", { type, notes });
    if (updated) { onUpdate(updated); setShowResolveDialog(false); toast.success("Return resolved"); }
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    const updated = await operationsService.updateReturnStatus(ret.id, "REJECTED", {
      type: "REJECTED",
      notes: rejectReason.trim(),
    });
    if (updated) { onUpdate(updated); setShowRejectInput(false); toast.success("Return rejected"); }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-y-auto z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <p className="text-xs text-gray-500 font-mono">{ret.returnNumber}</p>
              <h2 className="text-lg font-semibold text-gray-900">{ret.partnerName}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" strokeWidth={1.5} /></button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Info card */}
            <div className="bg-gray-50 border border-gray-200 p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <ReturnStatusBadge status={ret.status} />
                <span className="text-xs text-gray-500 font-mono">{ret.orderNumber}</span>
                <a
                  href={`/admin/operations/orders`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                  View Order <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                </a>
              </div>
              <p className="text-sm text-gray-700"><span className="font-medium">Reason:</span> {REASON_LABELS[ret.reason]}</p>
              <p className="text-sm text-gray-700">{ret.description}</p>
              <p className="text-xs text-gray-400">Created {ret.createdDate} · Updated {ret.updatedDate}</p>
            </div>

            {/* Resolution info */}
            {ret.resolution && (
              <div className={`p-4 border ${ret.status === "RESOLVED" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-sm font-semibold text-gray-900 mb-1">Resolution: {ret.resolution.type}</p>
                <p className="text-sm text-gray-700">{ret.resolution.notes}</p>
                <p className="text-xs text-gray-400 mt-1">{ret.resolution.date}</p>
              </div>
            )}

            {/* Status actions */}
            {ret.status === "REPORTED" && (
              <button
                onClick={handleStartInvestigation}
                className="w-full py-2.5 bg-amber-600 text-white text-sm hover:bg-amber-700 transition-colors"
              >
                Start Investigation
              </button>
            )}

            {ret.status === "INVESTIGATING" && !showRejectInput && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResolveDialog(true)}
                  className="flex-1 py-2.5 bg-green-700 text-white text-sm hover:bg-green-800 transition-colors"
                >
                  Resolve
                </button>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}

            {showRejectInput && (
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowRejectInput(false)} className="flex-1 py-2 border border-gray-200 text-sm text-gray-700">Cancel</button>
                  <button onClick={handleReject} className="flex-1 py-2 bg-red-600 text-white text-sm hover:bg-red-700">Confirm Reject</button>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Internal Notes</h3>
              {ret.internalNotes.length === 0 && <p className="text-xs text-gray-400 mb-2">No notes yet.</p>}
              <div className="space-y-2 mb-3">
                {ret.internalNotes.map((n, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 p-3 text-xs">
                    <p className="text-gray-800">{n.text}</p>
                    <p className="text-gray-500 mt-1">{n.user} · {n.date}</p>
                  </div>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add internal note..."
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={!note.trim() || saving}
                className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                {saving ? "Saving..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showResolveDialog && (
        <ResolveDialog onClose={() => setShowResolveDialog(false)} onResolve={handleResolve} />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<ReturnRequest | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await operationsService.getReturns();
    setReturns(data);
    setLoading(false);
  }

  const filtered = statusFilter === "all" ? returns : returns.filter((r) => r.status === statusFilter);

  function handleCreated(r: ReturnRequest) {
    setReturns((prev) => [r, ...prev]);
    setShowCreate(false);
  }

  function handleUpdate(updated: ReturnRequest) {
    setReturns((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(updated);
  }

  if (loading) return <div className="py-16 text-center text-gray-400 text-sm">Loading returns...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">Returns & Issues</h1>
          <p className="text-sm text-gray-500 mt-0.5">{returns.length} total</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          New Return
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "REPORTED", "INVESTIGATING", "RESOLVED", "REJECTED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs border transition-colors ${statusFilter === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Return #</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Order #</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Partner</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Reason</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Status</th>
              <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ret) => (
              <tr
                key={ret.id}
                onClick={() => setSelected(ret)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-900">{ret.returnNumber}</td>
                <td className="py-3 px-4 font-mono text-xs text-gray-600">{ret.orderNumber}</td>
                <td className="py-3 px-4 text-gray-700">{ret.partnerName}</td>
                <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{REASON_LABELS[ret.reason]}</td>
                <td className="py-3 px-4"><ReturnStatusBadge status={ret.status} /></td>
                <td className="py-3 px-4 text-gray-500 text-xs">{ret.createdDate}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No returns found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate && <CreateReturnDialog onClose={() => setShowCreate(false)} onCreated={handleCreated} />}

      {selected && (
        <ReturnDetailSheet
          ret={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
