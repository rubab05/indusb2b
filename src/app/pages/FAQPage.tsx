import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { ContentPage } from "../components/ContentPage";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "Who can apply for a HOMATZ trade account?",
        a: "HOMATZ accounts are available to registered businesses only — retailers, wholesalers, online sellers, and dropship operators. We do not supply direct to consumers.",
      },
      {
        q: "How long does the application process take?",
        a: "Applications are reviewed within 24–48 business hours. You will receive an email confirmation once your account has been approved or if we need additional information.",
      },
      {
        q: "What is the difference between wholesale and dropship accounts?",
        a: "Wholesale partners purchase stock in bulk at wholesale prices and hold inventory themselves. Dropship partners list HOMATZ products on their own sales channels, and we fulfil orders directly to their customers without the partner needing to hold stock.",
      },
    ],
  },
  {
    category: "Ordering & Pricing",
    items: [
      {
        q: "What are the minimum order quantities (MOQs)?",
        a: "MOQs vary by product and category. Details are provided in your approved partner price list. Some products are available with lower MOQs for trial orders — please contact your account manager.",
      },
      {
        q: "How do I access wholesale pricing?",
        a: "Wholesale pricing is only available to approved partners after account approval. Once approved, you can view and download price lists from your partner portal.",
      },
      {
        q: "Can I request a quote for a large order?",
        a: "Yes. Use the quote request form in your portal or contact our trade team directly. We can accommodate bespoke volume pricing for larger or recurring orders.",
      },
      {
        q: "Do you offer bulk or volume discounts?",
        a: "Yes, tiered pricing is available for most product families. Discount tiers are displayed on the product and price list pages within your partner account.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "Where do you ship to?",
        a: "We currently ship to mainland UK addresses. International shipping options may be available — please contact our trade team to discuss your requirements.",
      },
      {
        q: "What are your standard lead times?",
        a: "Standard lead times are 3–5 business days for in-stock items. Bulk or custom orders may have extended lead times. Your account manager will confirm timelines at the point of ordering.",
      },
      {
        q: "How can I track my order?",
        a: "Tracking information is available in your partner portal under Orders. You will also receive a shipping confirmation email with carrier and tracking details.",
      },
    ],
  },
  {
    category: "Returns & Support",
    items: [
      {
        q: "What is your returns policy?",
        a: "Approved partners may return goods within 14 days of receipt for manufacturing defects or mis-shipped items. Returns for change of mind are assessed on a case-by-case basis. See our Returns Policy for full details.",
      },
      {
        q: "How do I raise a support ticket?",
        a: "You can raise support tickets directly from your partner portal under Support. Our team aims to respond to all tickets within one business day.",
      },
      {
        q: "I am not receiving emails from HOMATZ — what should I do?",
        a: "Please check your spam or junk folder and add trade@homatz.co.uk to your safe senders list. If problems persist, raise a support ticket from your portal.",
      },
    ],
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left gap-8"
      >
        <span className="text-base text-gray-900">{question}</span>
        {open ? (
          <Minus className="w-5 h-5 flex-shrink-0 text-gray-500" />
        ) : (
          <Plus className="w-5 h-5 flex-shrink-0 text-gray-500" />
        )}
      </button>
      {open && (
        <div className="pb-6 text-sm text-gray-600 leading-relaxed max-w-3xl">{answer}</div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <ContentPage
      title="Frequently Asked Questions"
      subtitle="Answers to common questions about the HOMATZ trade platform."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
    >
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl">
            {faqs.map((group) => (
              <div key={group.category} className="mb-16">
                <p className="text-xs tracking-widest text-gray-500 mb-8">
                  {group.category.toUpperCase()}
                </p>
                {group.items.map((item) => (
                  <AccordionItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl tracking-tight text-white mb-2">Still have questions?</h2>
            <p className="text-gray-400">Our trade team is here to help.</p>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 bg-yellow-500 text-gray-900 px-8 py-4 text-sm tracking-widest font-medium hover:bg-yellow-400 transition-colors"
          >
            CONTACT US
          </a>
        </div>
      </section>
    </ContentPage>
  );
}
