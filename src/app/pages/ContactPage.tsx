import { Mail, Phone, Clock } from "lucide-react";
import { ContentPage } from "../components/ContentPage";
import { EnquiryForm } from "../components/EnquiryForm";
import { siteContent } from "../../content/site-content";

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact Us"
      subtitle="Get in touch with our trade team for pricing, account queries, and general enquiries."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-16">
            {/* Contact Details */}
            <div className="md:col-span-1 space-y-10">
              <div>
                <p className="text-xs tracking-widest text-gray-500 mb-6">TRADE ENQUIRIES</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  HOMATZ is a trade-only platform. Our team handles enquiries from registered businesses
                  and applicants. For support on an existing account, please use the support section
                  within your portal.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest text-gray-500 mb-1">EMAIL</p>
                    <a
                      href={`mailto:${siteContent.contact.email}`}
                      className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      {siteContent.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest text-gray-500 mb-1">PHONE</p>
                    <a
                      href={`tel:${siteContent.contact.phone}`}
                      className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      {siteContent.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest text-gray-500 mb-1">HOURS</p>
                    <p className="text-sm text-gray-600">Mon–Fri, 9:00–17:30</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <p className="text-xs tracking-widest text-gray-500 mb-4">QUICK LINKS</p>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="/apply" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Apply for a trade account
                    </a>
                  </li>
                  <li>
                    <a href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Frequently asked questions
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="md:col-span-2">
              <p className="text-xs tracking-widest text-gray-500 mb-6">SEND AN ENQUIRY</p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
