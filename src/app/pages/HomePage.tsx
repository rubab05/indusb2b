import { Link } from "react-router";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CategoryCard } from "../components/CategoryCard";
import { Footer } from "../components/Footer";
import { UserCheck, Users, ShoppingCart, ClipboardList, FileText, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteContent } from "../../content/site-content";
import { categories } from "../../content/categories";

export default function HomePage() {
  // Hero
  const heroImg = "https://images.unsplash.com/photo-1766289198899-61a45275351b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZWhvbGQlMjBwcm9kdWN0cyUyMG1vZGVybiUyMGhvbWV8ZW58MXx8fHwxNzczMDE5NzYxfDA&ixlib=rb-4.1.0&q=80&w=1080";

  // Category card images — order matches categories.ts (mats, decoration, kitchen, garden, toys)
  const categoryImages = [
    "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nfGVufDF8fHx8MTc3MzAxOTQzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1761311554695-68cfca1f3140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1cHBvcnQlMjBzdGlja3N8ZW58MXx8fHwxNzczMDE5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1759687766677-7d0046ff72f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodWxhJTIwaG9vcHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  // Icons for benefits — order matches siteContent.benefits
  const benefitIcons: LucideIcon[] = [UserCheck, Users, ShoppingCart, ClipboardList, FileText, Shield];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <Hero imageUrl={heroImg} />

      {/* Categories */}
      <section id="categories" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Explore Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.slug}
                title={cat.name}
                imageUrl={categoryImages[i]}
                productCount={cat.productCount}
                href={`/categories/${cat.slug}`}
                b2bLabel={cat.b2bLabel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* B2B Partner Portal CTA */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="text-xs tracking-widest text-gray-400 mb-4">B2B WHOLESALE & DROPSHIP PLATFORM</div>
          <h2 className="text-5xl mb-8 tracking-tight">Apply for B2B Access</h2>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed">
            {siteContent.tradeMessage}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apply/wholesale" className="px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide">
              APPLY AS WHOLESALE PARTNER
            </Link>
            <Link to="/apply/dropship" className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm tracking-wide">
              APPLY AS DROPSHIP PARTNER
            </Link>
            <Link to="/login" className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide">
              LOGIN TO VIEW PRICING
            </Link>
          </div>
        </div>
      </section>

      {/* B2B Flow Process */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 tracking-tight">How Our B2B Platform Works</h2>
            <p className="text-lg text-gray-600">Simple process from application to ordering</p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {siteContent.processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 border-2 border-gray-900">
                  <span className="text-2xl font-light">{step.step}</span>
                </div>
                <h3 className="text-sm tracking-wide mb-3 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Platform Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 tracking-tight">B2B Platform Benefits</h2>
            <p className="text-lg text-gray-600">Complete wholesale and dropship solution for your business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteContent.benefits.map((benefit, i) => {
              const Icon = benefitIcons[i];
              return (
                <div key={benefit.title} className="bg-white border border-gray-100 p-8">
                  <Icon className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
                  <h3 className="text-lg mb-3 tracking-tight">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl mb-8 tracking-tight">About {siteContent.brandName}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            {siteContent.about}
          </p>
          <Link to="/contact" className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
            CONTACT US
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-5xl mb-6 tracking-tight">Trade Enquiries Welcome</h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Whether you're a retailer, distributor, or marketplace seller,<br />
            we're here to help with your wholesale needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
              REQUEST CATALOGUE
            </Link>
            <Link to="/apply" className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide">
              BECOME A STOCKIST
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
