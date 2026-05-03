import { CategoryContent, ProductFamilyContent } from '../lib/content-types';
import { api } from '../lib/api-client';
import { brandConfig } from '../config/brand.config';

function brandify(s: string): string {
  if (!s) return s;
  return s
    .replace(/HOMATZ/g, brandConfig.brandName)
    .replace(/homatz/g, brandConfig.brandName.toLowerCase())
    .replace(/trade@homatz\.co\.uk/gi, `trade@${brandConfig.domain}`);
}

export interface ContentPage {
  slug: string;
  title: string;
  body: string;
  status: 'published' | 'draft';
  // seoTitle/seoDescription match the backend field names
  seoTitle?: string;
  seoDescription?: string;
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

// ---------- Slugify helper ----------
function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------- Category CRUD ----------

/**
 * Map DB category record → CategoryContent (frontend shape).
 * DB has: heroImage (string), intro (string), ctaStrip ({headline,...}), subcategories[].name
 * Frontend needs: heroImages ([{src,alt}]), sections ([intro,ctaStrip]), subcategories[].title
 * Extra fields (featuredFamilies, relatedCategories, etc.) are stored in DB metadata JSON.
 */
function normalizeCategory(raw: any): CategoryContent {
  const meta: Record<string, any> = raw.metadata ?? {};

  // Build heroImages: prefer metadata.heroImages (array); fall back to single heroImage string
  const heroImages: CategoryContent['heroImages'] =
    Array.isArray(meta.heroImages) && meta.heroImages.length > 0
      ? meta.heroImages
      : raw.heroImage
        ? [{ src: raw.heroImage, alt: raw.name ?? '' }]
        : [];

  // Rebuild subcategories: DB stores {name, slug, description, image}; frontend uses {title, description, image, href}
  const subcategories: CategoryContent['subcategories'] = Array.isArray(raw.subcategories)
    ? raw.subcategories.map((s: any) => ({
        title: s.name ?? s.title ?? '',
        description: s.description ?? '',
        image: s.image ?? '',
        href: s.href ?? meta.subcategoryHrefs?.[s.slug] ?? '',
      }))
    : [];

  // Rebuild sections from intro + ctaStrip
  const sections: CategoryContent['sections'] = [];
  if (raw.intro) {
    sections.push({ type: 'intro', text: raw.intro });
  }
  if (raw.ctaStrip && typeof raw.ctaStrip === 'object') {
    const cta = raw.ctaStrip as Record<string, any>;
    sections.push({
      type: 'ctaStrip',
      title: cta.headline ?? '',
      description: cta.description ?? '',
      ctas: cta.buttonText
        ? [{ label: cta.buttonText, href: cta.buttonLink ?? '', variant: 'primary' as const }]
        : [],
    });
  }

  // Benefits stored directly in DB
  const benefits: CategoryContent['benefits'] = Array.isArray(raw.benefits) ? raw.benefits : undefined;

  return {
    slug: raw.slug,
    name: raw.name,
    description: brandify(raw.description ?? ''),
    seoTitle: raw.seoTitle ?? undefined,
    seoDescription: raw.seoDescription ?? undefined,
    productCount: meta.productCount ?? raw._count?.productFamilies ?? 0,
    b2bLabel: meta.b2bLabel ?? undefined,
    heroImages,
    subcategories,
    featuredFamilies: Array.isArray(meta.featuredFamilies) ? meta.featuredFamilies : [],
    bestSellers: Array.isArray(meta.bestSellers) ? meta.bestSellers : undefined,
    relatedCategories: Array.isArray(meta.relatedCategories) ? meta.relatedCategories : undefined,
    benefits,
    sections: sections.length > 0 ? sections : undefined,
  };
}

/**
 * Map CategoryContent (frontend shape) → DB payload.
 * Translates heroImages→heroImage, sections→intro/ctaStrip, subcategories title→name,
 * and packs extra fields into metadata JSON.
 */
function categoryToDbPayload(data: CategoryContent) {
  // heroImage: use first heroImage src for the dedicated DB column
  const heroImage = data.heroImages?.[0]?.src ?? undefined;

  // intro: extract from sections
  const introSection = (data.sections ?? []).find((s) => s.type === 'intro');
  const intro = introSection && introSection.type === 'intro' ? introSection.text : undefined;

  // ctaStrip: extract from sections and convert to DB shape
  const ctaSection = (data.sections ?? []).find((s) => s.type === 'ctaStrip');
  const ctaStrip =
    ctaSection && ctaSection.type === 'ctaStrip'
      ? {
          headline: ctaSection.title,
          description: ctaSection.description ?? '',
          buttonText: ctaSection.ctas[0]?.label ?? '',
          buttonLink: ctaSection.ctas[0]?.href ?? '',
        }
      : undefined;

  // subcategories: map title→name, generate slug if missing
  const subcategories = data.subcategories.map((s, i) => ({
    name: s.title,
    slug: slugify(s.title) || `subcat-${i}`,
    description: s.description ?? undefined,
    image: s.image ?? undefined,
    sortOrder: i,
  }));

  // Build subcategoryHrefs map (slug→href) to store in metadata so we can restore hrefs on load
  const subcategoryHrefs: Record<string, string> = {};
  data.subcategories.forEach((s) => {
    if (s.href) subcategoryHrefs[slugify(s.title)] = s.href;
  });

  // metadata: store all fields the DB doesn't have dedicated columns for
  const metadata: Record<string, any> = {
    heroImages: data.heroImages ?? [],
    featuredFamilies: data.featuredFamilies ?? [],
    relatedCategories: data.relatedCategories ?? [],
    bestSellers: data.bestSellers ?? [],
    productCount: data.productCount ?? 0,
    b2bLabel: data.b2bLabel ?? '',
    subcategoryHrefs,
  };

  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    heroImage,
    intro,
    ctaStrip,
    benefits: data.benefits,
    metadata,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    subcategories,
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
  const payload = categoryToDbPayload(data);
  try {
    const result = await api.put<any>(`/categories/${data.slug}`, payload);
    return normalizeCategory(result);
  } catch {
    const result = await api.post<any>('/categories', payload);
    return normalizeCategory(result);
  }
}

async function deleteCategory(slug: string): Promise<void> {
  await api.delete(`/categories/${slug}`);
}

// ---------- Product CRUD ----------

/**
 * Map DB productFamily record → ProductFamilyContent (frontend shape).
 * DB has: gallery (string[]), longDescription, variants[].{name,sku}, category.slug
 * Frontend needs: gallery ([{src,alt}]), description, variants[].{title}, categorySlug
 * Extra fields (relatedProducts, relatedCategories, specs as SpecRow[], support.title) are in metadata.
 */
function normalizeProduct(raw: any): ProductFamilyContent {
  const meta: Record<string, any> = raw.metadata ?? {};

  // gallery: combine DB string[] with metadata alt texts
  const galleryAlts: string[] = Array.isArray(meta.galleryAlts) ? meta.galleryAlts : [];
  const gallery: ProductFamilyContent['gallery'] = Array.isArray(raw.gallery)
    ? raw.gallery.map((src: string, i: number) => ({ src, alt: galleryAlts[i] ?? '' }))
    : [];

  // variants: prefer metadata titles; fall back to DB name
  const variants = Array.isArray(raw.variants)
    ? raw.variants.map((v: any, i: number) => ({
        title: (meta.variantTitles as string[] | undefined)?.[i] ?? (v.name as string) ?? '',
        image: (v.image as string | undefined) ?? undefined,
      }))
    : [];

  // specifications: use metadata rawSpecs (SpecRow[]) if available
  const specifications = Array.isArray(meta.rawSpecs) ? meta.rawSpecs : undefined;

  // support
  const support =
    meta.supportTitle || raw.supportText
      ? {
          title: meta.supportTitle ?? '',
          description: raw.supportText ?? '',
          ctas: Array.isArray(meta.supportCtas) ? meta.supportCtas : undefined,
        }
      : undefined;

  return {
    slug: raw.slug,
    categorySlug: raw.category?.slug ?? raw.categorySlug ?? '',
    name: raw.name,
    description: raw.longDescription ?? meta.description ?? '',
    summary: raw.summary ?? '',
    seoTitle: raw.seoTitle ?? undefined,
    seoDescription: raw.seoDescription ?? undefined,
    gallery,
    features: Array.isArray(raw.features) ? raw.features : [],
    useCases: Array.isArray(raw.useCases) ? raw.useCases : undefined,
    variants: variants.length > 0 ? variants : undefined,
    specifications,
    relatedProducts: Array.isArray(meta.relatedProducts) ? meta.relatedProducts : undefined,
    relatedCategories: Array.isArray(meta.relatedCategories) ? meta.relatedCategories : undefined,
    support,
  };
}

/**
 * Map ProductFamilyContent (frontend shape) → DB payload.
 */
function productToDbPayload(data: ProductFamilyContent) {
  // gallery: split into URL array + alt array
  const galleryUrls = data.gallery.map((g) => g.src);
  const galleryAlts = data.gallery.map((g) => g.alt ?? '');

  // variants: create DB variant records (name + generated SKU)
  const variants =
    data.variants && data.variants.length > 0
      ? data.variants.map((v, i) => ({
          name: v.title,
          sku: `${data.slug}-${slugify(v.title) || i}`,
          image: v.image ?? undefined,
          sortOrder: i,
        }))
      : undefined;

  // Extract variant titles for metadata (to restore form on load)
  const variantTitles = data.variants?.map((v) => v.title) ?? [];

  // metadata: store all extra fields
  const metadata: Record<string, any> = {
    galleryAlts,
    variantTitles,
    rawSpecs: data.specifications ?? [],
    relatedProducts: data.relatedProducts ?? [],
    relatedCategories: data.relatedCategories ?? [],
    supportTitle: data.support?.title ?? '',
    supportCtas: data.support?.ctas ?? [],
    description: data.description,
  };

  return {
    categorySlug: data.categorySlug,
    name: data.name,
    slug: data.slug,
    summary: data.summary,
    longDescription: data.description,
    features: data.features,
    useCases: data.useCases,
    gallery: galleryUrls,
    supportText: data.support?.description,
    metadata,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    variants,
  };
}

async function getProducts(categoryFilter?: string): Promise<ProductFamilyContent[]> {
  const params: Record<string, string> = {};
  if (categoryFilter) params.category = categoryFilter;
  const data = await api.get<any>('/products', params);
  // Products endpoint returns paginated: { data: [], total, page, limit }
  const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  return items.map(normalizeProduct);
}

async function getProductBySlug(slug: string): Promise<ProductFamilyContent | null> {
  const data = await api.get<any>(`/products/${slug}`);
  return data ? normalizeProduct(data) : null;
}

async function saveProduct(data: ProductFamilyContent): Promise<ProductFamilyContent> {
  const payload = productToDbPayload(data);
  try {
    const result = await api.put<any>(`/products/${data.slug}`, payload);
    return normalizeProduct(result);
  } catch {
    const result = await api.post<any>('/products', payload);
    return normalizeProduct(result);
  }
}

async function deleteProduct(slug: string): Promise<void> {
  await api.delete(`/products/${slug}`);
}

// ---------- Page CRUD ----------

async function getPages(): Promise<ContentPage[]> {
  // Use the admin endpoint so all pages (including drafts) are visible
  return api.get<ContentPage[]>('/admin/pages');
}

async function getPageBySlug(slug: string): Promise<ContentPage | null> {
  try {
    return await api.get<ContentPage>(`/admin/pages/${slug}`);
  } catch {
    return null;
  }
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

// Export normalize functions for use by public pages
export { normalizeCategory, normalizeProduct };
