import { Link } from "react-router";
import { ContentPage } from "../components/ContentPage";
import { Building2, Truck, CheckCircle2 } from "lucide-react";

export default function ApplyPage() {
  return (
    <ContentPage
      title="Apply for Trade Access"
      subtitle="Join HOMATZ as a wholesale or dropship partner. Access approved pricing, bulk ordering, and dedicated account management."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Apply" }]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-24">
            {/* Wholesale */}
            <div className="border border-gray-200 p-10">
              <Building2 className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <p className="text-xs tracking-widest text-gray-500 mb-3">PARTNER TYPE</p>
              <h2 className="text-3xl tracking-tight mb-4">Wholesale Partner</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Purchase stock in bulk at wholesale prices. Ideal for retailers, distributors,
                and market traders who carry inventory. Access category price lists, MOQ information,
                and bulk discount tiers.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "Bulk order pricing with volume discounts",
                  "Minimum order quantities by category",
                  "Dedicated account manager",
                  "Downloadable price lists and catalogues",
                  "Partner portal with order management",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/apply/wholesale"
                className="inline-block px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide"
              >
                APPLY AS WHOLESALE PARTNER
              </Link>
            </div>

            {/* Dropship */}
            <div className="border border-gray-200 p-10">
              <Truck className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <p className="text-xs tracking-widest text-gray-500 mb-3">PARTNER TYPE</p>
              <h2 className="text-3xl tracking-tight mb-4">Dropship Partner</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Sell HOMATZ products without holding stock. We fulfil directly to your customers
                under plain or branded packaging. Ideal for online sellers, marketplace traders,
                and e-commerce businesses.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "No stock holding required",
                  "Direct fulfilment to your customers",
                  "Plain or branded packaging options",
                  "Prepaid balance top-up system",
                  "Real-time order tracking via partner portal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/apply/dropship"
                className="inline-block px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
              >
                APPLY AS DROPSHIP PARTNER
              </Link>
            </div>
          </div>

          {/* Process */}
          <div className="border-t border-gray-100 pt-20">
            <h2 className="text-3xl tracking-tight mb-12 text-center">What Happens After You Apply</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Submit Application", desc: "Complete the relevant form with your business details." },
                { step: "2", title: "Review (24–48 hrs)", desc: "Our team reviews your application and verifies your business." },
                { step: "3", title: "Account Activated", desc: "You receive login credentials and access to your partner portal." },
                { step: "4", title: "Start Ordering", desc: "View pricing, place orders, and manage your account online." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-gray-900">
                    <span className="text-xl font-light">{s.step}</span>
                  </div>
                  <h3 className="text-sm tracking-wide mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?{" "}
              <Link to="/login" className="text-gray-900 underline hover:text-gray-600">
                Log in here
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Questions?{" "}
              <Link to="/contact" className="text-gray-900 underline hover:text-gray-600">
                Contact our trade team
              </Link>
            </p>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
