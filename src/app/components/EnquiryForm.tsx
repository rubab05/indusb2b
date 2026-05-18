import { useState } from "react";
import { api, ApiError } from "../../lib/api-client";

interface Props {
  productName?: string;
}

export function EnquiryForm({ productName }: Props) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    product: productName ?? "",
    quantity: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);
    setApiError("");
    try {
      await api.post("/contact", {
        name: form.name,
        company: form.company,
        email: form.email,
        product: form.product || undefined,
        quantity: form.quantity || undefined,
        message: form.message || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border ${errors[field] ? "border-red-400" : "border-gray-300"} focus:outline-none focus:border-gray-900 transition-colors`;

  if (submitted) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 md:p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl tracking-tight">Enquiry Sent</h3>
        <p className="text-sm text-gray-600">
          Thank you, <strong>{form.name}</strong>. Our trade team will be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 md:p-12">
      <h2 className="text-2xl md:text-3xl mb-3 tracking-tight">Need Higher Quantity or Trade Pricing?</h2>
      <p className="text-sm text-gray-600 mb-10">
        Complete the form below and our trade team will get back to you within 24 hours.
      </p>

      {apiError && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="enq-name" className="block text-sm mb-2 text-gray-900">Name *</label>
            <input
              type="text"
              id="enq-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass("name")}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="enq-company" className="block text-sm mb-2 text-gray-900">Company *</label>
            <input
              type="text"
              id="enq-company"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              className={inputClass("company")}
            />
            {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="enq-email" className="block text-sm mb-2 text-gray-900">Email *</label>
            <input
              type="email"
              id="enq-email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputClass("email")}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="enq-product" className="block text-sm mb-2 text-gray-900">Product</label>
            <input
              type="text"
              id="enq-product"
              value={form.product}
              readOnly={!!productName}
              onChange={(e) => set("product", e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors${productName ? " bg-gray-100" : ""}`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="enq-quantity" className="block text-sm mb-2 text-gray-900">Quantity Required</label>
          <input
            type="text"
            id="enq-quantity"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className={inputClass("quantity")}
          />
        </div>

        <div>
          <label htmlFor="enq-message" className="block text-sm mb-2 text-gray-900">Message</label>
          <textarea
            id="enq-message"
            rows={6}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-10 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide disabled:opacity-50"
        >
          {loading ? "SENDING..." : "SEND ENQUIRY"}
        </button>
      </form>
    </div>
  );
}
