import { Search } from "lucide-react";
import { Link } from "react-router";
import { useBrand } from "../../contexts/BrandContext";

export function Header() {
  const { brand } = useBrand();
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl tracking-tight font-light">{brand.brandName}</Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-10 text-sm tracking-wide">
            <Link to="/" className="text-gray-900 hover:text-gray-500 transition-colors">HOME</Link>
            <a href="/#categories" className="text-gray-500 hover:text-gray-900 transition-colors">CATEGORIES</a>
            <a href="/#about" className="text-gray-500 hover:text-gray-900 transition-colors">ABOUT</a>
            <Link to="/how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors">TRADE</Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">CONTACT</Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products" 
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-none focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}