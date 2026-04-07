import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  OperationalOrder,
  OpsOrderStatus,
  operationsService,
} from "../../../services/operations.service";
import { toast } from "sonner";
import { X, ChevronRight, LayoutGrid, List, Search } from "lucide-react";

const STATUSES: OpsOrderStatus[] = ["NEW", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];
const STATUS_LABELS: Record<OpsOrderStatus, string> = {
  NEW: "New",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};
const STATUS_COLORS: Record<OpsOrderStatus, string> = {
  NEW: "bg-gray-100 text-gray-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  PACKED: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
};
const CARD_DRAG = "OP_ORDER_CARD";
const ASSIGNEES = ["Sarah", "Mike", "Alex", "Unassigned"];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OpsOrderStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Order Detail Sheet ───────────────────────────────────────────────────────

function OrderDetailSheet({
  order,
  onClose,
  onUpdate,
}: {
  order: OperationalOrder;
  onClose: () => void;
  onUpdate: (updated: OperationalOrder) => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAssign(assignee: string) {
    const val = assignee === "Unassigned" ? null : assignee;
    const updated = await operationsService.assignOrder(order.id, val);
    if (updated) { onUpdate(updated); toast.success("Assignee updated"); }
  }

  async function handleAddNote() {
    if (!note.trim()) return;
    setSaving(true);
    const updated = await operationsService.addInternalNote(order.id, note.trim());
    if (updated) { onUpdate(updated); setNote(""); toast.success("Note added"); }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-gray-500 font-mono">{order.orderNumber}</p>
            <h2 className="text-lg font-semibold text-gray-900">{order.partnerName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Status + Date */}
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-xs text-gray-500">{order.createdDate}</span>
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${order.partnerType === "WHOLESALE" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
              {order.partnerType}
            </span>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Items</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-1 text-xs text-gray-500 font-normal">Product</th>
                  <th className="text-left py-1 text-xs text-gray-500 font-normal">SKU</th>
                  <th className="text-right py-1 text-xs text-gray-500 font-normal">Qty</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 text-gray-900">{item.name}</td>
                    <td className="py-1.5 text-gray-500 font-mono text-xs">{item.sku}</td>
                    <td className="py-1.5 text-right text-gray-900">{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right text-sm font-semibold text-gray-900 mt-2">
              Total: £{order.total.toFixed(2)}
            </p>
          </div>

          {/* Assign To */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Assign To</h3>
            <select
              value={order.assignedTo ?? "Unassigned"}
              onChange={(e) => handleAssign(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
            >
              {ASSIGNEES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Internal Notes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Internal Notes</h3>
            {order.internalNotes.length === 0 && (
              <p className="text-xs text-gray-400 mb-2">No notes yet.</p>
            )}
            <div className="space-y-2 mb-3">
              {order.internalNotes.map((n, i) => (
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

          {/* Status History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Status History</h3>
            <div className="relative pl-4">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex gap-3 mb-3 relative">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0 relative z-10" />
                  {i < order.statusHistory.length - 1 && (
                    <div className="absolute left-[3px] top-4 bottom-0 w-px bg-gray-200" />
                  )}
                  <div className="-ml-2">
                    <p className="text-sm font-medium text-gray-900">{h.status}</p>
                    <p className="text-xs text-gray-500">{h.date} · {h.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({
  order,
  onClick,
}: {
  order: OperationalOrder;
  onClick: () => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: CARD_DRAG,
    item: { id: order.id, status: order.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="bg-white border border-gray-200 p-3 cursor-pointer hover:border-gray-400 transition-colors select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900 font-mono leading-tight">{order.orderNumber}</p>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
      </div>
      <p className="text-xs text-gray-600 mt-0.5 truncate">{order.partnerName}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">{order.items.reduce((s, i) => s + i.qty, 0)} units</span>
        <span className="text-xs font-medium text-gray-900">£{order.total.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-gray-400">{order.createdDate}</span>
        {order.assignedTo && (
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5">{order.assignedTo}</span>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  status,
  orders,
  onDrop,
  onCardClick,
}: {
  status: OpsOrderStatus;
  orders: OperationalOrder[];
  onDrop: (id: string, newStatus: OpsOrderStatus) => void;
  onCardClick: (order: OperationalOrder) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: CARD_DRAG,
    drop: (item: { id: string; status: OpsOrderStatus }) => {
      if (item.status !== status) onDrop(item.id, status);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });
  drop(ref);

  return (
    <div ref={ref} className={`flex flex-col min-w-[220px] flex-1 ${isOver ? "bg-amber-50" : "bg-gray-50"} transition-colors`}>
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white sticky top-0">
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">{STATUS_LABELS[status]}</span>
        <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 font-medium">{orders.length}</span>
      </div>
      {/* Cards */}
      <div className="p-2 space-y-2 flex-1 min-h-[200px]">
        {orders.map((order) => (
          <KanbanCard key={order.id} order={order} onClick={() => onCardClick(order)} />
        ))}
        {orders.length === 0 && (
          <div className="text-xs text-gray-400 text-center mt-6 select-none">Drop here</div>
        )}
      </div>
    </div>
  );
}

// ─── Table View ───────────────────────────────────────────────────────────────

function TableView({
  orders,
  onUpdate,
  onCardClick,
}: {
  orders: OperationalOrder[];
  onUpdate: (updated: OperationalOrder) => void;
  onCardClick: (order: OperationalOrder) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OpsOrderStatus>("PROCESSING");
  const [bulking, setBulking] = useState(false);

  function toggleAll() {
    setSelected((prev) => prev.size === orders.length ? new Set() : new Set(orders.map((o) => o.id)));
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleInlineStatus(order: OperationalOrder, status: OpsOrderStatus) {
    const updated = await operationsService.updateOrderStatus(order.id, status);
    if (updated) { onUpdate(updated); toast.success(`${order.orderNumber} → ${STATUS_LABELS[status]}`); }
  }

  async function handleBulkUpdate() {
    if (selected.size === 0) return;
    setBulking(true);
    const ids = Array.from(selected);
    const updated = await operationsService.bulkUpdateStatus(ids, bulkStatus);
    for (const u of updated) onUpdate(u);
    setSelected(new Set());
    toast.success(`${updated.length} orders updated to ${STATUS_LABELS[bulkStatus]}`);
    setBulking(false);
  }

  return (
    <div>
      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-50 border border-amber-200">
          <span className="text-sm text-gray-700 font-medium">{selected.size} selected</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as OpsOrderStatus)}
            className="border border-gray-200 px-2 py-1 text-sm focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button
            onClick={handleBulkUpdate}
            disabled={bulking}
            className="px-4 py-1.5 bg-gray-900 text-white text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors"
          >
            {bulking ? "Updating..." : "Update Selected"}
          </button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-gray-500 hover:text-gray-900">Clear</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-3 text-left w-8">
                <input
                  type="checkbox"
                  checked={selected.size === orders.length && orders.length > 0}
                  onChange={toggleAll}
                  className="accent-gray-900"
                />
              </th>
              <th className="py-3 px-3 text-left text-xs text-gray-500 font-medium">Order #</th>
              <th className="py-3 px-3 text-left text-xs text-gray-500 font-medium">Partner</th>
              <th className="py-3 px-3 text-right text-xs text-gray-500 font-medium">Units</th>
              <th className="py-3 px-3 text-right text-xs text-gray-500 font-medium">Total</th>
              <th className="py-3 px-3 text-left text-xs text-gray-500 font-medium">Status</th>
              <th className="py-3 px-3 text-left text-xs text-gray-500 font-medium">Assigned</th>
              <th className="py-3 px-3 text-left text-xs text-gray-500 font-medium">Date</th>
              <th className="py-3 px-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggle(order.id)}
                    className="accent-gray-900"
                  />
                </td>
                <td className="py-3 px-3 font-mono text-xs text-gray-900 font-semibold">{order.orderNumber}</td>
                <td className="py-3 px-3 text-gray-700">{order.partnerName}</td>
                <td className="py-3 px-3 text-right text-gray-700">{order.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="py-3 px-3 text-right text-gray-900 font-medium">£{order.total.toFixed(2)}</td>
                <td className="py-3 px-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleInlineStatus(order, e.target.value as OpsOrderStatus)}
                    className="border border-gray-200 px-2 py-1 text-xs focus:outline-none bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-3 text-gray-600 text-xs">{order.assignedTo ?? "—"}</td>
                <td className="py-3 px-3 text-gray-500 text-xs">{order.createdDate}</td>
                <td className="py-3 px-3">
                  <button onClick={() => onCardClick(order)} className="text-gray-400 hover:text-gray-700">
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderWorkflowPage() {
  const [orders, setOrders] = useState<OperationalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OperationalOrder | null>(null);

  useEffect(() => {
    operationsService.getOperationalOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) || o.partnerName.toLowerCase().includes(q);
  });

  function updateOrder(updated: OperationalOrder) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    if (selectedOrder?.id === updated.id) setSelectedOrder(updated);
  }

  async function handleDrop(id: string, newStatus: OpsOrderStatus) {
    const updated = await operationsService.updateOrderStatus(id, newStatus);
    if (updated) {
      updateOrder(updated);
      toast.success(`Order → ${STATUS_LABELS[newStatus]}`);
    }
  }

  if (loading) return <div className="py-16 text-center text-gray-400 text-sm">Loading orders...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-light text-gray-900 tracking-tight">Order Workflow</h1>
            <p className="text-sm text-gray-500 mt-0.5">{orders.length} orders total</p>
          </div>
          {/* View toggle */}
          <div className="flex border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${view === "kanban" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.5} />
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${view === "table" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <List className="w-3.5 h-3.5" strokeWidth={1.5} />
              Table
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order # or partner..."
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Content */}
        {view === "kanban" ? (
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                orders={filtered.filter((o) => o.status === status)}
                onDrop={handleDrop}
                onCardClick={setSelectedOrder}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200">
            <TableView orders={filtered} onUpdate={updateOrder} onCardClick={setSelectedOrder} />
          </div>
        )}
      </div>

      {/* Detail sheet */}
      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateOrder}
        />
      )}
    </DndProvider>
  );
}
