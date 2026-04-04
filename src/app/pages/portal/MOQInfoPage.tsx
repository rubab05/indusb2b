import { MOQ_RULES, BULK_DISCOUNTS } from "../../../services/pricing.service";

export default function MOQInfoPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl tracking-tight text-gray-900">MOQ & Ordering Rules</h1>
        <p className="text-sm text-gray-500 mt-1">Everything you need to know about minimum quantities, bulk pricing, and ordering terms.</p>
      </div>

      {/* What is MOQ */}
      <div className="bg-white border border-gray-200 p-8">
        <h2 className="text-sm tracking-widests text-gray-900 mb-4">MINIMUM ORDER QUANTITIES</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Each product category has a minimum order quantity (MOQ) per SKU. This is the smallest number of units you can order for a single product line. You can mix different SKUs on the same order as long as each line meets its individual MOQ.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Orders that do not meet MOQ requirements will be flagged before checkout. Our team is happy to discuss break-bulk arrangements for high-volume customers.
        </p>
      </div>

      {/* Per-category MOQ table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs tracking-widests text-gray-500">MOQ BY CATEGORY</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Category", "MOQ", "Unit", "Notes"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs tracking-widests text-gray-500 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOQ_RULES.map((rule) => (
              <tr key={rule.category} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{rule.category}</td>
                <td className="px-6 py-4 text-gray-900">{rule.moq}</td>
                <td className="px-6 py-4 text-gray-600">{rule.unit}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{rule.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk discount tiers */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs tracking-widests text-gray-500">BULK DISCOUNT TIERS</p>
        </div>
        <div className="grid sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {BULK_DISCOUNTS.map((tier) => (
            <div key={tier.tierLabel} className="p-6 text-center">
              <p className="text-xs tracking-widests text-gray-500 mb-2">{tier.tierLabel.toUpperCase()}</p>
              <p className="text-2xl font-light text-gray-900 mb-1">
                {tier.discountPercent > 0 ? `${tier.discountPercent}%` : "—"}
              </p>
              <p className="text-xs text-gray-500">Min. spend {tier.minSpend} per order</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            Discounts apply automatically at checkout based on order subtotal. Tiers cannot be combined with promotional pricing.
          </p>
        </div>
      </div>

      {/* Lead times & payment terms */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs tracking-widests text-gray-500 mb-4">LEAD TIMES</p>
          <div className="space-y-3 text-sm">
            {[
              { label: "Standard stock items", value: "2–4 working days" },
              { label: "Large / pallet orders", value: "3–5 working days" },
              { label: "Out-of-season / special order", value: "6–10 working days" },
              { label: "Express (on request)", value: "Next working day*" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-900 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">*Express available for orders placed before 11am. Surcharge applies.</p>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <p className="text-xs tracking-widests text-gray-500 mb-4">PAYMENT TERMS</p>
          <div className="space-y-3 text-sm">
            {[
              { label: "New accounts", value: "Proforma (payment upfront)" },
              { label: "Established accounts", value: "Net 30 days" },
              { label: "Gold tier partners", value: "Net 45 days" },
              { label: "Accepted methods", value: "BACS, Card, CHAPS" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-900 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Credit terms subject to account review. Contact your account manager to discuss.</p>
        </div>
      </div>
    </div>
  );
}
