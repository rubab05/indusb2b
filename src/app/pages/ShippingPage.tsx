import { ContentPage } from "../components/ContentPage";

export default function ShippingPage() {
  return (
    <ContentPage
      title="Shipping Information"
      subtitle="Delivery options, lead times, and logistics information for HOMATZ trade partners."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shipping" }]}
    >
      {/* Summary Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="border border-gray-200 p-8">
              <p className="text-xs tracking-widest text-gray-500 mb-4">STANDARD DELIVERY</p>
              <h3 className="text-xl tracking-tight mb-3">3–5 Business Days</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                For in-stock items. Applies to most wholesale and dropship orders placed before
                12:00 noon on working days.
              </p>
            </div>
            <div className="border border-gray-200 p-8">
              <p className="text-xs tracking-widest text-gray-500 mb-4">BULK / PALLET ORDERS</p>
              <h3 className="text-xl tracking-tight mb-3">5–10 Business Days</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Large volume orders may require additional handling and dispatch time.
                Your account manager will confirm lead times at order placement.
              </p>
            </div>
            <div className="border border-gray-200 p-8">
              <p className="text-xs tracking-widest text-gray-500 mb-4">DELIVERY AREA</p>
              <h3 className="text-xl tracking-tight mb-3">Mainland UK</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We ship to all mainland UK addresses. Delivery to Northern Ireland, Scottish Highlands,
                and islands may incur surcharges or extended lead times.
              </p>
            </div>
          </div>

          <div className="max-w-3xl space-y-12 text-sm text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Tracking your order</h2>
              <p>
                All orders include carrier tracking. Once your order is dispatched, a tracking reference
                will be emailed to you and made available in your partner portal under Orders. You can
                track directly with the carrier using this reference.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Dropship fulfilment</h2>
              <p>
                For dropship partners, orders are fulfilled directly to your customer's address as provided
                at the point of order. Packaging is plain or branded as per your account configuration.
                Shipping confirmation is sent to the partner portal — we do not contact your customers directly.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Delivery discrepancies</h2>
              <p>
                Any delivery shortages, damage in transit, or incorrect items must be reported within
                48 hours of receipt. Please raise a support ticket from your partner portal and include
                your order number and supporting photos where available.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">International shipping</h2>
              <p>
                We do not currently offer standard international shipping. If you require delivery
                outside mainland UK, please contact our trade team to discuss your specific requirements
                and we will assess on a case-by-case basis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
