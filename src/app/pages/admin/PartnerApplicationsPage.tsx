import { useEffect, useState } from "react";
import { partnersService, PartnerApplication } from "../../../services/partners.service";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type StatusFilter = "all" | "PENDING" | "APPROVED" | "REJECTED";
type TypeFilter = "all" | "WHOLESALE" | "DROPSHIP";

function StatusBadge({ status }: { status: PartnerApplication["status"] }) {
  const map = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  } as const;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: PartnerApplication["accountType"] }) {
  const map = {
    WHOLESALE: "bg-blue-100 text-blue-800",
    DROPSHIP: "bg-purple-100 text-purple-800",
  } as const;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${map[type]}`}>
      {type}
    </span>
  );
}

function ActionDialog({
  title,
  description,
  notesLabel,
  notesRequired,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  notesLabel: string;
  notesRequired: boolean;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: (notes: string) => Promise<void>;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (notesRequired && !notes.trim()) return;
    setSaving(true);
    await onConfirm(notes);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-md w-full mx-4 shadow-xl z-10">
        <h2 className="text-lg font-medium text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <label className="block text-xs tracking-wide text-gray-500 mb-1">
          {notesLabel}{notesRequired && " *"}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={notesRequired ? "Required" : "Optional"}
          className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || (notesRequired && !notes.trim())}
            className={`flex-1 py-2.5 text-white text-sm transition-colors disabled:opacity-50 ${confirmClass}`}
          >
            {saving ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationRow({
  app,
  onRefresh,
}: {
  app: PartnerApplication;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null);

  async function handleApprove(notes: string) {
    await partnersService.approveApplication(app.id, notes);
    toast.success("Application approved — notification would be sent to " + app.contactEmail);
    setDialog(null);
    onRefresh();
  }

  async function handleReject(notes: string) {
    await partnersService.rejectApplication(app.id, notes);
    toast.success("Application rejected — notification would be sent to " + app.contactEmail);
    setDialog(null);
    onRefresh();
  }

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          )}
        </td>
        <td className="px-4 py-3 text-gray-900 font-medium">{app.companyName}</td>
        <td className="px-4 py-3"><TypeBadge type={app.accountType} /></td>
        <td className="px-4 py-3 text-gray-500 text-sm">{app.dateApplied}</td>
        <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="px-4 pb-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Company details */}
              <div className="space-y-2">
                <h4 className="text-xs tracking-widest text-gray-400">COMPANY DETAILS</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-500">Reg #:</span> <span className="text-gray-900">{app.companyRegNumber}</span></p>
                  <p><span className="text-gray-500">Address:</span> <span className="text-gray-900">{app.address.line1}{app.address.line2 ? `, ${app.address.line2}` : ""}, {app.address.city}, {app.address.postcode}</span></p>
                  <p><span className="text-gray-500">Contact:</span> <span className="text-gray-900">{app.contactName}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{app.contactEmail}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{app.contactPhone}</span></p>
                </div>
              </div>
              {/* Type-specific fields */}
              <div className="space-y-2">
                <h4 className="text-xs tracking-widest text-gray-400">
                  {app.accountType === "WHOLESALE" ? "WHOLESALE INFO" : "DROPSHIP INFO"}
                </h4>
                <div className="text-sm space-y-1">
                  {app.accountType === "WHOLESALE" ? (
                    <>
                      {app.revenueRange && <p><span className="text-gray-500">Revenue Range:</span> <span className="text-gray-900">{app.revenueRange}</span></p>}
                      {app.categoriesOfInterest && app.categoriesOfInterest.length > 0 && (
                        <p><span className="text-gray-500">Categories:</span> <span className="text-gray-900">{app.categoriesOfInterest.join(", ")}</span></p>
                      )}
                    </>
                  ) : (
                    <>
                      {app.websiteUrl && <p><span className="text-gray-500">Website:</span> <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline">{app.websiteUrl}</a></p>}
                      {app.platform && <p><span className="text-gray-500">Platform:</span> <span className="text-gray-900">{app.platform}</span></p>}
                      {app.estimatedMonthlyVolume && <p><span className="text-gray-500">Est. Volume:</span> <span className="text-gray-900">{app.estimatedMonthlyVolume}</span></p>}
                    </>
                  )}
                  {app.notes && <p><span className="text-gray-500">Notes:</span> <span className="text-gray-900">{app.notes}</span></p>}
                  {app.adminNotes && <p className="mt-2 text-xs text-gray-500 italic">Admin notes: {app.adminNotes}</p>}
                </div>
              </div>
            </div>
            {app.status === "PENDING" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setDialog("approve"); }}
                  className="px-4 py-2 bg-green-700 text-white text-sm hover:bg-green-800 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDialog("reject"); }}
                  className="px-4 py-2 border border-red-300 text-red-700 text-sm hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
      {dialog === "approve" && (
        <tr><td colSpan={5}>
          <ActionDialog
            title="Approve Application"
            description={`Approving ${app.companyName}. A notification email would be sent to ${app.contactEmail}.`}
            notesLabel="Admin notes (optional)"
            notesRequired={false}
            confirmLabel="Approve"
            confirmClass="bg-green-700 hover:bg-green-800"
            onConfirm={handleApprove}
            onClose={() => setDialog(null)}
          />
        </td></tr>
      )}
      {dialog === "reject" && (
        <tr><td colSpan={5}>
          <ActionDialog
            title="Reject Application"
            description={`Rejecting ${app.companyName}. A notification email would be sent to ${app.contactEmail}.`}
            notesLabel="Reason for rejection"
            notesRequired={true}
            confirmLabel="Reject"
            confirmClass="bg-red-600 hover:bg-red-700"
            onConfirm={handleReject}
            onClose={() => setDialog(null)}
          />
        </td></tr>
      )}
    </>
  );
}

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  async function load() {
    setLoading(true);
    const data = await partnersService.getApplications({
      status: statusFilter !== "all" ? statusFilter : undefined,
      accountType: typeFilter !== "all" ? typeFilter : undefined,
    });
    setApplications(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Partner Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve or reject incoming partner applications.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
        >
          <option value="all">All Types</option>
          <option value="WHOLESALE">Wholesale</option>
          <option value="DROPSHIP">Dropship</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No applications match the selected filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 w-8" />
                {["Company Name", "Type", "Date Applied", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app) => (
                <ApplicationRow key={app.id} app={app} onRefresh={load} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
