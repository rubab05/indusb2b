import type {
  CategoryContent,
  ProductFamilyContent,
} from "./content-types";
import { categories } from "../content/categories";
import { productFamilies } from "../content/product-families";

export function getCategoryBySlug(
  slug: string,
): CategoryContent | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getProductFamilyBySlug(
  slug: string,
): ProductFamilyContent | undefined {
  return productFamilies.find((product) => product.slug === slug);
}

export function getProductsByCategorySlug(
  categorySlug: string,
): ProductFamilyContent[] {
  return productFamilies.filter(
    (product) => product.categorySlug === categorySlug,
  );
}

export function getRelatedCategories(
  currentSlug: string,
): CategoryContent[] {
  return categories.filter((category) => category.slug !== currentSlug);
}