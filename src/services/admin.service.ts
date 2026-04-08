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

async function getCategories(): Promise<CategoryContent[]> {
  return api.get<CategoryContent[]>('/categories');
}

async function getCategoryBySlug(slug: string): Promise<CategoryContent | null> {
  return api.get<CategoryContent>(`/categories/${slug}`);
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

async function getProducts(categoryFilter?: string): Promise<ProductFamilyContent[]> {
  const params: Record<string, string> = {};
  if (categoryFilter) params.category = categoryFilter;
  return api.get<ProductFamilyContent[]>('/products', params);
}

async function getProductBySlug(slug: string): Promise<ProductFamilyContent | null> {
  return api.get<ProductFamilyContent>(`/products/${slug}`);
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
