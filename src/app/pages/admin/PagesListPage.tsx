import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { adminService, ContentPage } from "../../../services/admin.service";
import { Plus, MoreHorizontal, Pencil, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function PagesListPage() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    adminService.getPages().then((data) => {
      setPages(data);
      setLoading(false);
    });
  }, []);

  async function handleDelete() {
    if (!deleteSlug) return;
    await adminService.deletePage(deleteSlug);
    setPages((prev) => prev.filter((p) => p.slug !== deleteSlug));
    setDeleteSlug(null);
    toast.success("Page deleted");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Manage static content pages.</p>
        </div>
        <Link
          to="/admin/pages/new/edit"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Page
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No pages yet. Create your first page.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Title", "Slug", "Status", "Last Updated", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => (
                <tr key={page.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{page.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 font-medium ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{page.lastUpdated}</td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === page.slug ? null : page.slug)}
                      className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    {openMenu === page.slug && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-4 top-full mt-1 z-20 bg-white border border-gray-200 shadow-lg py-1 w-44">
                          <button
                            onClick={() => { setOpenMenu(null); navigate(`/admin/pages/${page.slug}/edit`); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /> Edit
                          </button>
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setOpenMenu(null)}
                          >
                            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} /> View
                          </a>
                          <button
                            onClick={() => { setOpenMenu(null); setDeleteSlug(page.slug); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Delete
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

      {deleteSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeleteSlug(null)} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Page</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{deleteSlug}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteSlug(null)} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
