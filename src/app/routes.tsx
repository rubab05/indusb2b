import { createBrowserRouter, Navigate, useParams } from "react-router";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";

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
