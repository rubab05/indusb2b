import { useEffect, useState } from "react";
import { vendorsService, Vendor } from "../../../services/vendors.service";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const ALL_PRODUCT_FAMILIES = [
  { slug: "barrier-mats", label: "Barrier Mats" },
  { slug: "shaggy-rugs", label: "Shaggy Rugs" },
  { slug: "chindi-rag-rugs", label: "Chindi Rag Rugs" },
  { slug: "hallway-runner-rugs", label: "Hallway Runner Rugs" },
  { slug: "wax-burners", label: "Wax Burners" },
  { slug: "christmas-candle-bridges", label: "Christmas Candle Bridges" },
  { slug: "artificial-christmas-trees", label: "Artificial Christmas Trees" },
  { slug: "pencil-slim-christmas-trees", label: "Pencil Slim Christmas Trees" },
  { slug: "stock-pot-4-5l-24cm", label: "Stock Pot 4.5L 24cm" },
  { slug: "wok-pan-glass-lid-32cm", label: "Wok Pan Glass Lid 32cm" },
  { slug: "non-stick-frying-pan-30cm", label: "Non-Stick Frying Pan 30cm" },
  { slug: "chip-pan-with-basket", label: "Chip Pan with Basket" },
  { slug: "milk-pot-14cm", label: "Milk Pot 14cm" },
  { slug: "egg-poacher-pan", label: "Egg Poacher Pan" },
  { slug: "fruit-basket", label: "Fruit Basket" },
  { slug: "corner-plate-rack", label: "Corner Plate Rack" },
  { slug: "bamboo-fence-screening", label: "Bamboo Fence Screening" },
  { slug: "bamboo-canes", label: "Bamboo Canes" },
  { slug: "green-garden-sticks", label: "Green Garden Sticks" },
  { slug: "wooden-garden-stakes", label: "Wooden Garden Stakes" },
  { slug: "artificial-hedge-screening", label: "Artificial Hedge Screening" },
  { slug: "gazing-balls", label: "Gazing Balls" },
  { slug: "hula-hoops", label: "Hula Hoops" },
];

function ProductSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (slugs: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = search
    ? ALL_PRODUCT_FAMILIES.filter(
        (p) =>
          p.label.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : ALL_PRODUCT_FAMILIES;

  function toggle(slug: string) {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  }

  return (
    <div className="border border-gray-200">
      <div className="relative border-b border-gray-200">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm focus:outline-none"
        />
      </div>
      <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
        {filtered.map((p) => (
          <label
            key={p.slug}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(p.slug)}
              onChange={() => toggle(p.slug)}
              className="w-3.5 h-3.5 accent-gray-900"
            />
            <span className="text-sm text-gray-700">{p.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function VendorDialog({
  vendor,
  onSave,
  onClose,
}: {
  vendor: Vendor | null;
  onSave: (v: Vendor) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Vendor>(
    vendor ?? {
      id: "",
      name: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      mappedProductFamilies: [],
      notes: "",
      status: "active",
    },
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.contactEmail) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-lg w-full mx-4 shadow-xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900">{vendor ? "Edit Vendor" : "Add Vendor"}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Vendor Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Contact Email *</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Contact Phone</label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Vendor["status"] })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs tracking-wide text-gray-500 mb-2">Product Mapping</label>
            <ProductSelector
              selected={form.mappedProductFamilies}
              onChange={(slugs) => setForm({ ...form, mappedProductFamilies: slugs })}
            />
            {form.mappedProductFamilies.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{form.mappedProductFamilies.length} product{form.mappedProductFamilies.length !== 1 ? "s" : ""} selected</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name || !form.contactEmail}
            className="flex-1 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({
  vendor,
  onConfirm,
  onClose,
}: {
  vendor: Vendor;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Vendor</h2>
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <span className="font-medium">{vendor.name}</span>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
          <button
            disabled={deleting}
            onClick={async () => { setDeleting(true); await onConfirm(); setDeleting(false); }}
            className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editVendor, setEditVendor] = useState<Vendor | null | "new">(null);
  const [deleteVendor, setDeleteVendor] = useState<Vendor | null>(null);

  async function load() {
    setLoading(true);
    const data = await vendorsService.getVendors();
    setVendors(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(vendor: Vendor) {
    await vendorsService.saveVendor(vendor);
    toast.success(vendor.id ? "Vendor updated" : "Vendor added");
    setEditVendor(null);
    load();
  }

  async function handleDelete() {
    if (!deleteVendor) return;
    await vendorsService.deleteVendor(deleteVendor.id);
    toast.success("Vendor deleted");
    setDeleteVendor(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage supplier vendors and their product mappings.</p>
        </div>
        <button
          onClick={() => setEditVendor("new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Vendor
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No vendors yet. Add your first vendor.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Vendor Name", "Contact Email", "Products", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-gray-900 font-medium">{vendor.name}</div>
                    {vendor.notes && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{vendor.notes}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{vendor.contactEmail}</td>
                  <td className="px-4 py-3 text-gray-700">{vendor.mappedProductFamilies.length}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${vendor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                      {vendor.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setEditVendor(vendor)}
                        className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Pencil className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setDeleteVendor(vendor)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editVendor !== null && (
        <VendorDialog
          vendor={editVendor === "new" ? null : editVendor}
          onSave={handleSave}
          onClose={() => setEditVendor(null)}
        />
      )}
      {deleteVendor && (
        <DeleteDialog
          vendor={deleteVendor}
          onConfirm={handleDelete}
          onClose={() => setDeleteVendor(null)}
        />
      )}
    </div>
  );
}
