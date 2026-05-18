import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { useBrand } from "../../contexts/BrandContext";

export function Header() {
  const { brand } = useBrand();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.brandName}
                  className="h-8 md:h-10 object-contain"
                />
              ) : (
                <span className="text-xl md:text-2xl tracking-tight font-light">{brand.brandName}</span>
              )}
            </Link>
          </div>

          {/* Navigation — desktop only */}
          <nav className="hidden lg:flex items-center gap-10 text-sm tracking-wide">
            <Link to="/" className="text-gray-900 hover:text-gray-500 transition-colors">HOME</Link>
            <a href="/#categories" className="text-gray-500 hover:text-gray-900 transition-colors">CATEGORIES</a>
            <a href="/#about" className="text-gray-500 hover:text-gray-900 transition-colors">ABOUT</a>
            <Link to="/how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors">TRADE</Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">CONTACT</Link>
          </nav>

          {/* Right side: search + hamburger */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products"
                className="pl-9 pr-3 py-2 md:py-3 text-sm border border-gray-200 rounded-none focus:outline-none focus:border-gray-400 transition-colors w-32 sm:w-44 lg:w-64"
              />
            </div>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-[1400px] mx-auto px-4 py-2 flex flex-col divide-y divide-gray-100">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm tracking-wide text-gray-900 hover:text-gray-500 transition-colors"
            >
              HOME
            </Link>
            <a
              href="/#categories"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
            >
              CATEGORIES
            </a>
            <a
              href="/#about"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
            >
              ABOUT
            </a>
            <Link
              to="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
            >
              TRADE
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
            >
              CONTACT
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
