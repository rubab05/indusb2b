import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductImageGallery } from "../components/ProductImageGallery";
import { SpecTable } from "../components/SpecTable";
import { EnquiryForm } from "../components/EnquiryForm";
import { VariantCard } from "../components/VariantCard";
import { ProductCard } from "../components/ProductCard";
import { ProductCarousel } from "../components/ProductCarousel";
import { CategoryCard } from "../components/CategoryCard";
import { CheckCircle2, Download, FileText, ShoppingCart, LogIn, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("24cm");
  const [selectedCapacity, setSelectedCapacity] = useState("4.5L");
  const [selectedFinish, setSelectedFinish] = useState("Grey");

  // Product images
  const productImages = [
    "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHBvdCUyMGNvb2tpbmclMjBraXRjaGVufGVufDF8fHx8MTc3MzkwODk2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1588279102558-dabc7b32d9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMHBvdCUyMGxpZCUyMGdsYXNzJTIwY29va3dhcmV8ZW58MXx8fHwxNzczOTA4OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1548243325-bf5b90ad929f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3QlMjBoYW5kbGUlMjBkZXRhaWwlMjBraXRjaGVufGVufDF8fHx8MTc3MzkwODk2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  // Related products
  const wokPanImg = "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nJTIwYXNpYW58ZW58MXx8fHwxNzczODcwOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080";
  const fryingPanImg = "https://images.unsplash.com/photo-1560131324-71022d71ee4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnlpbmclMjBwYW4lMjBza2lsbGV0JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const chipPanImg = "https://images.unsplash.com/photo-1688940738506-acfe9334bf5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwZnJ5ZXIlMjBiYXNrZXQlMjBjb29raW5nfGVufDF8fHx8MTc3Mzg3MDk5MHww&ixlib=rb-4.1.0&q=80&w=1080";
  const milkPanImg = "https://images.unsplash.com/photo-1734193259681-1fd359f63205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMG1pbGslMjBwYW4lMjBzYXVjZXBhbnxlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const eggPoacherImg = "https://images.unsplash.com/photo-1601763969974-52eba0369424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2clMjBwb2FjaGVyJTIwcGFuJTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080";

  // Variant images
  const cookwareSetImg = "https://images.unsplash.com/photo-1762922425155-d03e6997e33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29rd2FyZSUyMHNldCUyMGtpdGNoZW4lMjBwb3RzfGVufDF8fHx8MTc3MzgzMzYwM3ww&ixlib=rb-4.1.0&q=80&w=1080";

  // Category links
  const fruitBasketImg = "https://images.unsplash.com/photo-1709406221293-cbbe118fd94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlJTIwZnJ1aXQlMjBiYXNrZXQlMjBraXRjaGVufGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080";
  const plateRackImg = "https://images.unsplash.com/photo-1688318375271-b25e13f196ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNoJTIwZHJ5aW5nJTIwcmFjayUyMHBsYXRlfGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080";

  const specs = [
    {
      variant: "Stock Pot 4.5L / 24cm",
      diameter: "24cm",
      capacity: "4.5L",
      material: "Aluminium",
      hobCompatibility: "Induction / Gas Compatible",
      lidIncluded: "Glass lid included",
      finish: "Grey finish"
    },
    {
      variant: "Stock Pot 3.0L / 20cm",
      diameter: "20cm",
      capacity: "3.0L",
      material: "Aluminium",
      hobCompatibility: "Induction / Gas Compatible",
      lidIncluded: "Glass lid included",
      finish: "Grey finish"
    },
    {
      variant: "Stock Pot 6.5L / 28cm",
      diameter: "28cm",
      capacity: "6.5L",
      material: "Aluminium",
      hobCompatibility: "Induction / Gas Compatible",
      lidIncluded: "Glass lid included",
      finish: "Grey finish"
    },
    {
      variant: "Cookware Set (3-piece)",
      diameter: "Various",
      capacity: "Various",
      material: "Aluminium",
      hobCompatibility: "Induction / Gas Compatible",
      lidIncluded: "Glass lids included",
      finish: "Grey finish"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/#categories" },
              { label: "Kitchen & Household", href: "/categories/kitchen-household" },
              { label: "Stock Pots" },
              { label: "Stock Pot 4.5L / 24cm" }
            ]}
          />
        </div>
      </div>

      {/* Product Hero */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Image Gallery */}
            <div>
              <ProductImageGallery images={productImages} />
            </div>

            {/* Right: Product Info */}
            <div>
              <div className="text-xs tracking-widest text-gray-500 mb-4">KITCHEN & HOUSEHOLD</div>
              <h1 className="text-5xl mb-6 tracking-tight">Stock Pot 4.5L / 24cm</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                A practical non-stick stock pot with glass lid, designed for everyday cooking and suitable 
                for trade buyers looking to stock versatile kitchen essentials.
              </p>

              {/* Selectors */}
              <div className="space-y-6 mb-10">
                {/* Size Selector */}
                <div>
                  <label className="block text-sm mb-3 text-gray-900">Select Size</label>
                  <div className="flex gap-3">
                    {["20cm", "24cm", "28cm"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 text-sm tracking-wide transition-colors ${
                          selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity Selector */}
                <div>
                  <label className="block text-sm mb-3 text-gray-900">Select Capacity</label>
                  <div className="flex gap-3">
                    {["3.0L", "4.5L", "6.5L"].map((capacity) => (
                      <button
                        key={capacity}
                        onClick={() => setSelectedCapacity(capacity)}
                        className={`px-6 py-3 border-2 text-sm tracking-wide transition-colors ${
                          selectedCapacity === capacity
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {capacity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finish Selector */}
                <div>
                  <label className="block text-sm mb-3 text-gray-900">Select Colour / Finish</label>
                  <div className="flex gap-3">
                    {["Grey", "Black", "Silver"].map((finish) => (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-6 py-3 border-2 text-sm tracking-wide transition-colors ${
                          selectedFinish === finish
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4 mb-6">
                <button className="w-full px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  REQUEST QUOTE
                </button>
                <button className="w-full px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO ENQUIRY
                </button>
                <button className="w-full px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  LOGIN TO VIEW PRICING
                </button>
                <button className="w-full px-8 py-4 border-2 border-gray-200 text-gray-900 hover:border-gray-400 transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  DOWNLOAD SPEC SHEET
                </button>
              </div>

              {/* B2B Pricing Notice */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6">
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong>Trade pricing available after account approval.</strong> Apply for wholesale or dropship access to view partner-specific pricing.
                </p>
              </div>

              {/* MOQ & Bulk Notice */}
              <div className="bg-gray-50 border border-gray-200 p-4 mb-10">
                <p className="text-sm text-gray-700 leading-relaxed">
                  MOQ rules may apply by product or category. Contact our B2B team for bulk ordering and volume discount information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Overview */}
            <div>
              <h2 className="text-3xl mb-6 tracking-tight">Overview</h2>
              <p className="text-base text-gray-600 leading-relaxed">
                A versatile cookware option designed for modern everyday kitchens, combining a practical 
                non-stick interior, glass lid, and easy handling.
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-3xl mb-6 tracking-tight">Key Features</h2>
              <ul className="space-y-3">
                {[
                  "Versatile 3-in-1 pot",
                  "Quick clean surface",
                  "Efficient heat transmission",
                  "Even heat spreading",
                  "Superior heat retention",
                  "Glass lid included",
                  "Heat-resistant side handles"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-base text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h2 className="text-3xl mb-6 tracking-tight">Use Cases</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                Perfect for a wide range of everyday cooking needs:
              </p>
              <div className="flex flex-wrap gap-3">
                {["Soups", "Sauces", "Pasta", "Stock", "Family meals", "General stovetop cooking"].map((useCase) => (
                  <span key={useCase} className="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-700">
                    {useCase}
                  </span>
                ))}
              </div>
            </div>

            {/* Why It Works for Retail */}
            <div>
              <h2 className="text-3xl mb-6 tracking-tight">Why It Works for Retail</h2>
              <p className="text-base text-gray-600 leading-relaxed">
                A practical cookware line with broad household relevance, easy merchandising, and strong 
                compatibility with larger kitchen and cookware ranges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specification Table */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-12 tracking-tight">Specifications & Size Guide</h2>
          <SpecTable specs={specs} />
        </div>
      </section>

      {/* Related Variants */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-12 tracking-tight">Variants & Options</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <VariantCard 
              title="Stock Pot 3.0L / 20cm"
              imageUrl={productImages[1]}
              capacity="3.0L"
              diameter="20cm"
            />
            <VariantCard 
              title="Stock Pot 6.5L / 28cm"
              imageUrl={productImages[2]}
              capacity="6.5L"
              diameter="28cm"
            />
            <VariantCard 
              title="Cookware Set (3-piece)"
              imageUrl={cookwareSetImg}
              capacity="Various"
              diameter="Various"
            />
          </div>
        </div>
      </section>

      {/* Commonly Bought With */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-12 tracking-tight">Commonly Bought With</h2>
          
          <ProductCarousel slidesToShow={5}>
            <div className="px-4">
              <ProductCard name="Wok Pan with Glass Lid 32cm" imageUrl={wokPanImg} />
            </div>
            <div className="px-4">
              <ProductCard name="Non Stick Frying Pan 30cm" imageUrl={fryingPanImg} />
            </div>
            <div className="px-4">
              <ProductCard name="Chip Pan with Basket" imageUrl={chipPanImg} />
            </div>
            <div className="px-4">
              <ProductCard name="Milk Pot 14cm" imageUrl={milkPanImg} />
            </div>
            <div className="px-4">
              <ProductCard name="Egg Poacher Pan" imageUrl={eggPoacherImg} />
            </div>
          </ProductCarousel>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8">
          <EnquiryForm />
        </div>
      </section>

      {/* Support Block */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gray-50 border border-gray-200 p-10 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-6 text-gray-900" strokeWidth={1.5} />
            <h2 className="text-2xl mb-4 tracking-tight">Have a Product Question?</h2>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Need account-specific help or have questions about this product?<br />
              Our B2B support team is here to assist with product queries, MOQ requirements, and ordering.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
                CONTACT SUPPORT
              </button>
              <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide">
                LIVE CHAT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-12 tracking-tight">Related Categories</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <CategoryCard title="Kitchen & Household" imageUrl={wokPanImg} productCount={68} href="/categories/kitchen-household" />
            <CategoryCard title="Fruit Baskets" imageUrl={fruitBasketImg} productCount={12} />
            <CategoryCard title="Corner Plate Racks" imageUrl={plateRackImg} productCount={8} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}