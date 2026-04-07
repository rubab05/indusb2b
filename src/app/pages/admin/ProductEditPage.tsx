import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { adminService } from "../../../services/admin.service";
import { CategoryContent, ProductFamilyContent } from "../../../lib/content-types";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, ExternalLink } from "lucide-react";

interface FormValues {
  name: string;
  slug: string;
  categorySlug: string;
  description: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  features: Array<{ value: string }>;
  useCases: Array<{ value: string }>;
  gallery: Array<{ src: string; alt: string }>;
  specifications: Array<{ [key: string]: string }>;
  variants: Array<{ title: string }>;
  relatedProducts: Array<{ title: string; href: string; image: string }>;
  relatedCategories: Array<{ title: string; href: string; image: string }>;
  supportTitle: string;
  supportDescription: string;
}

const TABS = ["Basic", "Content", "Gallery", "Specs", "Variants", "Related", "SEO"] as const;

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = !slug || slug === "new";
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Basic");
  const [loading, setLoading] = useState(!isNew);
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [categories, setCategories] = useState<CategoryContent[]>([]);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "", slug: "", categorySlug: "", description: "", summary: "",
      seoTitle: "", seoDescription: "",
      features: [], useCases: [], gallery: [], specifications: [],
      variants: [], relatedProducts: [], relatedCategories: [],
      supportTitle: "", supportDescription: "",
    },
  });

  const featuresField = useFieldArray({ control, name: "features" });
  const useCasesField = useFieldArray({ control, name: "useCases" });
  const galleryField = useFieldArray({ control, name: "gallery" });
  const specsField = useFieldArray({ control, name: "specifications" });
  const variantsField = useFieldArray({ control, name: "variants" });
  const relatedProdsField = useFieldArray({ control, name: "relatedProducts" });
  const relatedCatsField = useFieldArray({ control, name: "relatedCategories" });

  const watchName = watch("name");

  useEffect(() => {
    if (autoSlug && watchName) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, autoSlug, setValue]);

  useEffect(() => {
    adminService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isNew && slug) {
      adminService.getProductBySlug(slug).then((prod) => {
        if (!prod) { navigate("/admin/products"); return; }
        reset({
          name: prod.name,
          slug: prod.slug,
          categorySlug: prod.categorySlug,
          description: prod.description,
          summary: prod.summary,
          seoTitle: prod.seoTitle ?? "",
          seoDescription: prod.seoDescription ?? "",
          features: prod.features.map((f) => ({ value: f })),
          useCases: (prod.useCases ?? []).map((u) => ({ value: u })),
          gallery: prod.gallery.map((g) => ({ src: g.src, alt: g.alt })),
          specifications: (prod.specifications ?? []).map((s) => ({ ...s })),
          variants: (prod.variants ?? []).map((v) => ({ title: v.title })),
          relatedProducts: (prod.relatedProducts ?? []).map((r) => ({ title: r.title, href: r.href ?? "", image: r.image ?? "" })),
          relatedCategories: (prod.relatedCategories ?? []).map((r) => ({ title: r.title, href: r.href ?? "", image: r.image ?? "" })),
          supportTitle: prod.support?.title ?? "",
          supportDescription: prod.support?.description ?? "",
        });
        setAutoSlug(false);
        setLoading(false);
      });
    }
  }, [isNew, slug, navigate, reset]);

  async function onSubmit(data: FormValues) {
    const product: ProductFamilyContent = {
      slug: data.slug,
      categorySlug: data.categorySlug,
      name: data.name,
      description: data.description,
      summary: data.summary,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      gallery: data.gallery.map((g) => ({ src: g.src, alt: g.alt })),
      features: data.features.map((f) => f.value),
      useCases: data.useCases.length > 0 ? data.useCases.map((u) => u.value) : undefined,
      specifications: data.specifications.length > 0 ? data.specifications : undefined,
      variants: data.variants.length > 0 ? data.variants.map((v) => ({ title: v.title })) : undefined,
      relatedProducts: data.relatedProducts.length > 0 ? data.relatedProducts.map((r) => ({ title: r.title, href: r.href, image: r.image })) : undefined,
      relatedCategories: data.relatedCategories.length > 0 ? data.relatedCategories.map((r) => ({ title: r.title, href: r.href, image: r.image })) : undefined,
      support: data.supportTitle ? { title: data.supportTitle, description: data.supportDescription } : undefined,
    };

    await adminService.saveProduct(product);
    toast.success("Product saved");
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
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/products")} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">{isNew ? "New Product" : `Edit: ${watch("name") || slug}`}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isNew ? "Create a new product family" : "Edit product content and settings"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic */}
        {activeTab === "Basic" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Name *</label>
              <input {...register("name", { required: "Name is required" })} className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Slug *</label>
              <input {...register("slug", { required: "Slug is required" })} onFocus={() => setAutoSlug(false)} className="w-full px-4 py-2.5 text-sm font-mono border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Category *</label>
              <select {...register("categorySlug", { required: "Category is required" })} className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 bg-white transition-colors">
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              {errors.categorySlug && <p className="text-xs text-red-500 mt-1">{errors.categorySlug.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Summary</label>
              <textarea {...register("summary")} rows={3} className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "Content" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <p className="text-xs tracking-widest text-gray-500">DESCRIPTION</p>
              <textarea {...register("description")} rows={5} placeholder="Full product description..." className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
            </div>

            {/* Features */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">FEATURES ({featuresField.fields.length})</p>
                <button type="button" onClick={() => featuresField.append({ value: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {featuresField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input {...register(`features.${index}.value`)} placeholder="Feature description" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <button type="button" onClick={() => featuresField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">USE CASES ({useCasesField.fields.length})</p>
                <button type="button" onClick={() => useCasesField.append({ value: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {useCasesField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input {...register(`useCases.${index}.value`)} placeholder="Use case" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <button type="button" onClick={() => useCasesField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <p className="text-xs tracking-widest text-gray-500">SUPPORT BLOCK</p>
              <input {...register("supportTitle")} placeholder="Support title" className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
              <textarea {...register("supportDescription")} rows={2} placeholder="Support description" className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
            </div>
          </div>
        )}

        {/* Gallery */}
        {activeTab === "Gallery" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-widest text-gray-500">GALLERY IMAGES ({galleryField.fields.length})</p>
              <button type="button" onClick={() => galleryField.append({ src: "", alt: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add Image
              </button>
            </div>
            <div className="space-y-3">
              {galleryField.fields.map((field, index) => (
                <div key={field.id} className="border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Image #{index + 1}</span>
                    <button type="button" onClick={() => galleryField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  <input {...register(`gallery.${index}.src`)} placeholder="Image URL" className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  <input {...register(`gallery.${index}.alt`)} placeholder="Alt text" className="w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specs */}
        {activeTab === "Specs" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-widest text-gray-500">SPECIFICATIONS ({specsField.fields.length})</p>
              <button type="button" onClick={() => specsField.append({ variant: "", size: "", material: "", finish: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add Row
              </button>
            </div>
            <div className="space-y-3">
              {specsField.fields.map((field, index) => (
                <div key={field.id} className="border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Row #{index + 1}</span>
                    <button type="button" onClick={() => specsField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input {...register(`specifications.${index}.variant`)} placeholder="Variant" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`specifications.${index}.size`)} placeholder="Size" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`specifications.${index}.material`)} placeholder="Material" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`specifications.${index}.finish`)} placeholder="Finish" className="px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variants */}
        {activeTab === "Variants" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-widest text-gray-500">VARIANTS ({variantsField.fields.length})</p>
              <button type="button" onClick={() => variantsField.append({ title: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {variantsField.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input {...register(`variants.${index}.title`)} placeholder="Variant name" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                  <button type="button" onClick={() => variantsField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {activeTab === "Related" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">RELATED PRODUCTS ({relatedProdsField.fields.length})</p>
                <button type="button" onClick={() => relatedProdsField.append({ title: "", href: "", image: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {relatedProdsField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
                    <input {...register(`relatedProducts.${index}.title`)} placeholder="Title" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`relatedProducts.${index}.href`)} placeholder="Link" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`relatedProducts.${index}.image`)} placeholder="Image URL" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <button type="button" onClick={() => relatedProdsField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">RELATED CATEGORIES ({relatedCatsField.fields.length})</p>
                <button type="button" onClick={() => relatedCatsField.append({ title: "", href: "", image: "" })} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {relatedCatsField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
                    <input {...register(`relatedCategories.${index}.title`)} placeholder="Title" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`relatedCategories.${index}.href`)} placeholder="Link" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <input {...register(`relatedCategories.${index}.image`)} placeholder="Image URL" className="flex-1 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
                    <button type="button" onClick={() => relatedCatsField.remove(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === "SEO" && (
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <p className="text-xs tracking-widest text-gray-500">SEARCH ENGINE OPTIMIZATION</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta Title</label>
              <input {...register("seoTitle")} placeholder="Page title for search engines" className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta Description</label>
              <textarea {...register("seoDescription")} rows={3} placeholder="Brief description for search results" className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
            </div>
          </div>
        )}

        {/* Sticky actions */}
        <div className="sticky bottom-0 bg-white border border-gray-200 px-6 py-4 flex items-center justify-between -mx-6 lg:-mx-8">
          <button type="button" onClick={() => navigate("/admin/products")} className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
          <div className="flex items-center gap-3">
            {!isNew && (
              <a
                href={`/category/${watch("categorySlug")}/${watch("slug")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} /> Preview
              </a>
            )}
            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors">
              {isNew ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
