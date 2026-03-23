export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-16">
          {/* Categories */}
          <div>
            <h4 className="text-xs tracking-widest mb-6 text-gray-900">CATEGORIES</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Mats & Rugs</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Decoration & Seasonal</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Kitchen & Household</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Garden & Outdoor</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Toys & Games</a></li>
            </ul>
          </div>

          {/* Trade */}
          <div>
            <h4 className="text-xs tracking-widest mb-6 text-gray-900">TRADE</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Become a Stockist</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Trade Enquiries</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Download Catalogue</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs tracking-widest mb-6 text-gray-900">ABOUT</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">About HOMATZ</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Quality Standards</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest mb-6 text-gray-900">CONTACT</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <p>trade@homatz.co.uk</p>
              <p>+44 (0) 1234 567 890</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 text-xs text-gray-500 tracking-wide">
          <p>&copy; 2026 HOMATZ by Indusfort Limited</p>
        </div>
      </div>
    </footer>
  );
}