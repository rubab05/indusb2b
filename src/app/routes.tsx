import { createBrowserRouter, Navigate, useParams } from "react-router";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import ShippingPage from "./pages/ShippingPage";
import ReturnsPage from "./pages/ReturnsPage";
import ContactPage from "./pages/ContactPage";
import ApplyPage from "./pages/ApplyPage";
import ApplyWholesalePage from "./pages/ApplyWholesalePage";
import ApplyDropshipPage from "./pages/ApplyDropshipPage";
import ApplyPendingPage from "./pages/ApplyPendingPage";
import LoginPage from "./pages/LoginPage";

// Redirect /categories/:slug → /category/:slug
function CategorySlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/category/${slug}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },

  // Canonical slug-based routes
  {
    path: "/category/:slug",
    Component: CategoryPage,
  },
  {
    path: "/category/:categorySlug/:productSlug",
    Component: ProductPage,
  },

  // Static informational pages
  { path: "/about", Component: AboutPage },
  { path: "/how-it-works", Component: HowItWorksPage },
  { path: "/faq", Component: FAQPage },
  { path: "/privacy-policy", Component: PrivacyPolicyPage },
  { path: "/terms", Component: TermsPage },
  { path: "/shipping", Component: ShippingPage },
  { path: "/returns", Component: ReturnsPage },
  { path: "/contact", Component: ContactPage },
  { path: "/apply", Component: ApplyPage },
  { path: "/apply/wholesale", Component: ApplyWholesalePage },
  { path: "/apply/dropship", Component: ApplyDropshipPage },
  { path: "/apply/pending", Component: ApplyPendingPage },
  { path: "/login", Component: LoginPage },

  // Legacy URL redirects — preserve existing internal links
  {
    path: "/categories/:slug",
    Component: CategorySlugRedirect,
  },
  {
    path: "/products/stock-pot-4-5l-24cm",
    element: <Navigate to="/category/kitchen-household/stock-pot-4-5l-24cm" replace />,
  },
]);
