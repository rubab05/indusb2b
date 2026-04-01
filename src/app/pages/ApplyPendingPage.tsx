import { Link } from "react-router";
import { ContentPage } from "../components/ContentPage";
import { Clock, Mail, CheckCircle2 } from "lucide-react";

export default function ApplyPendingPage() {
  return (
    <ContentPage
      title="Application Received"
      subtitle="Thank you for applying to become a HOMATZ trade partner."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Apply", href: "/apply" }, { label: "Pending" }]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <div className="w-20 h-20 bg-yellow-50 border-2 border-yellow-500 flex items-center justify-center mx-auto mb-8">
            <Clock className="w-10 h-10 text-yellow-600" strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl tracking-tight mb-4">Your application is under review</h2>
          <p className="text-base text-gray-600 leading-relaxed mb-12">
            Our trade team will review your application and get back to you within 24–48 business hours.
            You will receive an email confirmation at the address you provided.
          </p>

          <div className="space-y-4 text-left mb-12">
            {[
              { icon: CheckCircle2, label: "Application submitted successfully" },
              { icon: Mail, label: "Confirmation email sent to your inbox" },
              { icon: Clock, label: "Review completed within 24–48 business hours" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100">
                <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Have questions about your application?
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
            >
              CONTACT OUR TRADE TEAM
            </Link>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
