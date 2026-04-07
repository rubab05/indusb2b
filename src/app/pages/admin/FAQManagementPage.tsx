import { useEffect, useState } from "react";
import { adminService, FAQItem } from "../../../services/admin.service";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const FAQ_CATEGORIES = ["General", "Wholesale", "Dropship", "Shipping", "Returns"];

const emptyItem: Omit<FAQItem, "id"> & { id: string } = {
  id: "",
  question: "",
  answer: "",
  category: "General",
  order: 0,
};

export default function FAQManagementPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("General");
  const [editItem, setEditItem] = useState<FAQItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadItems() {
    const data = await adminService.getFAQItems();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { loadItems(); }, []);

  const filtered = items.filter((f) => f.category === activeCategory).sort((a, b) => a.order - b.order);

  function openAdd() {
    setEditItem({ ...emptyItem, category: activeCategory, order: filtered.length });
    setShowDialog(true);
  }

  function openEdit(item: FAQItem) {
    setEditItem({ ...item });
    setShowDialog(true);
  }

  async function handleSave() {
    if (!editItem || !editItem.question.trim()) return;
    await adminService.saveFAQItem(editItem);
    toast.success("FAQ item saved");
    setShowDialog(false);
    setEditItem(null);
    await loadItems();
  }

  async function handleDelete() {
    if (!deleteId) return;
    await adminService.deleteFAQItem(deleteId);
    toast.success("FAQ item deleted");
    setDeleteId(null);
    await loadItems();
  }

  async function moveItem(item: FAQItem, direction: -1 | 1) {
    const catItems = items.filter((f) => f.category === item.category).sort((a, b) => a.order - b.order);
    const idx = catItems.findIndex((f) => f.id === item.id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= catItems.length) return;
    // Swap orders
    const ids = catItems.map((f) => f.id);
    [ids[idx], ids[targetIdx]] = [ids[targetIdx], ids[idx]];
    await adminService.reorderFAQItems(ids);
    await loadItems();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions by category.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add FAQ
        </button>
      </div>

      {/* Category tabs */}
      <div className="border-b border-gray-200 flex gap-0">
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-3 text-sm transition-colors border-b-2 -mb-px ${
              activeCategory === cat
                ? "border-gray-900 text-gray-900 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {cat}
            <span className="ml-1.5 text-xs text-gray-400">
              ({items.filter((f) => f.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No FAQ items in this category.</p>
            <button onClick={openAdd} className="text-xs text-gray-500 underline mt-2 hover:text-gray-900 transition-colors">
              Add one now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <div key={item.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-0.5 pt-1">
                    <button onClick={() => moveItem(item, -1)} className="text-gray-300 hover:text-gray-600 transition-colors">
                      <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button onClick={() => moveItem(item, 1)} className="text-gray-300 hover:text-gray-600 transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.question}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit dialog */}
      {showDialog && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setShowDialog(false); setEditItem(null); }} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-lg w-full mx-4 shadow-xl z-10 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editItem.id ? "Edit FAQ Item" : "Add FAQ Item"}
            </h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Question *</label>
              <input
                value={editItem.question}
                onChange={(e) => setEditItem({ ...editItem, question: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Answer *</label>
              <textarea
                value={editItem.answer}
                onChange={(e) => setEditItem({ ...editItem, answer: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Category</label>
              <select
                value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 bg-white transition-colors"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowDialog(false); setEditItem(null); }}
                className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editItem.question.trim() || !editItem.answer.trim()}
                className="flex-1 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete FAQ Item</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
