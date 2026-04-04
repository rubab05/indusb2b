import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { AccountType } from "../types/auth";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Truck,
  LifeBuoy,
  Settings,
  Wallet,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Tag,
  Info,
  Zap,
  MessageSquarePlus,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  dropshipOnly?: boolean;
  wholesaleOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", to: "/dashboard/orders", icon: ShoppingCart },
  { label: "New Order", to: "/dashboard/orders/new", icon: Zap, wholesaleOnly: true },
  { label: "Quick Order", to: "/dashboard/orders/quick", icon: FileText, wholesaleOnly: true },
  { label: "Quote Request", to: "/dashboard/quote-request", icon: MessageSquarePlus, wholesaleOnly: true },
  { label: "Price List", to: "/dashboard/price-list", icon: Tag, wholesaleOnly: true },
  { label: "MOQ & Rules", to: "/dashboard/moq-info", icon: Info, wholesaleOnly: true },
  { label: "Invoices", to: "/dashboard/invoices", icon: FileText },
  { label: "Tracking", to: "/dashboard/tracking", icon: Truck },
  { label: "Support", to: "/dashboard/support", icon: LifeBuoy },
  { label: "Account Settings", to: "/dashboard/account", icon: Settings },
  { label: "Balance & Ledger", to: "/dashboard/dropship/ledger", icon: Wallet, dropshipOnly: true },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-none",
    isActive
      ? "bg-yellow-500 text-gray-900 font-medium"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  ].join(" ");
}

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.dropshipOnly && user?.accountType !== AccountType.DROPSHIP) return false;
    if (item.wholesaleOnly && user?.accountType !== AccountType.WHOLESALE) return false;
    return true;
  });

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link to="/" className="text-lg tracking-widest font-light text-gray-900">
          HOMATZ
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">Partner Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            {item.label}
            {item.dropshipOnly && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm">DS</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-900 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {user?.companyName?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.companyName}</p>
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
            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            {/* Breadcrumb hint */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <span>Portal</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900">{user?.companyName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={[
                "px-2.5 py-1 text-xs tracking-wide font-medium",
                user?.accountType === AccountType.WHOLESALE
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800",
              ].join(" ")}
            >
              {user?.accountType === AccountType.WHOLESALE ? "WHOLESALE" : "DROPSHIP"}
            </span>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 leading-none">{user?.companyName}</p>
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
