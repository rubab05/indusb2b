import { Link } from "react-router";
import { useBrand } from "../../contexts/BrandContext";

export function Footer() {
  const { brand } = useBrand();
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 mb-8 md:mb-16">
          {/* Categories */}
          <div>
            <h4 className="text-xs tracking-widest mb-4 md:mb-6 text-gray-900">CATEGORIES</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/category/mats-and-rugs" className="hover:text-gray-900 transition-colors">Mats &amp; Rugs</Link></li>
              <li><Link to="/category/decoration-and-seasonal" className="hover:text-gray-900 transition-colors">Decoration &amp; Seasonal</Link></li>
              <li><Link to="/category/kitchen-and-household" className="hover:text-gray-900 transition-colors">Kitchen &amp; Household</Link></li>
              <li><Link to="/category/garden-and-outdoor" className="hover:text-gray-900 transition-colors">Garden &amp; Outdoor</Link></li>
              <li><Link to="/category/toys-and-games" className="hover:text-gray-900 transition-colors">Toys &amp; Games</Link></li>
            </ul>
          </div>

          {/* Trade */}
          <div>
            <h4 className="text-xs tracking-widest mb-4 md:mb-6 text-gray-900">TRADE</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Trade Enquiries</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Download Catalogue</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs tracking-widest mb-4 md:mb-6 text-gray-900">ABOUT</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-gray-900 transition-colors">About {brand.brandName}</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs tracking-widest mb-4 md:mb-6 text-gray-900">LEGAL</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-900 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/shipping" className="hover:text-gray-900 transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-gray-900 transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest mb-4 md:mb-6 text-gray-900">CONTACT</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <p>{`trade@${brand.domain}`}</p>
              <p>+44 (0) 1234 567 890</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 text-xs text-gray-500 tracking-wide">
          <p>&copy; 2026 {brand.brandName} by Indusfort Limited</p>
        </div>
      </div>
    </footer>
  );
}
