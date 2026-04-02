import { Link } from "react-router";
import { ContentPage } from "../components/ContentPage";
import { XCircle } from "lucide-react";

export default function ApplyRestrictedPage() {
  return (
    <ContentPage
      title="Access Restricted"
      subtitle="We were unable to approve your trade account application at this time."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Apply", href: "/apply" }, { label: "Restricted" }]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <div className="w-20 h-20 bg-red-50 border-2 border-red-400 flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl tracking-tight mb-4">Your application was not approved</h2>
          <p className="text-base text-gray-600 leading-relaxed mb-12">
            Unfortunately, we were unable to approve your application based on the information
            provided. This may be due to incomplete details, eligibility requirements, or
            business verification checks.
          </p>

          <div className="bg-gray-50 border border-gray-100 p-8 text-left mb-12">
            <h3 className="text-sm tracking-widest text-gray-700 mb-4">WHAT YOU CAN DO</h3>
            <ul className="space-y-3">
              {[
                "Contact our trade team to discuss your application",
                "Provide additional business documentation if requested",
                "Re-apply with updated information after 30 days",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
            >
              CONTACT TRADE TEAM
            </Link>
            <Link
              to="/apply"
              className="px-8 py-4 border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors text-sm tracking-wide"
            >
              RE-APPLY
            </Link>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
