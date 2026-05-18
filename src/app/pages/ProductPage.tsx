import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router";
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
import type { ProductFamilyContent } from "../../lib/content-types";
import { api } from "../../lib/api-client";
import { normalizeProduct } from "../../services/admin.service";

export default function ProductPage() {
  const { categorySlug = "", productSlug = "" } = useParams<{
    categorySlug: string;
    productSlug: string;
  }>();

  const [product, setProduct] = useState<ProductFamilyContent | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Selector state
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    setNotFound(false);
    api
      .get<any>(`/products/${productSlug}`)
      .then((raw) => {
        const normalised = normalizeProduct(raw);
        setProduct(normalised);

        // Initialise selectors from specs
        const specs = normalised.specifications ?? [];
        const sizes = [...new Set(specs.map((s) => s.diameter).filter((d): d is string => !!d && d !== "Various"))];
        const caps = [...new Set(specs.map((s) => s.capacity).filter((c): c is string => !!c && c !== "Various"))];
        const fins = [...new Set(specs.map((s) => s.finish?.replace(/ finish$/i, "")).filter((f): f is string => !!f && f !== "Various"))];
        setSelectedSize(sizes[0] ?? "");
        setSelectedCapacity(caps[0] ?? "");
        setSelectedFinish(fins[0] ?? "");

        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [productSlug]);

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

  if (notFound || !product) return <Navigate to="/" replace />;

  const selectorSizes = [...new Set(
    (product.specifications ?? []).map((s) => s.diameter).filter((d): d is string => !!d && d !== "Various")
  )];
  const selectorCapacities = [...new Set(
    (product.specifications ?? []).map((s) => s.capacity).filter((c): c is string => !!c && c !== "Various")
  )];
  const selectorFinishes = [...new Set(
    (product.specifications ?? []).map((s) => s.finish?.replace(/ finish$/i, "")).filter((f): f is string => !!f && f !== "Various")
  )];

  // Map content specs to SpecTable shape (compatibility → hobCompatibility)
  const specs = (product.specifications ?? []).map((s) => ({
    variant: s.variant ?? "",
    diameter: s.diameter ?? "",
    capacity: s.capacity ?? "",
    material: s.material ?? "",
    hobCompatibility: s.compatibility ?? "",
    lidIncluded: s.lidIncluded ?? "",
    finish: s.finish ?? "",
  }));

  const galleryImages = product.gallery.map((img) => img.src);

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
              ...(categorySlug ? [{ label: categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), href: `/category/${categorySlug}` }] : []),
              { label: product.name },
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
              <ProductImageGallery images={galleryImages} />
            </div>

            {/* Right: Product Info */}
            <div>
              <div className="text-xs tracking-widest text-gray-500 mb-4">
                {categorySlug.toUpperCase().replace(/-/g, " ")}
              </div>
              <h1 className="text-5xl mb-6 tracking-tight">{product.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                {product.description}
              </p>

              {/* Selectors */}
              <div className="space-y-6 mb-10">
                {selectorSizes.length > 0 && (
                  <div>
                    <label className="block text-sm mb-3 text-gray-900">Select Size</label>
                    <div className="flex gap-3 flex-wrap">
                      {selectorSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-3 border-2 text-sm tracking-wide transition-colors ${
                            selectedSize === size
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectorCapacities.length > 0 && (
                  <div>
                    <label className="block text-sm mb-3 text-gray-900">Select Capacity</label>
                    <div className="flex gap-3 flex-wrap">
                      {selectorCapacities.map((capacity) => (
                        <button
                          key={capacity}
                          onClick={() => setSelectedCapacity(capacity)}
                          className={`px-6 py-3 border-2 text-sm tracking-wide transition-colors ${
                            selectedCapacity === capacity
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {capacity}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectorFinishes.length > 0 && (
                  <div>
                    <label className="block text-sm mb-3 text-gray-900">Select Colour / Finish</label>
                    <div className="flex gap-3 flex-wrap">
                      {selectorFinishes.map((finish) => (
                        <button
                          key={finish}
                          onClick={() => setSelectedFinish(finish)}
                          className={`px-6 py-3 border-2 text-sm tracking-wide transition-colors ${
                            selectedFinish === finish
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {finish}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="space-y-4 mb-6">
                <Link to="/contact" className="w-full px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  REQUEST QUOTE
                </Link>
                <Link to="/contact" className="w-full px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO ENQUIRY
                </Link>
                <Link to="/login" className="w-full px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  LOGIN TO VIEW PRICING
                </Link>
                {product.specSheetUrl ? (
                  <a
                    href={product.specSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full px-8 py-4 border-2 border-gray-200 text-gray-900 hover:border-gray-400 transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    DOWNLOAD SPEC SHEET
                  </a>
                ) : (
                  <Link to="/contact" className="w-full px-8 py-4 border-2 border-gray-200 text-gray-400 hover:border-gray-300 transition-colors text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer">
                    <Download className="w-4 h-4" />
                    REQUEST SPEC SHEET
                  </Link>
                )}
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
              <p className="text-base text-gray-600 leading-relaxed">{product.summary}</p>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-3xl mb-6 tracking-tight">Key Features</h2>
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-base text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            {(product.useCases ?? []).length > 0 && (
              <div>
                <h2 className="text-3xl mb-6 tracking-tight">Use Cases</h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  Perfect for a wide range of everyday cooking needs:
                </p>
                <div className="flex flex-wrap gap-3">
                  {(product.useCases ?? []).map((useCase) => (
                    <span key={useCase} className="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-700">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Why It Works for Retail */}
            <div>
              <h2 className="text-3xl mb-6 tracking-tight">Why It Works for Retail</h2>
              <p className="text-base text-gray-600 leading-relaxed">
                A practical product line with broad household relevance, easy merchandising, and strong
                compatibility with larger ranges in the same category.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specification Table */}
      {specs.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-12 tracking-tight">Specifications & Size Guide</h2>
            <SpecTable specs={specs} />
          </div>
        </section>
      )}

      {/* Related Variants */}
      {(product.variants ?? []).length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-12 tracking-tight">Variants & Options</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {(product.variants ?? []).map((variant) => {
                const spec = (product.specifications ?? []).find(
                  (s) => s.variant === variant.title
                );
                return (
                  <VariantCard
                    key={variant.title}
                    title={variant.title}
                    imageUrl={variant.image ?? galleryImages[0] ?? ""}
                    capacity={spec?.capacity ?? "—"}
                    diameter={spec?.diameter ?? "—"}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Commonly Bought With */}
      {(product.relatedProducts ?? []).length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-12 tracking-tight">Commonly Bought With</h2>
            <ProductCarousel slidesToShow={5}>
              {(product.relatedProducts ?? []).map((related) => (
                <div key={related.title} className="px-4">
                  <ProductCard
                    name={related.title}
                    imageUrl={related.image ?? ""}
                    href={related.href}
                  />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* Enquiry Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8">
          <EnquiryForm />
        </div>
      </section>

      {/* Support Block */}
      {product.support && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-8">
            <div className="bg-gray-50 border border-gray-200 p-10 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-6 text-gray-900" strokeWidth={1.5} />
              <h2 className="text-2xl mb-4 tracking-tight">{product.support.title}</h2>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                {product.support.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {(product.support.ctas ?? []).map((cta) => (
                  <Link
                    key={cta.label}
                    to={cta.href ?? "/contact"}
                    className={
                      cta.variant === "primary"
                        ? "px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
                        : "px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide"
                    }
                  >
                    {cta.label.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Categories */}
      {(product.relatedCategories ?? []).length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8">
            <h2 className="text-4xl mb-12 tracking-tight">Related Categories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(product.relatedCategories ?? []).map((rel) => (
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
