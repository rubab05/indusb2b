import { ContentPage } from "../components/ContentPage";

export default function ReturnsPage() {
  return (
    <ContentPage
      title="Returns Policy"
      subtitle="How to request a return or report an issue with your HOMATZ order."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Returns" }]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl space-y-12 text-sm text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Eligible return reasons</h2>
              <p>HOMATZ accepts returns for the following reasons:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Manufacturing defects confirmed on inspection</li>
                <li>Items damaged in transit (must be reported within 48 hours of delivery)</li>
                <li>Incorrect items dispatched (wrong product or variant)</li>
                <li>Significant discrepancy in quantity from the order</li>
              </ul>
              <p className="mt-4">
                Returns for change of mind or over-ordering are assessed on a case-by-case basis and
                may be subject to a restocking fee. We do not accept returns of seasonal or clearance items.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Return window</h2>
              <p>
                Returns must be requested within 14 days of the delivery date. Requests outside this
                window will not be accepted unless the goods have a confirmed latent manufacturing defect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">How to raise a return</h2>
              <ol className="mt-3 space-y-3 list-decimal pl-5">
                <li>Log into your partner portal and navigate to <strong>Support → New Request</strong></li>
                <li>Select <strong>Returns / Delivery Issue</strong> as the category</li>
                <li>Enter your order number and describe the issue</li>
                <li>Attach photos of any damaged or incorrect items</li>
                <li>Submit — our team will respond within one business day</li>
              </ol>
              <p className="mt-4">
                Do not return goods without prior authorisation. Unauthorised returns may be refused
                or returned to sender at your cost.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Return logistics</h2>
              <p>
                Where a return is approved, we will provide a prepaid returns label for defective or
                incorrectly dispatched goods. For other return types, the partner is responsible for
                return shipping costs unless agreed otherwise.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Refunds and credits</h2>
              <p>Approved returns will be resolved via one of the following, at our discretion:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Credit note applied to your HOMATZ account</li>
                <li>Replacement goods dispatched</li>
                <li>Refund to your original payment method (where applicable)</li>
              </ul>
              <p className="mt-3">
                Refund processing takes 5–10 business days once the return has been received and inspected.
              </p>
            </div>

            <div>
              <h2 className="text-2xl tracking-tight text-gray-900 mb-4">Contact us</h2>
              <p>
                For any questions about a return or delivery issue, raise a support ticket from your
                portal or email us at{" "}
                <a href="mailto:trade@homatz.co.uk" className="text-gray-900 underline">
                  trade@homatz.co.uk
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
