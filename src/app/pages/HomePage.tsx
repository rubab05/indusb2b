import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CategoryCard } from "../components/CategoryCard";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { Package, ShoppingCart, Truck, Award, UserCheck, FileText, ClipboardList, BarChart3, Users, Shield } from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
  // Hero
  const heroImg = "https://images.unsplash.com/photo-1766289198899-61a45275351b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZWhvbGQlMjBwcm9kdWN0cyUyMG1vZGVybiUyMGhvbWV8ZW58MXx8fHwxNzczMDE5NzYxfDA&ixlib=rb-4.1.0&q=80&w=1080";

  // Categories
  const shaggyRugImg = "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080";
  const waxBurnerImg = "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080";
  const wokPanImg = "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nfGVufDF8fHx8MTc3MzAxOTQzMHww&ixlib=rb-4.1.0&q=80&w=1080";
  const plantSupportImg = "https://images.unsplash.com/photo-1761311554695-68cfca1f3140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1cHBvcnQlMjBzdGlja3N8ZW58MXx8fHwxNzczMDE5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080";
  const hulaHoopImg = "https://images.unsplash.com/photo-1759687766677-7d0046ff72f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodWxhJTIwaG9vcHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080";

  // Products
  const doorMatImg = "https://images.unsplash.com/photo-1678637651440-dc1c17da0a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwbWF0JTIwZW50cmFuY2V8ZW58MXx8fHwxNzczMDE5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080";
  const stockPotImg = "https://images.unsplash.com/photo-1545287072-3c332a7acaf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMHBvdCUyMHN0YWlubGVzcyUyMHN0ZWVsfGVufDF8fHx8MTc3MzAxOTQyOHww&ixlib=rb-4.1.0&q=80&w=1080";
  const plateRackImg = "https://images.unsplash.com/photo-1769515376350-bcff86d49499?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF0ZSUyMHJhY2slMjBraXRjaGVufGVufDF8fHx8MTc3MzAxOTQyOHww&ixlib=rb-4.1.0&q=80&w=1080";
  const bambooCaneImg = "https://images.unsplash.com/photo-1594843177984-95367ac98040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBjYW5lcyUyMGdhcmRlbnxlbnwxfHx8fDE3NzMwMTk0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const christmasTreeImg = "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const chindiRugImg = "https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHJhZyUyMHJ1Z3xlbnwxfHx8fDE3NzMwMTk0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const hedgeImg = "https://images.unsplash.com/photo-1770160451129-22a0f8dbe539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaGVkZ2UlMjBmZW5jZXxlbnwxfHx8fDE3NzMwMTk0MzB8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const fryingPanImg = "https://images.unsplash.com/photo-1581622558638-818128465982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnlpbmclMjBwYW4lMjBraXRjaGVufGVufDF8fHx8MTc3MzAxOTQzMXww&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <Hero imageUrl={heroImg} />

      {/* Categories */}
      {/* <section id="categories" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Explore Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <CategoryCard title="Mats & Rugs" imageUrl={shaggyRugImg} productCount={45} href="/categories/kitchen-household" b2bLabel="MOQ AVAILABLE" />
            <CategoryCard title="Decoration & Seasonal" imageUrl={waxBurnerImg} productCount={32} href="/categories/kitchen-household" b2bLabel="BULK ORDER READY" />
            <CategoryCard title="Kitchen & Household" imageUrl={wokPanImg} productCount={68} href="/categories/kitchen-household" b2bLabel="DROPSHIP ELIGIBLE" />
            <CategoryCard title="Garden & Outdoor" imageUrl={plantSupportImg} productCount={28} href="/categories/kitchen-household" b2bLabel="WHOLESALE PRICING" />
            <CategoryCard title="Toys & Games" imageUrl={hulaHoopImg} productCount={15} href="/categories/kitchen-household" b2bLabel="MOQ AVAILABLE" />
          </div>
        </div>
      </section> */}
      
      {/* Categories */}
      <section id="categories" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Explore Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <CategoryCard 
              title="Mats & Rugs" 
              imageUrl={shaggyRugImg} 
              productCount={45} 
              href="/categories/kitchen-household" 
              b2bLabel="MOQ AVAILABLE" 
            />
            <CategoryCard 
              title="Decoration & Seasonal" 
              imageUrl={waxBurnerImg} 
              productCount={32} 
              href="/categories/kitchen-household" 
              b2bLabel="BULK ORDER READY" 
            />
            <CategoryCard 
              title="Kitchen & Household" 
              imageUrl={wokPanImg} 
              productCount={68} 
              href="/categories/kitchen-household" 
              b2bLabel="DROPSHIP ELIGIBLE" 
            />
            <CategoryCard 
              title="Garden & Outdoor" 
              imageUrl={plantSupportImg} 
              productCount={28} 
              href="/categories/kitchen-household" 
              b2bLabel="WHOLESALE PRICING" 
            />
            <CategoryCard 
              title="Toys & Games" 
              imageUrl={hulaHoopImg} 
              productCount={15} 
              href="/categories/kitchen-household" 
              b2bLabel="MOQ AVAILABLE" 
            />
          </div>
        </div>
      </section>




      {/* B2B Partner Portal CTA */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="text-xs tracking-widest text-gray-400 mb-4">B2B WHOLESALE & DROPSHIP PLATFORM</div>
          <h2 className="text-5xl mb-8 tracking-tight">Apply for B2B Access</h2>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed">
            Join our B2B partner network as a wholesale or dropship partner.<br />
            Access approved pricing, bulk ordering, and dedicated account management.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide">
              APPLY AS WHOLESALE PARTNER
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm tracking-wide">
              APPLY AS DROPSHIP PARTNER
            </button>
            <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide">
              LOGIN TO VIEW PRICING
            </button>
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
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 border-2 border-gray-900">
                <span className="text-2xl font-light">1</span>
              </div>
              <h3 className="text-sm tracking-wide mb-3 text-gray-900">Apply as a Business</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Submit your company details and choose wholesale or dropship
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 border-2 border-gray-900">
                <span className="text-2xl font-light">2</span>
              </div>
              <h3 className="text-sm tracking-wide mb-3 text-gray-900">Get Approved by Admin</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our team reviews and approves your account within 24-48 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 border-2 border-gray-900">
                <span className="text-2xl font-light">3</span>
              </div>
              <h3 className="text-sm tracking-wide mb-3 text-gray-900">Access Pricing & Tools</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                View wholesale prices, MOQs, and downloadable price lists
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 border-2 border-gray-900">
                <span className="text-2xl font-light">4</span>
              </div>
              <h3 className="text-sm tracking-wide mb-3 text-gray-900">Place Orders</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Submit wholesale or dropship orders directly through your portal
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-50 border-2 border-gray-900">
                <span className="text-2xl font-light">5</span>
              </div>
              <h3 className="text-sm tracking-wide mb-3 text-gray-900">Track & Manage</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Monitor orders, invoices, tracking, and support tickets
              </p>
            </div>
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
            <div className="bg-white border border-gray-100 p-8">
              <UserCheck className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Business Registration & Approval</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Secure account creation with admin approval process. Role-based access for wholesale and dropship partners.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8">
              <Users className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Wholesale & Dropship Access</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose your business model. Access partner-specific pricing, MOQs, and ordering workflows.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8">
              <ShoppingCart className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">MOQ & Bulk Ordering</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Minimum order quantities by product or category. Bulk pricing tiers and volume discounts available.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8">
              <ClipboardList className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Account Management Portal</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Manage orders, view invoices, track shipments, and access support tickets from your dedicated account area.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8">
              <FileText className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Downloadable Price Lists</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access approved wholesale price lists by category. Download spec sheets and product catalogues.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8">
              <Shield className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Whitelabel-Ready Platform</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Multi-brand and multi-domain architecture. Enterprise-grade system built for scalability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl mb-8 tracking-tight">About HOMATZ</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            HOMATZ develops and sources high quality household products, specifically focused on everyday house items. 
            Our range is built around practical use, accessible design, and category breadth, helping trade buyers 
            source reliable household product lines.
          </p>
          <button className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
            CONTACT US
          </button>
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
            <button className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
              REQUEST CATALOGUE
            </button>
            <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide">
              BECOME A STOCKIST
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}