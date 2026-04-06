import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { adminService } from "../../../services/admin.service";
import { CategoryContent, BenefitCard, LinkCard, CTA } from "../../../lib/content-types";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, ExternalLink, ArrowLeft } from "lucide-react";

interface FormValues {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  productCount: number;
  b2bLabel: string;
  heroImageUrl: string;
  heroImageAlt: string;
  introText: string;
  subcategories: Array<{ title: string; description: string; image: string; href: string }>;
  benefits: Array<{ title: string; description: string; icon: string }>;
  featuredFamilies: Array<{ title: string; description: string; image: string; href: string; tag: string }>;
  relatedCategories: Array<{ title: string; href: string; image: string }>;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

const TABS = ["Basic", "Content", "Products", "SEO"] as const;

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CategoryEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = !slug || slug === "new";
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Basic");
  const [loading, setLoading] = useState(!isNew);
  const [autoSlug, setAutoSlug] = useState(isNew);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      productCount: 0,
      b2bLabel: "MOQ AVAILABLE",
      heroImageUrl: "",
      heroImageAlt: "",
      introText: "",
      subcategories: [],
      benefits: [],
      featuredFamilies: [],
      relatedCategories: [],
      ctaTitle: "",
      ctaDescription: "",
      ctaButtonText: "",
      ctaButtonLink: "",
    },
  });

  const subcatsField = useFieldArray({ control, name: "subcategories" });
  const benefitsField = useFieldArray({ control, name: "benefits" });
  const featuredField = useFieldArray({ control, name: "featuredFamilies" });
  const relatedField = useFieldArray({ control, name: "relatedCategories" });

  const watchName = watch("name");

  useEffect(() => {
    if (autoSlug && watchName) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, autoSlug, setValue]);

  useEffect(() => {
    if (!isNew && slug) {
      adminService.getCategoryBySlug(slug).then((cat) => {
        if (!cat) {
          navigate("/admin/categories");
          return;
        }
        // Map CategoryContent to form values
        const intro = cat.sections?.find((s) => s.type === "intro");
        const cta = cat.sections?.find((s) => s.type === "ctaStrip");
        reset({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          seoTitle: cat.seoTitle ?? "",
          seoDescription: cat.seoDescription ?? "",
          productCount: cat.productCount ?? 0,
          b2bLabel: cat.b2bLabel ?? "",
          heroImageUrl: cat.heroImages?.[0]?.src ?? "",
          heroImageAlt: cat.heroImages?.[0]?.alt ?? "",
          introText: intro && intro.type === "intro" ? intro.text : "",
          subcategories: cat.subcategories.map((s) => ({
            title: s.title,
            description: s.description ?? "",
            image: s.image ?? "",
            href: s.href ?? "",
          })),
          benefits: (cat.benefits ?? []).map((b) => ({
            title: b.title,
            description: b.description,
            icon: b.icon ?? "",
          })),
          featuredFamilies: cat.featuredFamilies.map((f) => ({
            title: f.title,
            description: f.description ?? "",
            image: f.image ?? "",
            href: f.href ?? "",
            tag: f.tag ?? "",
          })),
          relatedCategories: (cat.relatedCategories ?? []).map((r) => ({
            title: r.title,
            href: r.href ?? "",
            image: r.image ?? "",
          })),
          ctaTitle: cta && cta.type === "ctaStrip" ? cta.title : "",
          ctaDescription: cta && cta.type === "ctaStrip" ? (cta.description ?? "") : "",
          ctaButtonText: cta && cta.type === "ctaStrip" && cta.ctas[0] ? cta.ctas[0].label : "",
          ctaButtonLink: cta && cta.type === "ctaStrip" && cta.ctas[0] ? (cta.ctas[0].href ?? "") : "",
        });
        setAutoSlug(false);
        setLoading(false);
      });
    }
  }, [isNew, slug, navigate, reset]);

  async function onSubmit(data: FormValues) {
    // Map form values → CategoryContent
    const subcategories: LinkCard[] = data.subcategories.map((s) => ({
      title: s.title,
      description: s.description,
      image: s.image,
      href: s.href,
    }));

    const benefits: BenefitCard[] = data.benefits.map((b) => ({
      title: b.title,
      description: b.description,
      icon: b.icon,
    }));

    const featuredFamilies: LinkCard[] = data.featuredFamilies.map((f) => ({
      title: f.title,
      description: f.description,
      image: f.image,
      href: f.href,
      tag: f.tag,
    }));

    const relatedCategories: LinkCard[] = data.relatedCategories.map((r) => ({
      title: r.title,
      href: r.href,
      image: r.image,
    }));

    const ctas: CTA[] = data.ctaButtonText
      ? [{ label: data.ctaButtonText, href: data.ctaButtonLink, variant: "primary" as const }]
      : [];

    const category: CategoryContent = {
      slug: data.slug,
      name: data.name,
      description: data.description,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      productCount: data.productCount,
      b2bLabel: data.b2bLabel || undefined,
      heroImages: data.heroImageUrl ? [{ src: data.heroImageUrl, alt: data.heroImageAlt || data.name }] : [],
      subcategories,
      featuredFamilies,
      benefits: benefits.length > 0 ? benefits : undefined,
      relatedCategories: relatedCategories.length > 0 ? relatedCategories : undefined,
      sections: [
        ...(data.introText ? [{ type: "intro" as const, text: data.introText }] : []),
        ...(data.ctaTitle ? [{ type: "ctaStrip" as const, title: data.ctaTitle, description: data.ctaDescription, ctas }] : []),
      ],
    };

    await adminService.saveCategory(category);
    toast.success("Category saved");
  }

  function moveItem(fieldArray: ReturnType<typeof useFieldArray>, from: number, to: number) {
    if (to < 0 || to >= fieldArray.fields.length) return;
    fieldArray.move(from, to);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="h-96 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/categories")} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">
            {isNew ? "New Category" : `Edit: ${watch("name") || slug}`}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{isNew ? "Create a new product category" : "Edit category content and settings"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-gray-900 text-gray-900 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Tab */}
        {activeTab === "Basic" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Name *</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Slug *</label>
              <input
                {...register("slug", { required: "Slug is required" })}
                onFocus={() => setAutoSlug(false)}
                className="w-full px-4 py-2.5 text-sm font-mono border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Product Count</label>
                <input
                  type="number"
                  {...register("productCount", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">B2B Label</label>
                <input
                  {...register("b2bLabel")}
                  placeholder="e.g. MOQ AVAILABLE"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "Content" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <p className="text-xs tracking-widest text-gray-500">HERO</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Hero Image URL</label>
                  <input
                    {...register("heroImageUrl")}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Image Alt Text</label>
                  <input
                    {...register("heroImageAlt")}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="bg-white border border-gray-200 p-6 space-y-3">
              <p className="text-xs tracking-widest text-gray-500">INTRO TEXT</p>
              <textarea
                {...register("introText")}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors"
              />
            </div>

            {/* Subcategories */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">SUBCATEGORIES ({subcatsField.fields.length})</p>
                <button
                  type="button"
                  onClick={() => subcatsField.append({ title: "", description: "", image: "", href: "" })}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Add
                </button>
              </div>
              {subcatsField.fields.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">No subcategories. Click Add to create one.</p>
              )}
              <div className="space-y-3">
                {subcatsField.fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveItem(subcatsField, index, index - 1)} className="text-gray-300 hover:text-gray-600 text-xs">▲</button>
                        <button type="button" onClick={() => moveItem(subcatsField, index, index + 1)} className="text-gray-300 hover:text-gray-600 text-xs">▼</button>
                      </div>
                      <GripVertical className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
                      <span className="text-xs text-gray-400 flex-1">#{index + 1}</span>
                      <button type="button" onClick={() => subcatsField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input {...register(`subcategories.${index}.title`)} placeholder="Name" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                      <input {...register(`subcategories.${index}.href`)} placeholder="Link (e.g. /category/...)" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    </div>
                    <input {...register(`subcategories.${index}.image`)} placeholder="Image URL" className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <textarea {...register(`subcategories.${index}.description`)} placeholder="Description" rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">BENEFITS ({benefitsField.fields.length})</p>
                <button
                  type="button"
                  onClick={() => benefitsField.append({ title: "", description: "", icon: "" })}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {benefitsField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <input {...register(`benefits.${index}.icon`)} placeholder="Icon name" className="w-24 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`benefits.${index}.title`)} placeholder="Title" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`benefits.${index}.description`)} placeholder="Description" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <button type="button" onClick={() => benefitsField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors mt-2">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Strip */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <p className="text-xs tracking-widest text-gray-500">CTA STRIP</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Headline</label>
                  <input {...register("ctaTitle")} className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Button Text</label>
                  <input {...register("ctaButtonText")} className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Description</label>
                <textarea {...register("ctaDescription")} rows={2} className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Button Link</label>
                <input {...register("ctaButtonLink")} className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
              </div>
            </div>

            {/* Related Categories */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">RELATED CATEGORIES ({relatedField.fields.length})</p>
                <button
                  type="button"
                  onClick={() => relatedField.append({ title: "", href: "", image: "" })}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {relatedField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
                    <input {...register(`relatedCategories.${index}.title`)} placeholder="Title" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`relatedCategories.${index}.href`)} placeholder="Link" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`relatedCategories.${index}.image`)} placeholder="Image URL" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <button type="button" onClick={() => relatedField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "Products" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-widest text-gray-500">FEATURED FAMILIES ({featuredField.fields.length})</p>
              <button
                type="button"
                onClick={() => featuredField.append({ title: "", description: "", image: "", href: "", tag: "" })}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {featuredField.fields.map((field, index) => (
                <div key={field.id} className="border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                    <button type="button" onClick={() => featuredField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input {...register(`featuredFamilies.${index}.title`)} placeholder="Title" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`featuredFamilies.${index}.tag`)} placeholder="Tag (e.g. New)" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  </div>
                  <input {...register(`featuredFamilies.${index}.href`)} placeholder="Link" className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  <input {...register(`featuredFamilies.${index}.image`)} placeholder="Image URL" className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  <textarea {...register(`featuredFamilies.${index}.description`)} placeholder="Description" rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "SEO" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <p className="text-xs tracking-widest text-gray-500">SEARCH ENGINE OPTIMIZATION</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta Title</label>
              <input
                {...register("seoTitle")}
                placeholder="Page title for search engines"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta Description</label>
              <textarea
                {...register("seoDescription")}
                rows={3}
                placeholder="Brief description for search engine results"
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Sticky actions bar */}
        <div className="sticky bottom-0 bg-white border border-gray-200 px-6 py-4 flex items-center justify-between -mx-6 lg:-mx-8">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {!isNew && (
              <a
                href={`/category/${watch("slug")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                Preview
              </a>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
            >
              {isNew ? "Create Category" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
