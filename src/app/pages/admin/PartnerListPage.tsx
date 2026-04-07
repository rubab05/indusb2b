import { useEffect, useState } from "react";
import { partnersService, Partner, PartnerOrder } from "../../../services/partners.service";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type StatusFilter = "all" | "ACTIVE" | "SUSPENDED";
type TypeFilter = "all" | "WHOLESALE" | "DROPSHIP";

function StatusBadge({ status }: { status: Partner["status"] }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
        status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: Partner["accountType"] }) {
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

function ConfirmDialog({
  title,
  description,
  label,
  labelClass,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  label: string;
  labelClass: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
        <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={async () => { setSaving(true); await onConfirm(); setSaving(false); }}
            className={`flex-1 py-2.5 text-white text-sm transition-colors disabled:opacity-50 ${labelClass}`}
          >
            {saving ? "Saving..." : label}
          </button>
        </div>
      </div>
    </div>
  );
}

function PartnerRow({
  partner,
  onRefresh,
}: {
  partner: Partner;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [notes, setNotes] = useState(partner.internalNotes);
  const [savingNotes, setSavingNotes] = useState(false);
  const [dialog, setDialog] = useState<"suspend" | "reactivate" | null>(null);

  async function loadOrders() {
    setOrdersLoading(true);
    const data = await partnersService.getPartnerOrders(partner.id);
    setOrders(data);
    setOrdersLoading(false);
  }

  function handleExpand() {
    setExpanded(!expanded);
    if (!expanded) loadOrders();
  }

  async function handleSuspend() {
    await partnersService.suspendPartner(partner.id, "Suspended by admin");
    toast.success(`${partner.companyName} suspended`);
    setDialog(null);
    onRefresh();
  }

  async function handleReactivate() {
    await partnersService.reactivatePartner(partner.id);
    toast.success(`${partner.companyName} reactivated`);
    setDialog(null);
    onRefresh();
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    await partnersService.savePartnerNotes(partner.id, notes);
    setSavingNotes(false);
    toast.success("Notes saved");
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleExpand}>
        <td className="px-4 py-3">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          )}
        </td>
        <td className="px-4 py-3 text-gray-900 font-medium">{partner.companyName}</td>
        <td className="px-4 py-3"><TypeBadge type={partner.accountType} /></td>
        <td className="px-4 py-3 text-gray-500 text-sm">{partner.joinedDate}</td>
        <td className="px-4 py-3"><StatusBadge status={partner.status} /></td>
        <td className="px-4 py-3 text-gray-500 text-sm">{partner.lastOrderDate ?? "—"}</td>
        <td className="px-4 py-3 text-gray-700 text-sm">{partner.totalOrders}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 pb-6 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Profile */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs tracking-widest text-gray-400 mb-2">CONTACT</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-500">Name:</span> <span className="text-gray-900">{partner.contactName}</span></p>
                    <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{partner.contactEmail}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs tracking-widest text-gray-400 mb-2">INTERNAL NOTES</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSaveNotes(); }}
                    disabled={savingNotes}
                    className="mt-2 px-4 py-1.5 bg-gray-900 text-white text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
                <div className="flex gap-3">
                  {partner.status === "ACTIVE" ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDialog("suspend"); }}
                      className="px-4 py-2 border border-red-300 text-red-700 text-sm hover:bg-red-50 transition-colors"
                    >
                      Suspend Partner
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDialog("reactivate"); }}
                      className="px-4 py-2 bg-green-700 text-white text-sm hover:bg-green-800 transition-colors"
                    >
                      Reactivate Partner
                    </button>
                  )}
                </div>
              </div>
              {/* Order history */}
              <div>
                <h4 className="text-xs tracking-widest text-gray-400 mb-2">ORDER HISTORY</h4>
                {ordersLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-200 animate-pulse rounded" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-gray-400">No orders found for this partner.</p>
                ) : (
                  <table className="w-full text-xs border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        {["Order #", "Date", "Total", "Status"].map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-gray-500 font-normal tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-3 py-2 text-gray-900 font-mono">{order.orderNumber}</td>
                          <td className="px-3 py-2 text-gray-600">{order.date}</td>
                          <td className="px-3 py-2 text-gray-900">£{order.total.toFixed(2)}</td>
                          <td className="px-3 py-2 text-gray-600">{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
      {dialog === "suspend" && (
        <tr><td colSpan={7}>
          <ConfirmDialog
            title="Suspend Partner"
            description={`Are you sure you want to suspend ${partner.companyName}? They will lose access to the partner portal.`}
            label="Suspend"
            labelClass="bg-red-600 hover:bg-red-700"
            onConfirm={handleSuspend}
            onClose={() => setDialog(null)}
          />
        </td></tr>
      )}
      {dialog === "reactivate" && (
        <tr><td colSpan={7}>
          <ConfirmDialog
            title="Reactivate Partner"
            description={`Reactivate ${partner.companyName}? They will regain access to the partner portal.`}
            label="Reactivate"
            labelClass="bg-green-700 hover:bg-green-800"
            onConfirm={handleReactivate}
            onClose={() => setDialog(null)}
          />
        </td></tr>
      )}
    </>
  );
}

export default function PartnerListPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const data = await partnersService.getPartners({
      status: statusFilter !== "all" ? statusFilter : undefined,
      accountType: typeFilter !== "all" ? typeFilter : undefined,
      search: search || undefined,
    });
    setPartners(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [statusFilter, typeFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Partner List</h1>
        <p className="text-sm text-gray-500 mt-1">Manage approved partners, view order history, and update account status.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors w-56"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
        >
          <option value="all">All Types</option>
          <option value="WHOLESALE">Wholesale</option>
          <option value="DROPSHIP">Dropship</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No partners match the selected filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 w-8" />
                {["Company Name", "Type", "Joined", "Status", "Last Order", "Total Orders"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {partners.map((partner) => (
                <PartnerRow key={partner.id} partner={partner} onRefresh={load} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
