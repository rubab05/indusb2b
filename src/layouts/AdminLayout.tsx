import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useBrand } from "../contexts/BrandContext";
import {
  FolderOpen,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ExternalLink,
  LayoutGrid,
  Package,
  FileText,
  HelpCircle,
  Image,
  UserCheck,
  Shield,
  DollarSign,
  Store,
  ClipboardList,
  Activity,
  RotateCcw,
  LifeBuoy,
  Wallet,
} from "lucide-react";

interface NavSection {
  label: string;
  icon: React.ElementType;
  items: { label: string; to: string; icon: React.ElementType }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Content",
    icon: FolderOpen,
    items: [
      { label: "Categories", to: "/admin/categories", icon: LayoutGrid },
      { label: "Products", to: "/admin/products", icon: Package },
      { label: "Pages", to: "/admin/pages", icon: FileText },
      { label: "FAQ", to: "/admin/faq", icon: HelpCircle },
      { label: "Media", to: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Partners",
    icon: Users,
    items: [
      { label: "Applications", to: "/admin/partners/applications", icon: UserCheck },
      { label: "Partner List", to: "/admin/partners", icon: Users },
      { label: "Roles & Permissions", to: "/admin/partners/roles", icon: Shield },
    ],
  },
  {
    label: "Commerce",
    icon: ShoppingCart,
    items: [
      { label: "Pricing Rules", to: "/admin/pricing", icon: DollarSign },
      { label: "Vendors", to: "/admin/vendors", icon: Store },
    ],
  },
  {
    label: "Operations",
    icon: BarChart3,
    items: [
      { label: "Orders", to: "/admin/operations/orders", icon: ClipboardList },
      { label: "Dashboard", to: "/admin/operations/dashboard", icon: BarChart3 },
      { label: "Returns", to: "/admin/operations/returns", icon: RotateCcw },
      { label: "Activity Log", to: "/admin/operations/logs", icon: Activity },
      { label: "Support", to: "/admin/operations/support", icon: LifeBuoy },
      { label: "Top-Up Requests", to: "/admin/operations/topups", icon: Wallet },
    ],
  },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-2.5 px-3 py-2 text-sm transition-colors rounded-sm",
    isActive
      ? "bg-gray-900 text-white font-medium"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  ].join(" ");
}

function SidebarSection({ section }: { section: NavSection }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
      >
        <section.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="flex-1 text-left">{section.label.toUpperCase()}</span>
        {open ? (
          <ChevronDown className="w-3 h-3" strokeWidth={2} />
        ) : (
          <ChevronRight className="w-3 h-3" strokeWidth={2} />
        )}
      </button>
      {open && (
        <div className="ml-2 space-y-0.5">
          {section.items.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { brand } = useBrand();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link to="/admin/categories" className="text-lg tracking-widest font-light text-gray-900 flex items-center">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.brandName} className="h-8 object-contain" />
          ) : (
            brand.brandName
          )}
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 py-3 px-2 space-y-3 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <SidebarSection key={section.label} section={section} />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-900 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.companyName ?? "Admin"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-white flex flex-col shadow-xl z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <span className="px-2.5 py-1 text-xs tracking-wide font-medium bg-gray-900 text-white">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              View Public Site
            </a>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 leading-none">{user?.companyName ?? "Admin"}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
