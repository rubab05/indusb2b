import { ContentPage } from "../components/ContentPage";
import { siteContent } from "../../content/site-content";
import { useCMSPage } from "../../hooks/useCMSPage";
import { brandConfig } from "../../config/brand.config";

export default function HowItWorksPage() {
  const { hasContent, page, loading } = useCMSPage("how-it-works");

  return (
    <ContentPage
      title="How It Works"
      subtitle={`${brandConfig.brandName} is a trade-only platform. Here's how to get started as a wholesale or dropship partner.`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "How It Works" }]}
    >
      {loading ? (
        <div className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 animate-pulse rounded max-w-2xl" />
            ))}
          </div>
        </div>
      ) : hasContent ? (
        <div dangerouslySetInnerHTML={{ __html: page!.body }} />
      ) : (
        <>
          {/* Process Steps */}
          <section className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-8">
              <p className="text-xs tracking-widest text-gray-500 mb-6">THE PROCESS</p>
              <h2 className="text-4xl tracking-tight mb-16">Getting started</h2>
              <div className="grid md:grid-cols-5 gap-8">
                {siteContent.processSteps.map((step) => (
                  <div key={step.step}>
                    <div className="text-5xl font-light text-yellow-500 mb-4">{step.step}</div>
                    <h3 className="text-base tracking-tight mb-3">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Wholesale vs Dropship */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-8">
              <p className="text-xs tracking-widest text-gray-500 mb-6">ACCOUNT TYPES</p>
              <h2 className="text-4xl tracking-tight mb-16">Choose your model</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-gray-200 p-10 bg-white">
                  <h3 className="text-2xl tracking-tight mb-4">Wholesale Partner</h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Purchase products in bulk at wholesale prices. Stock your store, warehouse,
                    or outlet with {brandConfig.brandName} products at competitive MOQ-based pricing.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-10">
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Access to wholesale price lists</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Bulk ordering with MOQ tiers</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Volume discount pricing</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Dedicated account management</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Downloadable catalogues and specs</li>
                  </ul>
                  <a href="/apply/wholesale" className="inline-block bg-gray-900 text-white px-8 py-4 text-sm tracking-widest hover:bg-gray-700 transition-colors">
                    APPLY — WHOLESALE
                  </a>
                </div>
                <div className="border border-gray-200 p-10 bg-white">
                  <h3 className="text-2xl tracking-tight mb-4">Dropship Partner</h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Sell {brandConfig.brandName} products through your online store without holding stock.
                    We fulfil orders directly to your customers on your behalf.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-10">
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>No stock holding required</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Pre-funded balance account</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Order placed and fulfilled by {brandConfig.brandName}</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Product data and images provided</li>
                    <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5">—</span>Compatible with Shopify, WooCommerce, and more</li>
                  </ul>
                  <a href="/apply/dropship" className="inline-block bg-gray-900 text-white px-8 py-4 text-sm tracking-widest hover:bg-gray-700 transition-colors">
                    APPLY — DROPSHIP
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Strip */}
          <section className="py-16 bg-gray-900">
            <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl tracking-tight text-white mb-2">Questions before applying?</h2>
                <p className="text-gray-400">Our team is happy to talk you through the right option.</p>
              </div>
              <a href="/contact" className="flex-shrink-0 bg-yellow-500 text-gray-900 px-8 py-4 text-sm tracking-widest font-medium hover:bg-yellow-400 transition-colors">
                CONTACT US
              </a>
            </div>
          </section>
        </>
      )}
    </ContentPage>
  );
}
