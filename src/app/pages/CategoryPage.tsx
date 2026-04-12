import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router";
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
import type { CategoryContent, ProductFamilyContent } from "../../lib/content-types";
import { api } from "../../lib/api-client";
import { normalizeCategory, normalizeProduct } from "../../services/admin.service";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryContent | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [liveProducts, setLiveProducts] = useState<ProductFamilyContent[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api
      .get<any>(`/categories/${slug}`)
      .then((raw) => {
        setCategory(normalizeCategory(raw));
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

      api
        .get<any>("/products", { category: slug })
        .then((raw) => {
          const items = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
          setLiveProducts(items.map(normalizeProduct));
        })
        .catch(() => {
          setLiveProducts([]);
        });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto px-8 py-32 text-center text-gray-400 text-sm">
          Loading…
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !category) return <Navigate to="/" replace />;

  const heroImages = category.heroImages ?? [];
  const ctaSection = (category.sections ?? []).find((s) => s.type === "ctaStrip");

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
              { label: category.name },
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
              <div className="text-xs tracking-widest text-gray-500 mb-4">
                {category.name.toUpperCase()}
              </div>
              <h1 className="text-5xl mb-8 tracking-tight leading-tight">{category.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                {category.description}
              </p>
              <div className="flex gap-4">
                <Link to="/contact" className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide">
                  REQUEST CATEGORY CATALOGUE
                </Link>
                <Link to="/contact" className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide">
                  ENQUIRE ABOUT THIS RANGE
                </Link>
              </div>
            </div>

            {/* Right: Product Collage — up to 4 hero images in a 2×2 grid */}
            {heroImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {heroImages[0] && (
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <ImageWithFallback src={heroImages[0].src} alt={heroImages[0].alt} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {heroImages[1] && (
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <ImageWithFallback src={heroImages[1].src} alt={heroImages[1].alt} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="space-y-4 pt-8">
                  {heroImages[2] && (
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <ImageWithFallback src={heroImages[2].src} alt={heroImages[2].alt} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {heroImages[3] && (
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <ImageWithFallback src={heroImages[3].src} alt={heroImages[3].alt} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Intro Strip */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8 text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            {category.description.split('.')[0]}.
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
              <Link to="/contact" className="px-6 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-xs tracking-wide flex items-center gap-2">
                <Download className="w-4 h-4" />
                REQUEST CATEGORY PRICE LIST
              </Link>
              <Link to="/contact" className="px-6 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-xs tracking-wide flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                ASK ABOUT MOQ
              </Link>
              <Link to="/apply" className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-xs tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4" />
                APPLY FOR TRADE ACCESS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product Families */}
      {category.featuredFamilies.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-16 tracking-tight">Featured Product Families</h2>
            <ProductCarousel slidesToShow={3}>
              {category.featuredFamilies.map((item) => (
                <div key={item.title} className="px-4">
                  <FeaturedProductCard
                    title={item.title}
                    imageUrl={item.image ?? ""}
                    description={item.description ?? ""}
                    tag={item.tag}
                    href={item.href}
                  />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* Category Benefits */}
      {(category.benefits ?? []).length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-16 tracking-tight">Category Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(category.benefits ?? []).map((benefit) => (
                <div key={benefit.title} className="border border-gray-100 p-8">
                  <CheckCircle2 className="w-10 h-10 text-gray-900 mb-6" strokeWidth={1.5} />
                  <h3 className="text-lg mb-3 tracking-tight">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

            {liveProducts.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-16 tracking-tight">Products in This Category</h2>
            <ProductCarousel slidesToShow={5}>
              {liveProducts.map((item) => (
                <div key={item.slug} className="px-4">
                  <ProductCard
                    name={item.name}
                    imageUrl={item.gallery?.[0]?.src ?? ""}
                    href={`/category/${slug}/${item.slug}`}
                  />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {(category.bestSellers ?? []).length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-16 tracking-tight">Best Sellers in Category</h2>
            <ProductCarousel slidesToShow={5}>
              {(category.bestSellers ?? []).map((item) => (
                <div key={item.title} className="px-4">
                  <ProductCard
                    name={item.title}
                    imageUrl={item.image ?? ""}
                    href={item.href}
                  />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* Trade CTA Strip */}
      {ctaSection && ctaSection.type === "ctaStrip" && (
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-[1400px] mx-auto px-8 text-center">
            <h2 className="text-4xl mb-8 tracking-tight">{ctaSection.title}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {ctaSection.ctas.map((cta) => (
                <Link
                  key={cta.label}
                  to={cta.href ?? "/contact"}
                  className={
                    cta.variant === "primary"
                      ? "px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm tracking-wide"
                      : "px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide"
                  }
                >
                  {cta.label.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Categories */}
      {(category.relatedCategories ?? []).length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-16 tracking-tight">Related Categories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(category.relatedCategories ?? []).map((rel) => (
                <CategoryCard
                  key={rel.title}
                  title={rel.title}
                  imageUrl={rel.image ?? ""}
                  href={rel.href}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
