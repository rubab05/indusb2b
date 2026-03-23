import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import KitchenCategoryPage from "./pages/KitchenCategoryPage";
import ProductPage from "./pages/ProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/categories/kitchen-household",
    Component: KitchenCategoryPage,
  },
  {
    path: "/products/stock-pot-4-5l-24cm",
    Component: ProductPage,
  },
]);