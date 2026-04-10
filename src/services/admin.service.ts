import { CategoryContent, ProductFamilyContent } from '../lib/content-types';
import { api } from '../lib/api-client';

export interface ContentPage {
  slug: string;
  title: string;
  body: string;
  status: 'published' | 'draft';
  metaTitle?: string;
  metaDescription?: string;
  lastUpdated: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  uploadDate: string;
}

// ---------- Category CRUD ----------
function normalizeCategory(category: any): CategoryContent {
  return {
    ...category,
    productCount: category.productCount ?? category._count?.productFamilies ?? 0,
    subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
  };
}

async function getCategories(): Promise<CategoryContent[]> {
  const data = await api.get<any[]>('/categories');
  return Array.isArray(data) ? data.map(normalizeCategory) : [];
}

async function getCategoryBySlug(slug: string): Promise<CategoryContent | null> {
  const data = await api.get<any>(`/categories/${slug}`);
  return data ? normalizeCategory(data) : null;
}

async function saveCategory(data: CategoryContent): Promise<CategoryContent> {
  try {
    return await api.put<CategoryContent>(`/categories/${data.slug}`, data);
  } catch {
    return api.post<CategoryContent>('/categories', data);
  }
}

async function deleteCategory(slug: string): Promise<void> {
  await api.delete(`/categories/${slug}`);
}

// ---------- Product CRUD ----------
function normalizeProduct(product: any): ProductFamilyContent {
  return {
    ...product,
    categorySlug: product.categorySlug ?? product.category?.slug ?? '',
    categoryName: product.categoryName ?? product.category?.name ?? '',
    variants: Array.isArray(product.variants) ? product.variants : [],
  };
}

async function getProducts(categoryFilter?: string): Promise<ProductFamilyContent[]> {
  const params: Record<string, string> = {};
  if (categoryFilter) params.category = categoryFilter;
  const data = await api.get<any[]>('/products', params);
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

async function getProductBySlug(slug: string): Promise<ProductFamilyContent | null> {
  const data = await api.get<any>(`/products/${slug}`);
  return data ? normalizeProduct(data) : null;
}

async function saveProduct(data: ProductFamilyContent): Promise<ProductFamilyContent> {
  try {
    return await api.put<ProductFamilyContent>(`/products/${data.slug}`, data);
  } catch {
    return api.post<ProductFamilyContent>('/products', data);
  }
}

async function deleteProduct(slug: string): Promise<void> {
  await api.delete(`/products/${slug}`);
}

// ---------- Page CRUD ----------

async function getPages(): Promise<ContentPage[]> {
  return api.get<ContentPage[]>('/pages');
}

async function getPageBySlug(slug: string): Promise<ContentPage | null> {
  return api.get<ContentPage>(`/pages/${slug}`);
}

async function savePage(data: ContentPage): Promise<ContentPage> {
  try {
    return await api.put<ContentPage>(`/pages/${data.slug}`, data);
  } catch {
    return api.post<ContentPage>('/pages', data);
  }
}

async function deletePage(slug: string): Promise<void> {
  await api.delete(`/pages/${slug}`);
}

// ---------- FAQ CRUD ----------

async function getFAQItems(): Promise<FAQItem[]> {
  return api.get<FAQItem[]>('/faq');
}

async function saveFAQItem(data: FAQItem): Promise<FAQItem> {
  if (data.id && !data.id.startsWith('faq-new')) {
    return api.put<FAQItem>(`/faq/${data.id}`, data);
  }
  return api.post<FAQItem>('/faq', data);
}

async function deleteFAQItem(id: string): Promise<void> {
  await api.delete(`/faq/${id}`);
}

async function reorderFAQItems(ids: string[]): Promise<void> {
  await api.put('/faq/reorder', { items: ids });
}

// ---------- Media CRUD ----------

async function getMediaItems(): Promise<MediaItem[]> {
  return api.get<MediaItem[]>('/media');
}

async function uploadMedia(file: File): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<MediaItem>('/media/upload', formData);
}

async function deleteMedia(id: string): Promise<void> {
  await api.delete(`/media/${id}`);
}

// ---------- Export ----------

export const adminService = {
  getCategories,
  getCategoryBySlug,
  saveCategory,
  deleteCategory,
  getProducts,
  getProductBySlug,
  saveProduct,
  deleteProduct,
  getPages,
  getPageBySlug,
  savePage,
  deletePage,
  getFAQItems,
  saveFAQItem,
  deleteFAQItem,
  reorderFAQItems,
  getMediaItems,
  uploadMedia,
  deleteMedia,
};
