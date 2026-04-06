import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { adminService } from "../../../services/admin.service";
import { CategoryContent } from "../../../lib/content-types";
import { Plus, Search, MoreHorizontal, Pencil, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    adminService.getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const filtered = search
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories;

  async function handleDelete() {
    if (!deleteSlug) return;
    await adminService.deleteCategory(deleteSlug);
    setCategories((prev) => prev.filter((c) => c.slug !== deleteSlug));
    setDeleteSlug(null);
    toast.success("Category deleted");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories and their content.</p>
        </div>
        <Link
          to="/admin/categories/new/edit"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">
              {search ? "No categories match your search." : "No categories yet. Create your first category."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Name", "Slug", "Subcategories", "Products", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((cat) => (
                <tr key={cat.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.subcategories.length}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.productCount ?? "—"}</td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === cat.slug ? null : cat.slug)}
                      className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    {openMenu === cat.slug && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-4 top-full mt-1 z-20 bg-white border border-gray-200 shadow-lg py-1 w-44">
                          <button
                            onClick={() => { setOpenMenu(null); navigate(`/admin/categories/${cat.slug}/edit`); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                            Edit
                          </button>
                          <a
                            href={`/category/${cat.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setOpenMenu(null)}
                          >
                            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                            View on Site
                          </a>
                          <button
                            onClick={() => { setOpenMenu(null); setDeleteSlug(cat.slug); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {deleteSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeleteSlug(null)} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{deleteSlug}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteSlug(null)}
                className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
