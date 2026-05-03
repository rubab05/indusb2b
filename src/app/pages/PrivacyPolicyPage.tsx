import { ContentPage } from "../components/ContentPage";
import { useCMSPage } from "../../hooks/useCMSPage";
import { brandConfig } from "../../config/brand.config";

const bn = brandConfig.brandName;
const contactEmail = `trade@${brandConfig.domain}`;

export default function PrivacyPolicyPage() {
  const { hasContent, page, loading } = useCMSPage("privacy-policy");

  return (
    <ContentPage
      title="Privacy Policy"
      subtitle={`How ${bn} collects, uses, and protects your data.`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
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
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">1. Who we are</h2>
                <p>
                  {bn} is a B2B wholesale and dropshipping platform operated by Indusfort Limited.
                  References to "we", "us", or "{bn}" in this policy refer to Indusfort Limited.
                </p>
                <p className="mt-3">For data-related enquiries, contact us at: {contactEmail}</p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">2. Data we collect</h2>
                <p>We collect the following categories of data when you register or interact with our platform:</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Business registration details (company name, registration number, address)</li>
                  <li>Contact information (name, email address, telephone number)</li>
                  <li>Order and transaction history</li>
                  <li>Payment references (we do not store card data)</li>
                  <li>Support ticket communications</li>
                  <li>Platform usage data (login activity, pages visited)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">3. How we use your data</h2>
                <p>Your data is used to:</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Process and manage your trade account application</li>
                  <li>Fulfil and communicate on orders</li>
                  <li>Issue invoices and process payments</li>
                  <li>Provide customer support</li>
                  <li>Send account-related communications (order confirmations, shipping updates)</li>
                  <li>Improve the platform and detect fraud</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">4. Lawful basis</h2>
                <p>We process your data under the following lawful bases as defined by UK GDPR:</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li><strong>Contractual necessity</strong> — processing required to fulfil our trading relationship with you</li>
                  <li><strong>Legitimate interests</strong> — fraud prevention, platform security, and business operations</li>
                  <li><strong>Legal obligation</strong> — financial record-keeping and compliance requirements</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">5. Data sharing</h2>
                <p>We do not sell your personal data. We may share data with:</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Logistics and courier partners (for order fulfilment)</li>
                  <li>Payment processors (for transaction processing)</li>
                  <li>IT infrastructure providers (cloud hosting, email services)</li>
                </ul>
                <p className="mt-3">All third parties are contractually bound to handle data in compliance with UK GDPR.</p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">6. Data retention</h2>
                <p>
                  We retain business account and transaction data for a minimum of 7 years to meet HMRC
                  financial record-keeping requirements. Account data may be deleted on request where
                  this does not conflict with legal obligations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">7. Your rights</h2>
                <p>Under UK GDPR, you have the right to:</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Access the personal data we hold about you</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion (where no legal obligation requires retention)</li>
                  <li>Object to processing based on legitimate interests</li>
                  <li>Lodge a complaint with the ICO (ico.org.uk)</li>
                </ul>
                <p className="mt-3">To exercise your rights, contact: {contactEmail}</p>
              </div>

              <div>
                <h2 className="text-2xl tracking-tight text-gray-900 mb-4">8. Policy updates</h2>
                <p>
                  This policy may be updated periodically. The current version will always be available
                  at this URL. Material changes will be communicated by email to registered account holders.
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
