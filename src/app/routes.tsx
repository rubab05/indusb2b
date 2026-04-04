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
import ApplyRestrictedPage from "./pages/ApplyRestrictedPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersListPage from "./pages/portal/OrdersListPage";
import OrderDetailPage from "./pages/portal/OrderDetailPage";
import InvoicesPage from "./pages/portal/InvoicesPage";
import TrackingPage from "./pages/portal/TrackingPage";
import SupportListPage from "./pages/portal/SupportListPage";
import NewSupportTicketPage from "./pages/portal/NewSupportTicketPage";
import SupportTicketDetailPage from "./pages/portal/SupportTicketDetailPage";
import AccountSettingsPage from "./pages/portal/AccountSettingsPage";
import PriceListPage from "./pages/portal/PriceListPage";
import MOQInfoPage from "./pages/portal/MOQInfoPage";
import BulkOrderPage from "./pages/portal/BulkOrderPage";
import QuickOrderPage from "./pages/portal/QuickOrderPage";
import QuoteRequestPage from "./pages/portal/QuoteRequestPage";
import AuthGuard from "./components/guards/AuthGuard";
import WholesaleGuard from "./components/guards/WholesaleGuard";
import PortalLayout from "../layouts/PortalLayout";

// Redirect /categories/:slug → /category/:slug
function CategorySlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/category/${slug}`} replace />;
}

// Wraps the portal layout with AuthGuard
function ProtectedPortal() {
  return (
    <AuthGuard>
      <PortalLayout />
    </AuthGuard>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },

  // Canonical slug-based routes
  { path: "/category/:slug", Component: CategoryPage },
  { path: "/category/:categorySlug/:productSlug", Component: ProductPage },

  // Static informational pages
  { path: "/about", Component: AboutPage },
  { path: "/how-it-works", Component: HowItWorksPage },
  { path: "/faq", Component: FAQPage },
  { path: "/privacy-policy", Component: PrivacyPolicyPage },
  { path: "/terms", Component: TermsPage },
  { path: "/shipping", Component: ShippingPage },
  { path: "/returns", Component: ReturnsPage },
  { path: "/contact", Component: ContactPage },

  // Auth pages
  { path: "/login", Component: LoginPage },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/reset-password", Component: ResetPasswordPage },

  // Application flow
  { path: "/apply", Component: ApplyPage },
  { path: "/apply/wholesale", Component: ApplyWholesalePage },
  { path: "/apply/dropship", Component: ApplyDropshipPage },
  { path: "/apply/pending", Component: ApplyPendingPage },
  { path: "/apply/restricted", Component: ApplyRestrictedPage },

  // Protected partner portal — all /dashboard/* share PortalLayout
  {
    path: "/dashboard",
    Component: ProtectedPortal,
    children: [
      { index: true, Component: DashboardPage },
      { path: "orders", Component: OrdersListPage },
      { path: "orders/:orderId", Component: OrderDetailPage },
      { path: "invoices", Component: InvoicesPage },
      { path: "tracking", Component: TrackingPage },
      { path: "support", Component: SupportListPage },
      { path: "support/new", Component: NewSupportTicketPage },
      { path: "support/:ticketId", Component: SupportTicketDetailPage },
      { path: "account", Component: AccountSettingsPage },
      // Wholesale-only routes
      {
        path: "price-list",
        element: <WholesaleGuard><PriceListPage /></WholesaleGuard>,
      },
      {
        path: "moq-info",
        element: <WholesaleGuard><MOQInfoPage /></WholesaleGuard>,
      },
      {
        path: "orders/new",
        element: <WholesaleGuard><BulkOrderPage /></WholesaleGuard>,
      },
      {
        path: "orders/quick",
        element: <WholesaleGuard><QuickOrderPage /></WholesaleGuard>,
      },
      {
        path: "quote-request",
        element: <WholesaleGuard><QuoteRequestPage /></WholesaleGuard>,
      },
    ],
  },

  // Legacy URL redirects
  { path: "/categories/:slug", Component: CategorySlugRedirect },
  {
    path: "/products/stock-pot-4-5l-24cm",
    element: <Navigate to="/category/kitchen-household/stock-pot-4-5l-24cm" replace />,
  },
]);
