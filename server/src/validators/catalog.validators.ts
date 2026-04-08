import { z } from 'zod';

// ─── Category ───────────────────────────────────────────

export const subcategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  intro: z.string().optional(),
  benefits: z.array(z.object({ icon: z.string().optional(), title: z.string(), description: z.string() })).optional(),
  ctaStrip: z.object({
    headline: z.string(),
    description: z.string().optional(),
    buttonText: z.string(),
    buttonLink: z.string(),
  }).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['published', 'draft']).default('published'),
  sortOrder: z.number().int().default(0),
  subcategories: z.array(subcategorySchema).optional(),
});

export const categoryUpdateSchema = categorySchema.partial();

export const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    sortOrder: z.number().int(),
  })).min(1),
});

// ─── Product ────────────────────────────────────────────

export const productVariantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  image: z.string().optional(),
  specs: z.record(z.string()).optional(),
  sortOrder: z.number().int().default(0),
});

export const productSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().optional(),
  longDescription: z.string().optional(),
  features: z.array(z.string()).default([]),
  useCases: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  supportText: z.string().optional(),
  supportContact: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['published', 'draft']).default('published'),
  sortOrder: z.number().int().default(0),
  variants: z.array(productVariantSchema).optional(),
});

export const productUpdateSchema = productSchema.partial();

// ─── Content Page ───────────────────────────────────────

export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  body: z.string().min(1, 'Body is required'),
  status: z.enum(['published', 'draft']).default('published'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const pageUpdateSchema = pageSchema.partial();

// ─── FAQ ────────────────────────────────────────────────

export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().default('General'),
  sortOrder: z.number().int().default(0),
});

export const faqUpdateSchema = faqSchema.partial();
