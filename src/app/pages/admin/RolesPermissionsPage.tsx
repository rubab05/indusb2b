import { useState } from "react";
import { toast } from "sonner";

interface Permission {
  key: string;
  label: string;
}

interface PermissionState {
  wholesale: boolean;
  dropship: boolean;
  admin: boolean;
}

const PERMISSIONS: Permission[] = [
  { key: "view_prices", label: "View Prices" },
  { key: "place_orders", label: "Place Orders" },
  { key: "download_price_lists", label: "Download Price Lists" },
  { key: "view_invoices", label: "View Invoices" },
  { key: "access_support", label: "Access Support" },
  { key: "view_balance_ledger", label: "View Balance & Ledger" },
  { key: "manage_content", label: "Manage Content" },
  { key: "manage_partners", label: "Manage Partners" },
  { key: "manage_pricing", label: "Manage Pricing" },
];

const DEFAULT_PERMISSIONS: Record<string, PermissionState> = {
  view_prices: { wholesale: true, dropship: true, admin: true },
  place_orders: { wholesale: true, dropship: true, admin: true },
  download_price_lists: { wholesale: true, dropship: false, admin: true },
  view_invoices: { wholesale: true, dropship: true, admin: true },
  access_support: { wholesale: true, dropship: true, admin: true },
  view_balance_ledger: { wholesale: false, dropship: true, admin: true },
  manage_content: { wholesale: false, dropship: false, admin: true },
  manage_partners: { wholesale: false, dropship: false, admin: true },
  manage_pricing: { wholesale: false, dropship: false, admin: true },
};

export default function RolesPermissionsPage() {
  const [permissions, setPermissions] = useState<Record<string, PermissionState>>(DEFAULT_PERMISSIONS);

  function toggle(permKey: string, role: keyof PermissionState) {
    setPermissions((prev) => ({
      ...prev,
      [permKey]: { ...prev[permKey], [role]: !prev[permKey][role] },
    }));
  }

  function handleSave() {
    toast.success("Permissions saved");
  }

  const roles: { key: keyof PermissionState; label: string; color: string }[] = [
    { key: "wholesale", label: "Wholesale", color: "text-blue-700" },
    { key: "dropship", label: "Dropship", color: "text-purple-700" },
    { key: "admin", label: "Admin", color: "text-gray-900" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">Roles & Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">Configure what each partner role can access and do on the platform.</p>
      </div>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs tracking-widest text-gray-500 font-normal w-64">
                PERMISSION
              </th>
              {roles.map((role) => (
                <th key={role.key} className={`px-6 py-4 text-center text-xs tracking-widest font-medium ${role.color}`}>
                  {role.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PERMISSIONS.map((perm) => (
              <tr key={perm.key} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900 font-medium">{perm.label}</td>
                {roles.map((role) => (
                  <td key={role.key} className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={permissions[perm.key][role.key]}
                      onChange={() => toggle(perm.key, role.key)}
                      className="w-4 h-4 accent-gray-900 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Save Permissions
        </button>
        <p className="text-xs text-gray-400">Changes take effect immediately for new sessions.</p>
      </div>
    </div>
  );
}
