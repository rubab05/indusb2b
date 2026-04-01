import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ContentPage } from "../components/ContentPage";

export default function ApplyWholesalePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    companyName: "",
    companyNumber: "",
    address: "",
    city: "",
    postcode: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    businessType: "",
    revenueRange: "",
    categories: [] as string[],
    references: "",
    terms: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.companyName) e.companyName = "Required";
    if (!form.address) e.address = "Required";
    if (!form.city) e.city = "Required";
    if (!form.postcode) e.postcode = "Required";
    if (!form.contactName) e.contactName = "Required";
    if (!form.contactEmail) e.contactEmail = "Required";
    if (!form.contactPhone) e.contactPhone = "Required";
    if (!form.businessType) e.businessType = "Required";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);
    // API-ready: submit wholesale application
    setTimeout(() => navigate("/apply/pending"), 1000);
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm border ${errors[field] ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-gray-400 transition-colors`;

  return (
    <ContentPage
      title="Wholesale Partner Application"
      subtitle="Complete the form below to apply for a HOMATZ wholesale trade account."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Apply", href: "/apply" },
        { label: "Wholesale" },
      ]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-8">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Business Details */}
            <div>
              <h2 className="text-xl tracking-tight mb-6 pb-4 border-b border-gray-100">Business Details</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">COMPANY NAME *</label>
                    <input className={inputClass("companyName")} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                    {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">COMPANY REGISTRATION NUMBER</label>
                    <input className={inputClass("companyNumber")} value={form.companyNumber} onChange={(e) => set("companyNumber", e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-gray-700 mb-2">BUSINESS ADDRESS *</label>
                  <input className={inputClass("address")} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">CITY *</label>
                    <input className={inputClass("city")} value={form.city} onChange={(e) => set("city", e.target.value)} />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">POSTCODE *</label>
                    <input className={inputClass("postcode")} value={form.postcode} onChange={(e) => set("postcode", e.target.value)} />
                    {errors.postcode && <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-xl tracking-tight mb-6 pb-4 border-b border-gray-100">Contact Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs tracking-widest text-gray-700 mb-2">FULL NAME *</label>
                  <input className={inputClass("contactName")} value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
                  {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">EMAIL ADDRESS *</label>
                    <input type="email" className={inputClass("contactEmail")} value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
                    {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">PHONE NUMBER *</label>
                    <input type="tel" className={inputClass("contactPhone")} value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
                    {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Profile */}
            <div>
              <h2 className="text-xl tracking-tight mb-6 pb-4 border-b border-gray-100">Business Profile</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">BUSINESS TYPE *</label>
                    <select
                      className={inputClass("businessType")}
                      value={form.businessType}
                      onChange={(e) => set("businessType", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Retailer</option>
                      <option>Distributor</option>
                      <option>Market Trader</option>
                      <option>Garden Centre</option>
                      <option>Online Reseller</option>
                      <option>Other</option>
                    </select>
                    {errors.businessType && <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-gray-700 mb-2">ANNUAL REVENUE RANGE</label>
                    <select
                      className={inputClass("revenueRange")}
                      value={form.revenueRange}
                      onChange={(e) => set("revenueRange", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Under £50k</option>
                      <option>£50k–£250k</option>
                      <option>£250k–£1m</option>
                      <option>Over £1m</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-gray-700 mb-3">PRODUCT CATEGORIES OF INTEREST</label>
                  <div className="flex flex-wrap gap-3">
                    {["Mats & Rugs", "Decoration & Seasonal", "Kitchen & Household", "Garden & Outdoor", "Toys & Games"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 border text-sm transition-colors ${
                          form.categories.includes(cat)
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-gray-700 mb-2">TRADE REFERENCES (OPTIONAL)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                    value={form.references}
                    onChange={(e) => set("references", e.target.value)}
                    placeholder="Supplier or trade references (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => set("terms", e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-gray-300 flex-shrink-0"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-gray-900 underline">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link to="/privacy-policy" className="text-gray-900 underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-2">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide disabled:opacity-50"
            >
              {loading ? "SUBMITTING..." : "SUBMIT WHOLESALE APPLICATION"}
            </button>
          </form>
        </div>
      </section>
    </ContentPage>
  );
}
