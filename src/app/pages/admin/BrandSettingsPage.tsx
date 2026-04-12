import { useState } from "react";
import { useBrand, BrandConfig } from "../../../contexts/BrandContext";
import { toast } from "sonner";


function ColorSwatch({ color }: { color: string }) {
  return (
    <div
      className="w-6 h-6 border border-gray-200 flex-shrink-0"
      style={{ backgroundColor: color || "#ffffff" }}
    />
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900 tracking-wide">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-wide text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function BrandSettingsPage() {
  const { brand, updateBrand, reloadBrand } = useBrand();
  const [form, setForm] = useState<BrandConfig>({ ...brand });
  const [saving, setSaving] = useState(false);

  function set(key: keyof BrandConfig, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    updateBrand(form);
    setSaving(false);
    toast.success("Brand settings saved");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Brand Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your platform's branding. Changes are reflected across the site immediately after saving.</p>
      </div>

      {/* Brand Identity */}
      <SectionCard title="Brand Identity">
        <FormField label="Brand Name">
          <input
            type="text"
            value={form.brandName}
            onChange={(e) => set("brandName", e.target.value)}
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </FormField>
        <FormField label="Primary Logo URL">
          <input
            type="text"
            value={form.logoUrl}
            onChange={(e) => set("logoUrl", e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
          />
          {form.logoUrl && (
            <img src={form.logoUrl} alt="Primary logo preview" className="mt-2 h-12 object-contain border border-gray-100 p-1" />
          )}
        </FormField>
        <FormField label="Secondary Logo URL">
          <input
            type="text"
            value={form.logoSecondaryUrl}
            onChange={(e) => set("logoSecondaryUrl", e.target.value)}
            placeholder="https://example.com/logo-secondary.png"
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
          />
          {form.logoSecondaryUrl && (
            <img src={form.logoSecondaryUrl} alt="Secondary logo preview" className="mt-2 h-12 object-contain border border-gray-100 p-1" />
          )}
        </FormField>
        <FormField label="Favicon URL">
          <input
            type="text"
            value={form.faviconUrl}
            onChange={(e) => set("faviconUrl", e.target.value)}
            placeholder="https://example.com/favicon.ico"
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </FormField>
      </SectionCard>

      {/* Colors */}
      <SectionCard title="Colours">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Primary Colour">
            <div className="flex items-center gap-2">
              <ColorSwatch color={form.primaryColor} />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => set("primaryColor", e.target.value)}
                placeholder="#111827"
                className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 font-mono"
              />
            </div>
          </FormField>
          <FormField label="Secondary Colour">
            <div className="flex items-center gap-2">
              <ColorSwatch color={form.secondaryColor} />
              <input
                type="text"
                value={form.secondaryColor}
                onChange={(e) => set("secondaryColor", e.target.value)}
                placeholder="#6b7280"
                className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 font-mono"
              />
            </div>
          </FormField>
          <FormField label="Accent Colour">
            <div className="flex items-center gap-2">
              <ColorSwatch color={form.accentColor} />
              <input
                type="text"
                value={form.accentColor}
                onChange={(e) => set("accentColor", e.target.value)}
                placeholder="#eab308"
                className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 font-mono"
              />
            </div>
          </FormField>
        </div>
        {/* Color preview strip */}
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-2">Colour preview</p>
          <div className="flex h-8">
            <div className="flex-1" style={{ backgroundColor: form.primaryColor || "#111827" }} title="Primary" />
            <div className="flex-1" style={{ backgroundColor: form.secondaryColor || "#6b7280" }} title="Secondary" />
            <div className="flex-1" style={{ backgroundColor: form.accentColor || "#eab308" }} title="Accent" />
          </div>
          <div className="flex text-xs text-gray-400 mt-1">
            <span className="flex-1 text-center">Primary</span>
            <span className="flex-1 text-center">Secondary</span>
            <span className="flex-1 text-center">Accent</span>
          </div>
        </div>
      </SectionCard>

      {/* Email Branding */}
      <SectionCard title="Email Branding">
        <FormField label="Email Header HTML">
          <textarea
            value={form.emailHeaderHtml}
            onChange={(e) => set("emailHeaderHtml", e.target.value)}
            rows={4}
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors resize-none font-mono"
          />
        </FormField>
      </SectionCard>

      {/* Document Branding */}
      <SectionCard title="Document Branding">
        <FormField label="Invoice Header HTML">
          <textarea
            value={form.invoiceHeaderHtml}
            onChange={(e) => set("invoiceHeaderHtml", e.target.value)}
            rows={4}
            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors resize-none font-mono"
          />
        </FormField>
      </SectionCard>

      {/* Domain */}
      <SectionCard title="Domain">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900 font-mono">{form.domain}</span>
          <span className="text-xs text-gray-400 px-2 py-0.5 border border-gray-200">Read-only</span>
        </div>
        <p className="text-xs text-gray-400">Domain configuration is managed by your system administrator.</p>
      </SectionCard>

      <div className="flex items-center gap-4 pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Brand Settings"}
        </button>
        <button
          onClick={() => setForm({ ...brand })}
          className="px-6 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors"
        >
          Reset Changes
        </button>
      </div>
    </div>
  );
}
