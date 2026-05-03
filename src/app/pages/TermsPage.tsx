import { ContentPage } from "../components/ContentPage";
import { useCMSPage } from "../../hooks/useCMSPage";
import { brandConfig } from "../../config/brand.config";

const bn = brandConfig.brandName;

export default function TermsPage() {
  const { hasContent, page, loading } = useCMSPage("terms");

  return (
    <ContentPage
      title="Terms & Conditions"
      subtitle={`Terms governing use of the ${bn} B2B platform and trading relationship.`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
    >
      {loading ? (
        <div className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 animate-pulse rounded max-w-3xl" />
            ))}
          </div>
        </div>
      ) : hasContent ? (
        <div dangerouslySetInnerHTML={{ __html: page!.body }} />
      ) : (
        <section className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="max-w-3xl space-y-12 text-sm text-gray-600 leading-relaxed">
              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">1. Definitions</h2>
                <p>
                  "{bn}" or "we" refers to Indusfort Limited, operators of the {bn} B2B platform.
                  "Partner" refers to any registered wholesale or dropship account holder. "Platform"
                  refers to the {bn} web application, partner portal, and associated services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">2. Account eligibility</h2>
                <p>Access to the {bn} platform is restricted to registered UK businesses. By applying, you confirm that:</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>You are acting on behalf of a legitimately registered business entity</li>
                  <li>The business information provided during registration is accurate</li>
                  <li>You have authority to bind the business to these terms</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">3. Orders and pricing</h2>
                <p>
                  All prices are exclusive of VAT unless otherwise stated. Minimum order quantities (MOQs)
                  apply as specified on product and price list pages. Orders placed are subject to stock
                  availability. We reserve the right to refuse or cancel orders at our discretion.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">4. Payment terms</h2>
                <p>
                  Payment terms are set at the point of account approval and may vary by partner type and
                  credit arrangement. Wholesale partners on account terms must settle invoices within the
                  agreed period. Dropship partners operate on a pre-funded balance model — orders will only
                  be processed where sufficient balance is held.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">5. Delivery and risk</h2>
                <p>
                  Risk in goods passes to the partner on delivery. Title remains with {bn} until full
                  payment is received. Delivery timescales are indicative and {bn} accepts no liability
                  for delays caused by third-party carriers, customs, or force majeure events.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">6. Returns and defects</h2>
                <p>
                  Faulty or mis-shipped goods may be returned within 14 days of receipt. Partners must
                  notify us of any discrepancies within 48 hours of delivery. Returns must be pre-authorised
                  by our team. See the <a href="/returns" className="text-gray-900 underline">Returns Policy</a> for full details.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">7. Confidentiality</h2>
                <p>
                  Partner pricing, terms, and account information are confidential. Partners must not
                  disclose {bn} wholesale pricing to consumers or publish it on publicly accessible platforms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">8. Limitation of liability</h2>
                <p>
                  {bn}'s liability to any partner shall not exceed the value of the relevant order in dispute.
                  We accept no liability for indirect or consequential losses including lost profit or business interruption.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">9. Governing law</h2>
                <p>
                  These terms are governed by the laws of England and Wales. Any disputes shall be subject
                  to the exclusive jurisdiction of the courts of England and Wales.
                </p>
                <p className="mt-3 text-gray-400">Last updated: April 2026</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </ContentPage>
  );
}
