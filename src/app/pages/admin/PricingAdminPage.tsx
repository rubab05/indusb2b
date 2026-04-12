import { useEffect, useState } from "react";
import { pricingAdminService, PricingRule, MOQRuleAdmin, BulkDiscountTier } from "../../../services/pricing-admin.service";
import { adminService } from "../../../services/admin.service";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Ordered list of categories for display
// const CATEGORIES = [
//   { slug: "kitchen-and-household", name: "Kitchen & Household" },
//   { slug: "mats-and-rugs", name: "Mats & Rugs" },
//   { slug: "decoration-and-seasonal", name: "Decoration & Seasonal" },
//   { slug: "garden-and-outdoor", name: "Garden & Outdoor" },
//   { slug: "toys-and-games", name: "Toys & Games" },
// ];

const CATEGORIES = [
  { slug: "kitchen-and-household", name: "Kitchen & Household" },
  { slug: "mats-and-rugs", name: "Mats & Rugs" },
  { slug: "decoration-and-seasonal", name: "Decoration & Seasonal" },
  { slug: "garden-and-outdoor", name: "Garden & Outdoor" },
  { slug: "toys-and-games", name: "Toys & Games" },
];

type ProductOptions = {
  slug: string;
  name: string;
  categorySlug: string;
};

// ─── Visibility Tab ───────────────────────────────────────────────────────────

function VisibilityTab() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    pricingAdminService.getPricingRules().then((data) => {
      setRules(data);
      setLoading(false);
    });
  }, []);

  function findRule(categorySlug: string, productSlug?: string): PricingRule | undefined {
    return rules.find(
      (r) => r.categorySlug === categorySlug && r.productSlug === productSlug,
    );
  }

  function toggleRule(categorySlug: string, productSlug: string | undefined, role: "visibleToWholesale" | "visibleToDropship") {
    setRules((prev) => {
      const idx = prev.findIndex(
        (r) => r.categorySlug === categorySlug && r.productSlug === productSlug,
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [role]: !updated[idx][role] };
        return updated;
      }
      // New rule
      const newRule: PricingRule = {
        categorySlug,
        productSlug,
        visibleToWholesale: role === "visibleToWholesale",
        visibleToDropship: role === "visibleToDropship",
      };
      return [...prev, newRule];
    });
  }

  async function handleSave() {
    setSaving(true);
    await pricingAdminService.savePricingRules(rules);
    setSaving(false);
    toast.success("Visibility rules saved");
  }

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>;

  return (
    <div className="space-y-6">
      {CATEGORIES.map((cat) => {
        const catRule = findRule(cat.slug, undefined);
        const productRules = rules.filter((r) => r.categorySlug === cat.slug && r.productSlug);
        return (
          <div key={cat.slug} className="bg-white border border-gray-200">
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">{cat.name}</span>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={catRule?.visibleToWholesale ?? false}
                    onChange={() => toggleRule(cat.slug, undefined, "visibleToWholesale")}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-blue-700">All to Wholesale</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={catRule?.visibleToDropship ?? false}
                    onChange={() => toggleRule(cat.slug, undefined, "visibleToDropship")}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-purple-700">All to Dropship</span>
                </label>
              </div>
            </div>
            {/* Product rows */}
            {productRules.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-4 py-2 text-left text-xs tracking-widest text-gray-400 font-normal">PRODUCT SLUG</th>
                    <th className="px-4 py-2 text-center text-xs tracking-widest text-blue-600 font-normal">WHOLESALE</th>
                    <th className="px-4 py-2 text-center text-xs tracking-widest text-purple-600 font-normal">DROPSHIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {productRules.map((rule) => (
                    <tr key={rule.productSlug} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700 font-mono text-xs">{rule.productSlug}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={rule.visibleToWholesale}
                          onChange={() => toggleRule(cat.slug, rule.productSlug, "visibleToWholesale")}
                          className="w-4 h-4 accent-blue-600"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={rule.visibleToDropship}
                          onChange={() => toggleRule(cat.slug, rule.productSlug, "visibleToDropship")}
                          className="w-4 h-4 accent-purple-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Visibility Rules"}
      </button>
    </div>
  );
}

// ─── MOQ Rules Tab ────────────────────────────────────────────────────────────

function MOQRuleDialog({
  rule,
  products,
  onSave,
  onClose,
}: {
  rule: MOQRuleAdmin | null;
  products: ProductOption[];
  onSave: (r: MOQRuleAdmin) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MOQRuleAdmin>(
    rule ?? { id: "", categorySlug: "", productSlug: "", minQuantity: 1, unit: "units" },
  );
  const [saving, setSaving] = useState(false);
  const filteredProducts = products.filter(
  (p) => p.categorySlug === form.categorySlug,
);

  async function handleSubmit() {
    if (!form.categorySlug || !form.minQuantity) return;

    if (
      form.productSlug &&
      !filteredProducts.some((p) => p.slug === form.productSlug)
    ) {
      return;
    }
    setSaving(true);
    await onSave({ ...form, productSlug: form.productSlug || undefined });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">{rule ? "Edit MOQ Rule" : "Add MOQ Rule"}</h2>

        <div>
          <label className="block text-xs tracking-wide text-gray-500 mb-1">Category *</label>
          <select
            value={form.categorySlug}
            onChange={(e) => {
              const nextCategory = e.target.value;
              const stillValid = products.some(
                (p) => p.categorySlug === nextCategory && p.slug === form.productSlug,
              );

              setForm({
                ...form,
                categorySlug: nextCategory,
                productSlug: stillValid ? form.productSlug : "",
              });
            }}
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-wide text-gray-500 mb-1">Product (optional)</label>
          <select
            value={form.productSlug ?? ""}
            onChange={(e) => setForm({ ...form, productSlug: e.target.value })}
            disabled={!form.categorySlug}
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">All products in category</option>
            {filteredProducts.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Min Quantity *</label>
            <input
              type="number"
              min={1}
              value={form.minQuantity}
              onChange={(e) => setForm({ ...form, minQuantity: Number(e.target.value) })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Unit</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.categorySlug}
            className="flex-1 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// function MOQTab() {
//   const [rules, setRules] = useState<MOQRuleAdmin[]>([]);
//   const [products, setProducts] = useState<ProductOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editRule, setEditRule] = useState<MOQRuleAdmin | null | "new">(null);

//   async function load() {
//     setLoading(true);
//     const data = await pricingAdminService.getMOQRules();
//     setRules(data);
//     setLoading(false);
//   }

//   useEffect(() => { load(); }, []);

//   async function handleSave(rule: MOQRuleAdmin) {
//     await pricingAdminService.saveMOQRule(rule);
//     toast.success("MOQ rule saved");
//     setEditRule(null);
//     load();
//   }

//   async function handleDelete(id: string) {
//     await pricingAdminService.deleteMOQRule(id);
//     toast.success("MOQ rule deleted");
//     load();
//   }

//   const catName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

//   if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>;

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <button
//           onClick={() => setEditRule("new")}
//           className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
//         >
//           <Plus className="w-4 h-4" strokeWidth={1.5} />
//           Add Rule
//         </button>
//       </div>
//       <div className="bg-white border border-gray-200 overflow-hidden">
//         {rules.length === 0 ? (
//           <div className="py-12 text-center text-sm text-gray-400">No MOQ rules defined.</div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-100 bg-gray-50">
//                 {["Category", "Product", "Min Quantity", "Unit", ""].map((h) => (
//                   <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {rules.map((rule) => (
//                 <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-3 text-gray-900">{catName(rule.categorySlug)}</td>
//                   <td className="px-4 py-3 text-gray-500 font-mono text-xs">{rule.productSlug ?? <span className="italic text-gray-400">All products</span>}</td>
//                   <td className="px-4 py-3 text-gray-900">{rule.minQuantity}</td>
//                   <td className="px-4 py-3 text-gray-700">{rule.unit}</td>
//                   <td className="px-4 py-3 text-right">
//                     <div className="flex items-center gap-2 justify-end">
//                       <button onClick={() => setEditRule(rule)} className="p-1 text-gray-400 hover:text-gray-900 transition-colors"><Pencil className="w-4 h-4" strokeWidth={1.5} /></button>
//                       <button onClick={() => handleDelete(rule.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//       {editRule !== null && (
//         <MOQRuleDialog
//           rule={editRule === "new" ? null : editRule}
//           onSave={handleSave}
//           onClose={() => setEditRule(null)}
//         />
//       )}
//     </div>
//   );
// }

// ─── Bulk Discounts Tab ───────────────────────────────────────────────────────
function MOQTab() {
  const [rules, setRules] = useState<MOQRuleAdmin[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRule, setEditRule] = useState<MOQRuleAdmin | null | "new">(null);

  async function load() {
    setLoading(true);

    const [rulesData, productsData] = await Promise.all([
      pricingAdminService.getMOQRules(),
      adminService.getProducts(),
    ]);

    setRules(rulesData);
    setProducts(
      productsData.map((product) => ({
        slug: product.slug,
        name: product.name,
        categorySlug: product.categorySlug,
      })),
    );

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(rule: MOQRuleAdmin) {
    await pricingAdminService.saveMOQRule(rule);
    toast.success("MOQ rule saved");
    setEditRule(null);
    load();
  }

  async function handleDelete(id: string) {
    await pricingAdminService.deleteMOQRule(id);
    toast.success("MOQ rule deleted");
    load();
  }

  const catName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

  if (loading) {
    return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditRule("new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Rule
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        {rules.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No MOQ rules defined.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Category", "Product", "Min Quantity", "Unit", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900">{catName(rule.categorySlug)}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {rule.productSlug ?? <span className="italic text-gray-400">All products</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{rule.minQuantity}</td>
                  <td className="px-4 py-3 text-gray-700">{rule.unit}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditRule(rule)} className="p-1 text-gray-400 hover:text-gray-900 transition-colors">
                        <Pencil className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button onClick={() => handleDelete(rule.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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

      {editRule !== null && (
        <MOQRuleDialog
          rule={editRule === "new" ? null : editRule}
          products={products}
          onSave={handleSave}
          onClose={() => setEditRule(null)}
        />
      )}
    </div>
  );
}

function TierDialog({
  tier,
  onSave,
  onClose,
}: {
  tier: BulkDiscountTier | null;
  onSave: (t: BulkDiscountTier) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<BulkDiscountTier>(
    tier ?? { id: "", tierName: "", minQty: 1, maxQty: 999, discountPercent: 5 },
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!form.tierName) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">{tier ? "Edit Tier" : "Add Tier"}</h2>
        <div>
          <label className="block text-xs tracking-wide text-gray-500 mb-1">Tier Name *</label>
          <input
            type="text"
            value={form.tierName}
            onChange={(e) => setForm({ ...form, tierName: e.target.value })}
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Min Qty</label>
            <input type="number" min={1} value={form.minQty} onChange={(e) => setForm({ ...form, minQty: Number(e.target.value) })} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs tracking-wide text-gray-500 mb-1">Max Qty</label>
            <input type="number" min={1} value={form.maxQty} onChange={(e) => setForm({ ...form, maxQty: Number(e.target.value) })} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs tracking-wide text-gray-500 mb-1">Discount %</label>
          <input type="number" min={1} max={100} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !form.tierName} className="flex-1 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkDiscountsTab() {
  const [tiers, setTiers] = useState<BulkDiscountTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTier, setEditTier] = useState<BulkDiscountTier | null | "new">(null);

  async function load() {
    setLoading(true);
    const data = await pricingAdminService.getBulkDiscountTiers();
    setTiers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(tier: BulkDiscountTier) {
    await pricingAdminService.saveBulkDiscountTier(tier);
    toast.success("Discount tier saved");
    setEditTier(null);
    load();
  }

  async function handleDelete(id: string) {
    await pricingAdminService.deleteBulkDiscountTier(id);
    toast.success("Tier deleted");
    load();
  }

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditTier("new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Tier
        </button>
      </div>
      <div className="bg-white border border-gray-200 overflow-hidden">
        {tiers.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No discount tiers defined.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Tier Name", "Min Qty", "Max Qty", "Discount %", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{tier.tierName}</td>
                  <td className="px-4 py-3 text-gray-700">{tier.minQty}</td>
                  <td className="px-4 py-3 text-gray-700">{tier.maxQty}</td>
                  <td className="px-4 py-3 text-gray-700">{tier.discountPercent}%</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditTier(tier)} className="p-1 text-gray-400 hover:text-gray-900 transition-colors"><Pencil className="w-4 h-4" strokeWidth={1.5} /></button>
                      <button onClick={() => handleDelete(tier.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editTier !== null && (
        <TierDialog
          tier={editTier === "new" ? null : editTier}
          onSave={handleSave}
          onClose={() => setEditTier(null)}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "visibility" | "moq" | "bulk";

export default function PricingAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("visibility");

  const tabs: { key: Tab; label: string }[] = [
    { key: "visibility", label: "Visibility" },
    { key: "moq", label: "MOQ Rules" },
    { key: "bulk", label: "Bulk Discounts" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Pricing Rules</h1>
        <p className="text-sm text-gray-500 mt-1">Control pricing visibility, minimum order quantities, and bulk discount tiers.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "px-5 py-3 text-sm tracking-wide transition-colors border-b-2 -mb-px",
                activeTab === tab.key
                  ? "border-gray-900 text-gray-900 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "visibility" && <VisibilityTab />}
      {activeTab === "moq" && <MOQTab />}
      {activeTab === "bulk" && <BulkDiscountsTab />}
    </div>
  );
}
