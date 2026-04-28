import { useEffect, useState } from "react";
import {
  accountService,
  AccountProfile,
  BusinessProfile,
  ContactDetails,
  NotificationPreferences,
} from "../../../services/account.service";
import { Edit2, Check, X, FileText } from "lucide-react";

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionHeader({
  title,
  editing,
  saving,
  onEdit,
  onSave,
  onCancel,
}: {
  title: string;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
      <h2 className="text-sm tracking-widests font-medium text-gray-900">{title}</h2>
      {editing ? (
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2} />
            {saving ? "SAVING..." : "SAVE"}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            CANCEL
          </button>
        </div>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          Edit
        </button>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs tracking-widests text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900">{value || <span className="text-gray-400">—</span>}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-widests text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 text-sm border ${error ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-gray-400 transition-colors`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function SaveFeedback({ status, message }: { status: "success" | "error" | null; message?: string }) {
  if (!status) return null;
  return (
    <div className={`text-xs px-3 py-2 mt-2 ${status === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
      {status === "success" ? "Changes saved successfully." : (message ?? "Failed to save. Please try again.")}
    </div>
  );
}

// ─── Business Profile section ─────────────────────────────────────────────────

function BusinessProfileSection({ profile, onSaved }: { profile: BusinessProfile; onSaved: (d: BusinessProfile) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error"; message?: string } | null>(null);
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessProfile, string>>>({});

  function startEdit() { setForm(profile); setErrors({}); setFeedback(null); setEditing(true); }
  function cancel() { setEditing(false); setErrors({}); setFeedback(null); }
  function set(field: keyof BusinessProfile, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof BusinessProfile, string>> = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.addressLine1.trim()) e.addressLine1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.postcode.trim()) e.postcode = "Required";
    return e;
  }

  async function save() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await accountService.updateBusiness(form);
      onSaved(form);
      setFeedback({ status: "success" });
      setEditing(false);
    } catch {
      setFeedback({ status: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      <SectionHeader title="BUSINESS PROFILE" editing={editing} saving={saving} onEdit={startEdit} onSave={save} onCancel={cancel} />
      {editing ? (
        <div className="grid sm:grid-cols-2 gap-5">
          <Input label="COMPANY NAME *" value={form.companyName} onChange={(v) => set("companyName", v)} error={errors.companyName} />
          <Input label="REGISTRATION NUMBER" value={form.registrationNumber} onChange={(v) => set("registrationNumber", v)} placeholder="Optional" />
          <div className="sm:col-span-2">
            <Input label="ADDRESS *" value={form.addressLine1} onChange={(v) => set("addressLine1", v)} error={errors.addressLine1} />
          </div>
          <Input label="CITY *" value={form.city} onChange={(v) => set("city", v)} error={errors.city} />
          <Input label="POSTCODE *" value={form.postcode} onChange={(v) => set("postcode", v)} error={errors.postcode} />
          <Input label="COUNTRY" value={form.country} onChange={(v) => set("country", v)} />
          <Input label="PHONE" value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
          <Input label="WEBSITE" value={form.website} onChange={(v) => set("website", v)} type="url" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="COMPANY NAME" value={profile.companyName} />
          <Field label="REGISTRATION NUMBER" value={profile.registrationNumber} />
          <div className="sm:col-span-2"><Field label="ADDRESS" value={profile.addressLine1} /></div>
          <Field label="CITY" value={profile.city} />
          <Field label="POSTCODE" value={profile.postcode} />
          <Field label="COUNTRY" value={profile.country} />
          <Field label="PHONE" value={profile.phone} />
          <Field label="WEBSITE" value={profile.website} />
        </div>
      )}
      <SaveFeedback status={feedback?.status ?? null} message={feedback?.message} />
    </div>
  );
}

// ─── Contact Details section ──────────────────────────────────────────────────

function ContactDetailsSection({ contact, onSaved }: { contact: ContactDetails; onSaved: (d: ContactDetails) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error" } | null>(null);
  const [form, setForm] = useState(contact);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactDetails, string>>>({});

  function startEdit() { setForm(contact); setErrors({}); setFeedback(null); setEditing(true); }
  function cancel() { setEditing(false); setErrors({}); setFeedback(null); }
  function set(field: keyof ContactDetails, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof ContactDetails, string>> = {};
    if (!form.contactName.trim()) e.contactName = "Required";
    if (!form.contactEmail.trim()) e.contactEmail = "Required";
    return e;
  }

  async function save() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await accountService.updateContact(form);
      onSaved(form);
      setFeedback({ status: "success" });
      setEditing(false);
    } catch {
      setFeedback({ status: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      <SectionHeader title="CONTACT DETAILS" editing={editing} saving={saving} onEdit={startEdit} onSave={save} onCancel={cancel} />
      {editing ? (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Input label="FULL NAME *" value={form.contactName} onChange={(v) => set("contactName", v)} error={errors.contactName} />
          </div>
          <Input label="EMAIL ADDRESS *" value={form.contactEmail} onChange={(v) => set("contactEmail", v)} type="email" error={errors.contactEmail} />
          <Input label="PHONE" value={form.contactPhone} onChange={(v) => set("contactPhone", v)} type="tel" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2"><Field label="FULL NAME" value={contact.contactName} /></div>
          <Field label="EMAIL ADDRESS" value={contact.contactEmail} />
          <Field label="PHONE" value={contact.contactPhone} />
        </div>
      )}
      <SaveFeedback status={feedback?.status ?? null} />
    </div>
  );
}

// ─── Login & Security section ─────────────────────────────────────────────────

function SecuritySection({ notifications, onNotificationsSaved }: { notifications: NotificationPreferences; onNotificationsSaved: (d: NotificationPreferences) => void }) {
  const [pwEditing, setPwEditing] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{ status: "success" | "error"; message?: string } | null>(null);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const [notifs, setNotifs] = useState(notifications);
  const [notifSaving, setNotifSaving] = useState(false);

  function validatePw() {
    const e: Record<string, string> = {};
    if (!pw.current) e.current = "Required";
    if (pw.next.length < 8) e.next = "At least 8 characters";
    if (pw.next !== pw.confirm) e.confirm = "Passwords do not match";
    return e;
  }

  async function savePw() {
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwSaving(true);
    try {
      await accountService.changePassword(pw.current, pw.next);
      setPwFeedback({ status: "success" });
      setPwEditing(false);
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwFeedback({ status: "error", message: err instanceof Error ? err.message : undefined });
    } finally {
      setPwSaving(false);
    }
  }

  async function toggleNotif(field: keyof NotificationPreferences) {
    const updated = { ...notifs, [field]: !notifs[field] };
    setNotifs(updated);
    setNotifSaving(true);
    await accountService.updateNotifications(updated);
    onNotificationsSaved(updated);
    setNotifSaving(false);
  }

  const NOTIF_LABELS: Record<keyof NotificationPreferences, string> = {
    orderConfirmations: "Order confirmations",
    orderShipped: "Order shipped notifications",
    invoiceDue: "Invoice due reminders",
    promotions: "Product updates & promotions",
  };

  return (
    <div className="bg-white border border-gray-200 p-6 space-y-8">
      <div>
        <SectionHeader
          title="LOGIN & SECURITY"
          editing={pwEditing}
          saving={pwSaving}
          onEdit={() => { setPwEditing(true); setPwFeedback(null); setPwErrors({}); }}
          onSave={savePw}
          onCancel={() => { setPwEditing(false); setPwErrors({}); setPw({ current: "", next: "", confirm: "" }); }}
        />
        {pwEditing ? (
          <div className="space-y-4 max-w-sm">
            <Input label="CURRENT PASSWORD" value={pw.current} onChange={(v) => setPw((p) => ({ ...p, current: v }))} type="password" error={pwErrors.current} />
            <Input label="NEW PASSWORD" value={pw.next} onChange={(v) => setPw((p) => ({ ...p, next: v }))} type="password" error={pwErrors.next} />
            <Input label="CONFIRM NEW PASSWORD" value={pw.confirm} onChange={(v) => setPw((p) => ({ ...p, confirm: v }))} type="password" error={pwErrors.confirm} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">••••••••••••</p>
        )}
        <SaveFeedback status={pwFeedback?.status ?? null} message={pwFeedback?.message} />
      </div>

      <div>
        <p className="text-xs tracking-widests text-gray-500 mb-4">
          EMAIL NOTIFICATIONS {notifSaving && <span className="text-gray-400 normal-case text-xs ml-2">Saving...</span>}
        </p>
        <div className="space-y-3">
          {(Object.keys(NOTIF_LABELS) as (keyof NotificationPreferences)[]).map((key) => (
            <label key={key} className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {NOTIF_LABELS[key]}
              </span>
              <button
                role="switch"
                aria-checked={notifs[key]}
                onClick={() => toggleNotif(key)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${notifs[key] ? "bg-gray-900" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[key] ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Documents section ────────────────────────────────────────────────────────

function DocumentsSection({ documents }: { documents: AccountProfile["documents"] }) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-sm tracking-widests font-medium text-gray-900">DOCUMENTS</h2>
        <span className="text-xs text-gray-400">View only — contact support to update</span>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-gray-400">No documents on file.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.type} · {doc.fileSize} · Uploaded {doc.uploadedDate}</p>
                </div>
              </div>
              <button className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors flex-shrink-0">
                View
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">To upload or update documents, please contact support.</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountService.getProfile().then((p) => { setProfile(p); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-white border border-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your business profile and preferences.</p>
      </div>

      <BusinessProfileSection
        profile={profile.business}
        onSaved={(d) => setProfile((p) => p ? { ...p, business: d } : p)}
      />
      <ContactDetailsSection
        contact={profile.contact}
        onSaved={(d) => setProfile((p) => p ? { ...p, contact: d } : p)}
      />
      <SecuritySection
        notifications={profile.notifications}
        onNotificationsSaved={(d) => setProfile((p) => p ? { ...p, notifications: d } : p)}
      />
      <DocumentsSection documents={profile.documents} />
    </div>
  );
}
