import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { adminService, ContentPage } from "../../../services/admin.service";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";

interface FormValues {
  title: string;
  slug: string;
  body: string;
  status: "published" | "draft";
  seoTitle: string;
  seoDescription: string;
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PageEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = !slug || slug === "new";
  const [loading, setLoading] = useState(!isNew);
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [showDelete, setShowDelete] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: "", slug: "", body: "", status: "draft", seoTitle: "", seoDescription: "",
    },
  });

  const watchTitle = watch("title");
  const watchStatus = watch("status");

  useEffect(() => {
    if (autoSlug && watchTitle) {
      setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, autoSlug, setValue]);

  useEffect(() => {
    if (!isNew && slug) {
      adminService.getPageBySlug(slug).then((page) => {
        if (!page) { navigate("/admin/pages"); return; }
        reset({
          title: page.title,
          slug: page.slug,
          body: page.body,
          status: page.status,
          seoTitle: page.seoTitle ?? "",
          seoDescription: page.seoDescription ?? "",
        });
        setAutoSlug(false);
        setLoading(false);
      });
    }
  }, [isNew, slug, navigate, reset]);

  async function onSubmit(data: FormValues) {
    const page: ContentPage = {
      slug: data.slug,
      title: data.title,
      body: data.body,
      status: data.status,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    await adminService.savePage(page);
    toast.success("Page saved");
  }

  async function handleDelete() {
    if (!slug) return;
    await adminService.deletePage(slug);
    toast.success("Page deleted");
    navigate("/admin/pages");
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/pages")} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">{isNew ? "New Page" : `Edit: ${watch("title") || slug}`}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isNew ? "Create a new content page" : "Edit page content"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Title *</label>
            <input {...register("title", { required: "Title is required" })} className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Slug *</label>
            <input {...register("slug", { required: "Slug is required" })} onFocus={() => setAutoSlug(false)} className="w-full px-4 py-2.5 text-sm font-mono border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Body</label>
            <textarea {...register("body")} rows={12} placeholder="Page content (markdown or plain text)..." className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-y font-mono transition-colors" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500">Status:</label>
            <button
              type="button"
              onClick={() => setValue("status", watchStatus === "published" ? "draft" : "published")}
              className={`text-xs px-3 py-1.5 font-medium transition-colors ${
                watchStatus === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {watchStatus === "published" ? "Published" : "Draft"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <p className="text-xs tracking-widest text-gray-500">SEO</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Meta Title</label>
            <input {...register("seoTitle")} placeholder="Page title for search engines" className="w-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Meta Description</label>
            <textarea {...register("seoDescription")} rows={2} placeholder="Brief description for search results" className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 resize-none transition-colors" />
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border border-gray-200 px-6 py-4 flex items-center justify-between -mx-6 lg:-mx-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate("/admin/pages")} className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
            {!isNew && (
              <button type="button" onClick={() => setShowDelete(true)} className="px-4 py-2.5 text-sm text-red-600 hover:text-red-700 transition-colors">Delete</button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isNew && (
              <a
                href={`/${watch("slug")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} /> Preview
              </a>
            )}
            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors">
              {isNew ? "Create Page" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Page</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
