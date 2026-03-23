import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { SubcategoryCard } from "../components/SubcategoryCard";
import { FeaturedProductCard } from "../components/FeaturedProductCard";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductCarousel } from "../components/ProductCarousel";
import { CheckCircle2, Download, FileText, HelpCircle } from "lucide-react";

export default function KitchenCategoryPage() {
  // Product images for hero collage
  const stockPotImg = "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const wokPanImg = "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nJTIwYXNpYW58ZW58MXx8fHwxNzczODcwOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080";
  const fryingPanImg = "https://images.unsplash.com/photo-1560131324-71022d71ee4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnlpbmclMjBwYW4lMjBza2lsbGV0JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const fruitBasketImg = "https://images.unsplash.com/photo-1709406221293-cbbe118fd94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlJTIwZnJ1aXQlMjBiYXNrZXQlMjBraXRjaGVufGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080";
  const plateRackImg = "https://images.unsplash.com/photo-1688318375271-b25e13f196ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNoJTIwZHJ5aW5nJTIwcmFjayUyMHBsYXRlfGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080";
  const radiatorAirerImg = "https://images.unsplash.com/photo-1599028274529-31020a1fc1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGVzJTIwZHJ5aW5nJTIwcmFjayUyMHJhZGlhdG9yfGVufDF8fHx8MTc3Mzg3MDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080";
  const rotaryDryerImg = "https://images.unsplash.com/photo-1761551022779-1b09f0762297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhcnklMjB3YXNoaW5nJTIwbGluZSUyMG91dGRvb3J8ZW58MXx8fHwxNzczODcwOTg2fDA&ixlib=rb-4.1.0&q=80&w=1080";
  const chipPanImg = "https://images.unsplash.com/photo-1688940738506-acfe9334bf5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwZnJ5ZXIlMjBiYXNrZXQlMjBjb29raW5nfGVufDF8fHx8MTc3Mzg3MDk5MHww&ixlib=rb-4.1.0&q=80&w=1080";
  const milkPanImg = "https://images.unsplash.com/photo-1734193259681-1fd359f63205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMG1pbGslMjBwYW4lMjBzYXVjZXBhbnxlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const eggPoacherImg = "https://images.unsplash.com/photo-1601763969974-52eba0369424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2clMjBwb2FjaGVyJTIwcGFuJTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080";

  // Related categories
  const shaggyRugImg = "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080";
  const waxBurnerImg = "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080";
  const plantSupportImg = "https://images.unsplash.com/photo-1761311554695-68cfca1f3140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1cHBvcnQlMjBzdGlja3N8ZW58MXx8fHwxNzczMDE5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080";

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
              { label: "Kitchen & Household" }
            ]}
          />
        </div>
      </div>

      {/* Category Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="text-xs tracking-widest text-gray-500 mb-4">KITCHEN & HOUSEHOLD</div>
              <h1 className="text-5xl mb-8 tracking-tight leading-tight">Kitchen & Household</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                Explore HOMATZ cookware, organisers, and household utility products designed around everyday convenience. 
                From stock pots and wok pans to corner racks and drying solutions, this category combines practical function 
                with broad retail appeal.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
                  REQUEST CATEGORY CATALOGUE
                </button>
                <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide">
                  ENQUIRE ABOUT THIS RANGE
                </button>
              </div>
            </div>

            {/* Right: Product Collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <ImageWithFallback src={stockPotImg} alt="Stock Pot" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <ImageWithFallback src={fruitBasketImg} alt="Fruit Basket" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <ImageWithFallback src={wokPanImg} alt="Wok Pan" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <ImageWithFallback src={plateRackImg} alt="Corner Plate Rack" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Strip */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8 text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            A practical household category covering cookware, storage, and drying solutions for everyday home use.
          </p>
        </div>
      </section>

      {/* Trade Utility Strip */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-yellow-500 text-gray-900 text-xs tracking-wide">
                PRICING VISIBLE AFTER APPROVAL
              </div>
              <div className="px-4 py-2 border border-gray-300 text-gray-700 text-xs tracking-wide">
                MOQ & BULK ORDERING AVAILABLE
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-xs tracking-wide flex items-center gap-2">
                <Download className="w-4 h-4" />
                REQUEST CATEGORY PRICE LIST
              </button>
              <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-xs tracking-wide flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                ASK ABOUT MOQ
              </button>
              <button className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-xs tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4" />
                APPLY FOR TRADE ACCESS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategory Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Browse Subcategories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <SubcategoryCard 
              title="Stock Pots" 
              imageUrl={stockPotImg}
              description="Durable stainless steel stock pots in various sizes"
            />
            <SubcategoryCard 
              title="Woks & Frying Pans" 
              imageUrl={wokPanImg}
              description="Non-stick cookware for everyday cooking"
            />
            <SubcategoryCard 
              title="Chip Pans" 
              imageUrl={chipPanImg}
              description="Deep frying solutions with safety baskets"
            />
            <SubcategoryCard 
              title="Milk Pans" 
              imageUrl={milkPanImg}
              description="Small saucepans for milk and sauces"
            />
            <SubcategoryCard 
              title="Egg Poacher Pans" 
              imageUrl={eggPoacherImg}
              description="Specialty pans for perfect poached eggs"
            />
            <SubcategoryCard 
              title="Fruit Baskets" 
              imageUrl={fruitBasketImg}
              description="Wire baskets for fruit and vegetable storage"
            />
            <SubcategoryCard 
              title="Corner Plate Racks" 
              imageUrl={plateRackImg}
              description="Space-saving dish drying racks"
            />
            <SubcategoryCard 
              title="Radiator Airers" 
              imageUrl={radiatorAirerImg}
              description="Compact drying racks for radiators"
            />
            <SubcategoryCard 
              title="Rotary Dryers" 
              imageUrl={rotaryDryerImg}
              description="Outdoor washing line solutions"
            />
          </div>
        </div>
      </section>

      {/* Featured Product Families */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Featured Product Families</h2>
          
          <ProductCarousel slidesToShow={3}>
            <div className="px-4">
              <FeaturedProductCard 
                title="Stock Pot 4.5L / 24cm"
                imageUrl={stockPotImg}
                description="Professional grade stainless steel stock pot, ideal for soups, stews and batch cooking"
                tag="Multiple variants available"
                href="/products/stock-pot-4-5l-24cm"
              />
            </div>
            <div className="px-4">
              <FeaturedProductCard 
                title="Wok Pan with Glass Lid 32cm"
                imageUrl={wokPanImg}
                description="Large capacity wok with tempered glass lid for versatile Asian and stir-fry cooking"
                tag="Trade enquiries welcome"
                href="/products/stock-pot-4-5l-24cm"
              />
            </div>
            <div className="px-4">
              <FeaturedProductCard 
                title="Non Stick Frying Pan 30cm"
                imageUrl={fryingPanImg}
                description="PFOA-free non-stick coating with heat-resistant handle for everyday frying"
                tag="Multiple variants available"
                href="/products/stock-pot-4-5l-24cm"
              />
            </div>
            <div className="px-4">
              <FeaturedProductCard 
                title="Corner Plate Rack"
                imageUrl={plateRackImg}
                description="Space-efficient corner design for plates, cutlery and draining"
                tag="Trade enquiries welcome"
                href="/products/stock-pot-4-5l-24cm"
              />
            </div>
            <div className="px-4">
              <FeaturedProductCard 
                title="Fruit Basket"
                imageUrl={fruitBasketImg}
                description="Open wire design for air circulation and attractive fruit display"
                tag="Multiple variants available"
                href="/products/stock-pot-4-5l-24cm"
              />
            </div>
            <div className="px-4">
              <FeaturedProductCard 
                title="Radiator Airer"
                imageUrl={radiatorAirerImg}
                description="Compact folding design that hooks over radiators for indoor drying"
                tag="Trade enquiries welcome"
                href="/products/stock-pot-4-5l-24cm"
              />
            </div>
          </ProductCarousel>
        </div>
      </section>

      {/* Category Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Category Benefits</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border border-gray-100 p-8">
              <CheckCircle2 className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Everyday household relevance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Essential products that serve daily needs in every home
              </p>
            </div>
            <div className="border border-gray-100 p-8">
              <CheckCircle2 className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Multiple variants and sizes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Broad selection to suit different customer preferences
              </p>
            </div>
            <div className="border border-gray-100 p-8">
              <CheckCircle2 className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Good cross-sell potential</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Complementary products that work well together
              </p>
            </div>
            <div className="border border-gray-100 p-8">
              <CheckCircle2 className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
              <h3 className="text-lg mb-3 tracking-tight">Mix of cookware and organisation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Diverse range covering multiple household needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Best Sellers in Category</h2>
          
          <ProductCarousel slidesToShow={5}>
            <div className="px-4">
              <ProductCard name="Stock Pot 4.5L / 24cm" imageUrl={stockPotImg} href="/products/stock-pot-4-5l-24cm" />
            </div>
            <div className="px-4">
              <ProductCard name="Wok Pan with Glass Lid" imageUrl={wokPanImg} href="/products/stock-pot-4-5l-24cm" />
            </div>
            <div className="px-4">
              <ProductCard name="Chip Pan with Basket" imageUrl={chipPanImg} href="/products/stock-pot-4-5l-24cm"/>
            </div>
            <div className="px-4">
              <ProductCard name="Milk Pot 14cm" imageUrl={milkPanImg} href="/products/stock-pot-4-5l-24cm" />
            </div>
            <div className="px-4">
              <ProductCard name="Egg Poacher Pan" imageUrl={eggPoacherImg} href="/products/stock-pot-4-5l-24cm" />
            </div>
            <div className="px-4">
              <ProductCard name="Corner Plate Rack" imageUrl={plateRackImg} href="/products/stock-pot-4-5l-24cm" />
            </div>
          </ProductCarousel>
        </div>
      </section>

      {/* Trade CTA Strip */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-[1400px] mx-auto px-8 text-center">
          <h2 className="text-4xl mb-8 tracking-tight">Need trade pricing or a Kitchen & Household catalogue?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm tracking-wide">
              REQUEST QUOTE
            </button>
            <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide">
              DOWNLOAD CATEGORY CATALOGUE
            </button>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl mb-16 tracking-tight">Related Categories</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <CategoryCard title="Mats & Rugs" imageUrl={shaggyRugImg} productCount={45} href="/categories/kitchen-household" />
            <CategoryCard title="Decoration & Seasonal Products" imageUrl={waxBurnerImg} productCount={32} href="/categories/kitchen-household" />
            <CategoryCard title="Garden & Outdoor" imageUrl={plantSupportImg} productCount={28} href="/categories/kitchen-household" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}