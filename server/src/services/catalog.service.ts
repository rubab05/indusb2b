import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import { parsePagination } from '../utils/pagination.js';

// ─── Categories ─────────────────────────────────────────

export async function getCategories() {
  return prisma.category.findMany({
    where: { status: 'published' },
    orderBy: { sortOrder: 'asc' },
    include: {
      subcategories: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { productFamilies: true } },
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      subcategories: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { productFamilies: true } },
    },
  });
}

export async function getCategoryBySlug(slug: string, adminView = false) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: { orderBy: { sortOrder: 'asc' } },
      productFamilies: {
        where: adminView ? undefined : { status: 'published' },
        orderBy: { sortOrder: 'asc' },
        include: {
          variants: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { variants: true } },
        },
      },
    },
  });

  if (!category) throw ApiError.notFound('Category not found');
  if (!adminView && category.status !== 'published') throw ApiError.notFound('Category not found');

  return category;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  intro?: string;
  benefits?: Prisma.InputJsonValue;
  ctaStrip?: Prisma.InputJsonValue;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  sortOrder?: number;
  subcategories?: Array<{
    name: string;
    slug: string;
    description?: string;
    image?: string;
    sortOrder?: number;
  }>;
}) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) throw ApiError.conflict('A category with this slug already exists');

  const { subcategories, benefits, ctaStrip, ...rest } = data;

  return prisma.category.create({
    data: {
      ...rest,
      ...(benefits !== undefined && { benefits }),
      ...(ctaStrip !== undefined && { ctaStrip }),
      subcategories: subcategories
        ? { create: subcategories }
        : undefined,
    },
    include: {
      subcategories: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function updateCategory(
  slug: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    intro: string;
    benefits: Prisma.InputJsonValue;
    ctaStrip: Prisma.InputJsonValue;
    seoTitle: string;
    seoDescription: string;
    status: string;
    sortOrder: number;
    subcategories: Array<{
      name: string;
      slug: string;
      description?: string;
      image?: string;
      sortOrder?: number;
    }>;
  }>
) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) throw ApiError.notFound('Category not found');

  if (data.slug && data.slug !== slug) {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) throw ApiError.conflict('A category with this slug already exists');
  }

  const { subcategories, benefits, ctaStrip, ...rest } = data;

  if (subcategories !== undefined) {
    await prisma.subcategory.deleteMany({ where: { categoryId: category.id } });
  }

  return prisma.category.update({
    where: { id: category.id },
    data: {
      ...rest,
      ...(benefits !== undefined && { benefits }),
      ...(ctaStrip !== undefined && { ctaStrip }),
      subcategories: subcategories
        ? { create: subcategories.map((s) => ({ ...s, categoryId: category.id })) }
        : undefined,
    },
    include: {
      subcategories: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function deleteCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { productFamilies: true } } },
  });
  if (!category) throw ApiError.notFound('Category not found');
  if (category._count.productFamilies > 0) {
    throw ApiError.badRequest('Cannot delete category with existing products. Remove products first.');
  }
  await prisma.category.delete({ where: { id: category.id } });
}

export async function reorderCategories(items: Array<{ id: string; sortOrder: number }>) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.category.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
}

// ─── Products ───────────────────────────────────────────

export async function getProducts(query: {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  status?: string;
}) {
  const { page, limit, offset } = parsePagination(query);
  const adminView = query.status !== undefined;

  const where = {
    ...(adminView ? (query.status ? { status: query.status } : {}) : { status: 'published' }),
    ...(query.category
      ? { category: { slug: query.category } }
      : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { summary: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.productFamily.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { variants: true } },
      },
    }),
    prisma.productFamily.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getProductBySlug(slug: string, adminView = false) {
  const product = await prisma.productFamily.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product) throw ApiError.notFound('Product not found');
  if (!adminView && product.status !== 'published') throw ApiError.notFound('Product not found');

  return product;
}

export async function getRelatedProducts(slug: string) {
  const product = await prisma.productFamily.findUnique({
    where: { slug },
    select: { categoryId: true, id: true },
  });

  if (!product) throw ApiError.notFound('Product not found');

  return prisma.productFamily.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: 'published',
    },
    take: 4,
    orderBy: { sortOrder: 'asc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { variants: true } },
    },
  });
}

export async function createProduct(data: {
  categoryId: string;
  name: string;
  slug: string;
  summary?: string;
  longDescription?: string;
  features?: string[];
  useCases?: string[];
  gallery?: string[];
  specifications?: Prisma.InputJsonValue;
  supportText?: string;
  supportContact?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  sortOrder?: number;
  variants?: Array<{
    name: string;
    sku: string;
    image?: string;
    specs?: Prisma.InputJsonValue;
    sortOrder?: number;
  }>;
}) {
  const existing = await prisma.productFamily.findUnique({ where: { slug: data.slug } });
  if (existing) throw ApiError.conflict('A product with this slug already exists');

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw ApiError.badRequest('Category not found');

  const { variants, ...productData } = data;

  // Check variant SKU uniqueness
  if (variants?.length) {
    const skus = variants.map((v) => v.sku);
    const existing = await prisma.productVariant.findFirst({ where: { sku: { in: skus } } });
    if (existing) throw ApiError.conflict(`SKU already exists: ${existing.sku}`);
  }

  return prisma.productFamily.create({
    data: {
      ...productData,
      variants: variants ? { create: variants } : undefined,
    },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function updateProduct(
  slug: string,
  data: Partial<{
    categoryId: string;
    name: string;
    slug: string;
    summary: string;
    longDescription: string;
    features: string[];
    useCases: string[];
    gallery: string[];
    specifications: Prisma.InputJsonValue;
    supportText: string;
    supportContact: string;
    seoTitle: string;
    seoDescription: string;
    status: string;
    sortOrder: number;
    variants: Array<{
      name: string;
      sku: string;
      image?: string;
      specs?: Prisma.InputJsonValue;
      sortOrder?: number;
    }>;
  }>
) {
  const product = await prisma.productFamily.findUnique({ where: { slug } });
  if (!product) throw ApiError.notFound('Product not found');

  if (data.slug && data.slug !== slug) {
    const existing = await prisma.productFamily.findUnique({ where: { slug: data.slug } });
    if (existing) throw ApiError.conflict('A product with this slug already exists');
  }

  const { variants, ...productData } = data;

  if (variants !== undefined) {
    await prisma.productVariant.deleteMany({ where: { productFamilyId: product.id } });
  }

  return prisma.productFamily.update({
    where: { id: product.id },
    data: {
      ...productData,
      variants: variants ? { create: variants } : undefined,
    },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function deleteProduct(slug: string) {
  const product = await prisma.productFamily.findUnique({ where: { slug } });
  if (!product) throw ApiError.notFound('Product not found');
  await prisma.productFamily.delete({ where: { id: product.id } });
}

// ─── Content Pages ──────────────────────────────────────

export async function getPages(adminView = false) {
  return prisma.contentPage.findMany({
    where: adminView ? undefined : { status: 'published' },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getPageBySlug(slug: string, adminView = false) {
  const page = await prisma.contentPage.findUnique({ where: { slug } });
  if (!page) throw ApiError.notFound('Page not found');
  if (!adminView && page.status !== 'published') throw ApiError.notFound('Page not found');
  return page;
}

export async function createPage(data: {
  title: string;
  slug: string;
  body: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  const existing = await prisma.contentPage.findUnique({ where: { slug: data.slug } });
  if (existing) throw ApiError.conflict('A page with this slug already exists');
  return prisma.contentPage.create({ data });
}

export async function updatePage(
  slug: string,
  data: Partial<{
    title: string;
    slug: string;
    body: string;
    status: string;
    seoTitle: string;
    seoDescription: string;
  }>
) {
  const page = await prisma.contentPage.findUnique({ where: { slug } });
  if (!page) throw ApiError.notFound('Page not found');

  if (data.slug && data.slug !== slug) {
    const existing = await prisma.contentPage.findUnique({ where: { slug: data.slug } });
    if (existing) throw ApiError.conflict('A page with this slug already exists');
  }

  return prisma.contentPage.update({ where: { id: page.id }, data });
}

export async function deletePage(slug: string) {
  const page = await prisma.contentPage.findUnique({ where: { slug } });
  if (!page) throw ApiError.notFound('Page not found');
  await prisma.contentPage.delete({ where: { id: page.id } });
}

// ─── FAQ ────────────────────────────────────────────────

export async function getFAQItems(category?: string) {
  return prisma.fAQItem.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });
}

export async function createFAQItem(data: {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}) {
  return prisma.fAQItem.create({ data });
}

export async function updateFAQItem(
  id: string,
  data: Partial<{
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
  }>
) {
  const item = await prisma.fAQItem.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('FAQ item not found');
  return prisma.fAQItem.update({ where: { id }, data });
}

export async function deleteFAQItem(id: string) {
  const item = await prisma.fAQItem.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('FAQ item not found');
  await prisma.fAQItem.delete({ where: { id } });
}

export async function reorderFAQItems(items: Array<{ id: string; sortOrder: number }>) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.fAQItem.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
}
