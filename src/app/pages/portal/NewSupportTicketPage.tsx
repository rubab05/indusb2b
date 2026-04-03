import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supportService } from "../../../services/support.service";
import { TicketCategory } from "../../../types/support";
import { ArrowLeft, Paperclip } from "lucide-react";

const CATEGORIES: TicketCategory[] = [
  "Order Issue",
  "Product Query",
  "Account",
  "Billing",
  "Other",
];

export default function NewSupportTicketPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    subject: "",
    category: "" as TicketCategory | "",
    relatedOrderNumber: "",
    description: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const ticket = await supportService.create({
        subject: form.subject,
        category: form.category as TicketCategory,
        relatedOrderNumber: form.relatedOrderNumber.trim() || undefined,
        description: form.description,
      });
      navigate(`/dashboard/support/${ticket.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm border ${errors[field] ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-gray-400 transition-colors`;

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        to="/dashboard/support"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Back to support
      </Link>

      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">New Support Request</h1>
        <p className="text-sm text-gray-500 mt-1">Describe your issue and we'll get back to you as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-xs tracking-widests text-gray-700 mb-2">SUBJECT *</label>
          <input
            type="text"
            className={inputClass("subject")}
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            placeholder="Brief description of your issue"
          />
          {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
        </div>

        {/* Category + Related Order */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs tracking-widests text-gray-700 mb-2">CATEGORY *</label>
            <select
              className={inputClass("category")}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-xs tracking-widests text-gray-700 mb-2">RELATED ORDER # (OPTIONAL)</label>
            <input
              type="text"
              className={inputClass("relatedOrderNumber")}
              value={form.relatedOrderNumber}
              onChange={(e) => set("relatedOrderNumber", e.target.value)}
              placeholder="e.g. ORD-2026-0041"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs tracking-widests text-gray-700 mb-2">DESCRIPTION *</label>
          <textarea
            rows={6}
            className={`${inputClass("description")} resize-none`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Please provide as much detail as possible..."
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Attachment (UI only) */}
        <div>
          <label className="block text-xs tracking-widests text-gray-700 mb-2">ATTACHMENTS (OPTIONAL)</label>
          <div className="border border-dashed border-gray-300 px-6 py-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Paperclip className="w-5 h-5 text-gray-400 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm text-gray-500">Drag files here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide disabled:opacity-50"
        >
          {submitting ? "SUBMITTING..." : "SUBMIT REQUEST"}
        </button>
      </form>
    </div>
  );
}
