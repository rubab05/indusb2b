import { useEffect, useRef, useState } from "react";
import { adminService, MediaItem } from "../../../services/admin.service";
import { Search, Upload, Trash2, Copy, Grid, List } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#e2e8f0", "#fde68a", "#bfdbfe", "#bbf7d0", "#fecaca", "#e9d5ff"];

function placeholderColor(filename: string) {
  let hash = 0;
  for (let i = 0; i < filename.length; i++) hash = filename.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadItems() {
    const data = await adminService.getMediaItems();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { loadItems(); }, []);

  const filtered = search
    ? items.filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()))
    : items;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await adminService.uploadMedia(file);
    toast.success("Uploaded successfully");
    await loadItems();
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  async function handleDelete() {
    if (!deleteId) return;
    await adminService.deleteMedia(deleteId);
    toast.success("Media deleted");
    setDeleteId(null);
    await loadItems();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage media files.</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Upload className="w-4 h-4" strokeWidth={1.5} />
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <div className="flex border border-gray-200">
          <button
            onClick={() => setView("grid")}
            className={`p-2 transition-colors ${view === "grid" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-900"}`}
          >
            <Grid className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 transition-colors ${view === "list" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-900"}`}
          >
            <List className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-gray-100 animate-pulse rounded" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white border border-gray-200">
          <p className="text-sm text-gray-400">{search ? "No files match your search." : "No media files yet."}</p>
        </div>
      ) : view === "grid" ? (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 overflow-hidden group relative">
              <div
                className="aspect-video flex items-center justify-center"
                style={{ backgroundColor: placeholderColor(item.filename) }}
              >
                <span className="text-xs text-gray-500 font-mono px-2 text-center">{item.filename}</span>
              </div>
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-700 truncate">{item.filename}</p>
                <p className="text-xs text-gray-400">{item.width} x {item.height}</p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleCopy(item.url)}
                  className="p-2 bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 bg-white text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["", "Filename", "Dimensions", "Uploaded", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs tracking-widest text-gray-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={{ backgroundColor: placeholderColor(item.filename) }}
                    >
                      <span className="text-[8px] text-gray-500 font-mono">{item.mimeType.split("/")[1]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{item.filename}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.width} x {item.height}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.uploadDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleCopy(item.url)} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors" title="Copy URL">
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white border border-gray-200 p-8 max-w-sm w-full mx-4 shadow-xl z-10">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Media</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
