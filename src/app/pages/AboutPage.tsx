import { ContentPage } from "../components/ContentPage";
import { siteContent } from "../../content/site-content";

export default function AboutPage() {
  return (
    <ContentPage
      title="About HOMATZ"
      subtitle="A B2B wholesale and dropshipping platform built for trade buyers across the UK and beyond."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
    >
      {/* Who We Are */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl">
            <p className="text-xs tracking-widest text-gray-500 mb-6">WHO WE ARE</p>
            <h2 className="text-4xl tracking-tight mb-8">Our mission</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">{siteContent.about}</p>
            <p className="text-base text-gray-600 leading-relaxed">
              We operate as a B2B-first platform — designed for trade buyers, wholesale partners,
              and dropship operators looking to source reliable, everyday household product lines
              at competitive pricing with clear order structures.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-500 mb-6">WHAT WE OFFER</p>
          <h2 className="text-4xl tracking-tight mb-16">Platform capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {siteContent.benefits.map((benefit) => (
              <div key={benefit.title} className="border border-gray-200 p-8 bg-white">
                <h3 className="text-lg tracking-tight mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-8 text-center">
          <h2 className="text-4xl tracking-tight text-white mb-6">Ready to partner with us?</h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto">
            Apply for wholesale or dropship access and start sourcing from HOMATZ today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/apply" className="bg-yellow-500 text-gray-900 px-8 py-4 text-sm tracking-widest font-medium hover:bg-yellow-400 transition-colors">
              APPLY FOR ACCESS
            </a>
            <a href="/contact" className="border border-white text-white px-8 py-4 text-sm tracking-widest hover:bg-white hover:text-gray-900 transition-colors">
              CONTACT US
            </a>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
