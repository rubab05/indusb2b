import { CategoryContent, ProductFamilyContent } from "../lib/content-types";
import { categories as seedCategories } from "../content/categories";
import { productFamilies as seedProducts } from "../content/product-families";

function delay(ms: number = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------- In-memory stores ----------

let categoryStore: CategoryContent[] = [...seedCategories];
let productStore: ProductFamilyContent[] = [...seedProducts];

export interface ContentPage {
  slug: string;
  title: string;
  body: string;
  status: "published" | "draft";
  metaTitle?: string;
  metaDescription?: string;
  lastUpdated: string;
}

let pageStore: ContentPage[] = [
  { slug: "about", title: "About HOMATZ", body: "HOMATZ is a B2B wholesale and dropshipping platform...", status: "published", lastUpdated: "2026-03-15" },
  { slug: "how-it-works", title: "How It Works", body: "Our platform connects wholesale and dropship partners...", status: "published", lastUpdated: "2026-03-15" },
  { slug: "privacy-policy", title: "Privacy Policy", body: "Your privacy is important to us...", status: "published", lastUpdated: "2026-03-10" },
  { slug: "terms", title: "Terms & Conditions", body: "By using this platform you agree to...", status: "published", lastUpdated: "2026-03-10" },
  { slug: "shipping", title: "Shipping Information", body: "We offer free shipping on all wholesale orders...", status: "published", lastUpdated: "2026-03-12" },
  { slug: "returns", title: "Returns Policy", body: "We accept returns within 14 days...", status: "published", lastUpdated: "2026-03-12" },
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

let faqStore: FAQItem[] = [
  { id: "faq-1", question: "What is the minimum order quantity?", answer: "MOQs vary by product category. Check individual product pages for details.", category: "General", order: 0 },
  { id: "faq-2", question: "How do I apply for a wholesale account?", answer: "Visit the Apply page and complete the wholesale application form.", category: "General", order: 1 },
  { id: "faq-3", question: "What payment methods do you accept?", answer: "We accept bank transfer for wholesale and dropship partners.", category: "General", order: 2 },
  { id: "faq-4", question: "How long does delivery take?", answer: "Standard delivery is 3-5 working days. Pallet deliveries may take up to 7 days.", category: "Shipping", order: 0 },
  { id: "faq-5", question: "Can I return damaged items?", answer: "Yes. Report any damage within 48 hours of delivery via your support dashboard.", category: "Returns", order: 0 },
  { id: "faq-6", question: "How does the dropship balance work?", answer: "Dropship partners pre-load funds. Order costs are deducted automatically.", category: "Dropship", order: 0 },
  { id: "faq-7", question: "Are bulk discounts available?", answer: "Yes. Tiered pricing applies based on order volume. See the price list for details.", category: "Wholesale", order: 0 },
];

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  uploadDate: string;
}

let mediaStore: MediaItem[] = [
  { id: "m-1", filename: "barrier-mat-hero.jpg", url: "/uploads/barrier-mat-hero.jpg", mimeType: "image/jpeg", width: 1080, height: 720, uploadDate: "2026-03-01" },
  { id: "m-2", filename: "shaggy-rug-lifestyle.jpg", url: "/uploads/shaggy-rug-lifestyle.jpg", mimeType: "image/jpeg", width: 1080, height: 720, uploadDate: "2026-03-02" },
  { id: "m-3", filename: "stock-pot-main.jpg", url: "/uploads/stock-pot-main.jpg", mimeType: "image/jpeg", width: 800, height: 800, uploadDate: "2026-03-05" },
  { id: "m-4", filename: "christmas-tree-display.jpg", url: "/uploads/christmas-tree-display.jpg", mimeType: "image/jpeg", width: 1200, height: 800, uploadDate: "2026-03-10" },
  { id: "m-5", filename: "gazing-ball-garden.jpg", url: "/uploads/gazing-ball-garden.jpg", mimeType: "image/jpeg", width: 1080, height: 720, uploadDate: "2026-03-12" },
  { id: "m-6", filename: "hula-hoop-assorted.jpg", url: "/uploads/hula-hoop-assorted.jpg", mimeType: "image/jpeg", width: 900, height: 600, uploadDate: "2026-03-15" },
];

// ---------- Category CRUD ----------

async function getCategories(): Promise<CategoryContent[]> {
  await delay();
  return [...categoryStore];
}

async function getCategoryBySlug(slug: string): Promise<CategoryContent | null> {
  await delay();
  return categoryStore.find((c) => c.slug === slug) ?? null;
}

async function saveCategory(data: CategoryContent): Promise<CategoryContent> {
  await delay();
  const idx = categoryStore.findIndex((c) => c.slug === data.slug);
  if (idx >= 0) {
    categoryStore[idx] = data;
  } else {
    categoryStore.push(data);
  }
  return data;
}

async function deleteCategory(slug: string): Promise<void> {
  await delay();
  categoryStore = categoryStore.filter((c) => c.slug !== slug);
}

// ---------- Product CRUD ----------

async function getProducts(categoryFilter?: string): Promise<ProductFamilyContent[]> {
  await delay();
  if (categoryFilter) {
    return productStore.filter((p) => p.categorySlug === categoryFilter);
  }
  return [...productStore];
}

async function getProductBySlug(slug: string): Promise<ProductFamilyContent | null> {
  await delay();
  return productStore.find((p) => p.slug === slug) ?? null;
}

async function saveProduct(data: ProductFamilyContent): Promise<ProductFamilyContent> {
  await delay();
  const idx = productStore.findIndex((p) => p.slug === data.slug);
  if (idx >= 0) {
    productStore[idx] = data;
  } else {
    productStore.push(data);
  }
  return data;
}

async function deleteProduct(slug: string): Promise<void> {
  await delay();
  productStore = productStore.filter((p) => p.slug !== slug);
}

// ---------- Page CRUD ----------

async function getPages(): Promise<ContentPage[]> {
  await delay();
  return [...pageStore];
}

async function getPageBySlug(slug: string): Promise<ContentPage | null> {
  await delay();
  return pageStore.find((p) => p.slug === slug) ?? null;
}

async function savePage(data: ContentPage): Promise<ContentPage> {
  await delay();
  const idx = pageStore.findIndex((p) => p.slug === data.slug);
  if (idx >= 0) {
    pageStore[idx] = data;
  } else {
    pageStore.push(data);
  }
  return data;
}

async function deletePage(slug: string): Promise<void> {
  await delay();
  pageStore = pageStore.filter((p) => p.slug !== slug);
}

// ---------- FAQ CRUD ----------

async function getFAQItems(): Promise<FAQItem[]> {
  await delay();
  return [...faqStore].sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.order - b.order;
  });
}

async function saveFAQItem(data: FAQItem): Promise<FAQItem> {
  await delay();
  const idx = faqStore.findIndex((f) => f.id === data.id);
  if (idx >= 0) {
    faqStore[idx] = data;
  } else {
    data.id = `faq-${Date.now()}`;
    faqStore.push(data);
  }
  return data;
}

async function deleteFAQItem(id: string): Promise<void> {
  await delay();
  faqStore = faqStore.filter((f) => f.id !== id);
}

async function reorderFAQItems(ids: string[]): Promise<void> {
  await delay();
  ids.forEach((id, index) => {
    const item = faqStore.find((f) => f.id === id);
    if (item) item.order = index;
  });
}

// ---------- Media CRUD ----------

async function getMediaItems(): Promise<MediaItem[]> {
  await delay();
  return [...mediaStore];
}

async function uploadMedia(file: File): Promise<MediaItem> {
  await delay(500);
  const item: MediaItem = {
    id: `m-${Date.now()}`,
    filename: file.name,
    url: `/uploads/${file.name}`,
    mimeType: file.type,
    width: 1080,
    height: 720,
    uploadDate: new Date().toISOString().split("T")[0],
  };
  mediaStore.push(item);
  return item;
}

async function deleteMedia(id: string): Promise<void> {
  await delay();
  mediaStore = mediaStore.filter((m) => m.id !== id);
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
