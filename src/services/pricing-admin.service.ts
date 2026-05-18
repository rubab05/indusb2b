import { api } from '../lib/api-client';
import { StockStatus } from '../types/commerce';

export interface PriceListItemAdmin {
  id?: string;
  productFamilyId?: string;
  productSlug: string;
  productName: string;
  sku: string;
  category: string;
  moq: number;
  unitPrice: number;
  stockStatus: StockStatus;
  bulkTiers: Array<{ label: string; minQty: number; pricePerUnit: number }>;
}

export interface PricingRule {
  id?: string;
  categorySlug: string;
  productSlug?: string;
  visibleToWholesale: boolean;
  visibleToDropship: boolean;
}

export interface MOQRuleAdmin {
  id: string;
  categorySlug: string;
  productSlug?: string;
  minQuantity: number;
  unit: string;
}

export interface BulkDiscountTier {
  id: string;
  tierName: string;
  minQty: number;
  maxQty: number;
  discountPercent: number;
}

function normalizePricingRule(rule: any): PricingRule {
  return {
    id: rule.id,
    categorySlug: rule.categorySlug ?? rule.category?.slug ?? '',
    productSlug: rule.productSlug ?? undefined,
    visibleToWholesale: Boolean(rule.visibleToWholesale),
    visibleToDropship: Boolean(rule.visibleToDropship),
  };
}

function normalizeMOQRule(rule: any): MOQRuleAdmin {
  return {
    id: rule.id,
    categorySlug: rule.categorySlug ?? rule.category?.slug ?? '',
    productSlug: rule.productSlug ?? undefined,
    minQuantity: Number(rule.minQuantity ?? 0),
    unit: rule.unit ?? 'units',
  };
}

function normalizeBulkDiscountTier(tier: any): BulkDiscountTier {
  return {
    id: tier.id,
    tierName: tier.tierName ?? '',
    minQty: Number(tier.minQty ?? 0),
    maxQty: Number(tier.maxQty ?? 0),
    discountPercent: Number(tier.discountPercent ?? 0),
  };
}

async function getPricingRules(): Promise<PricingRule[]> {
  const data = await api.get<any[]>('/admin/pricing/rules');
  return Array.isArray(data) ? data.map(normalizePricingRule) : [];
}

async function savePricingRules(rules: PricingRule[]): Promise<void> {
  for (const rule of rules) {
    if (rule.id) {
      await api.put(`/admin/pricing/rules/${rule.id}`, rule);
    } else {
      await api.post('/admin/pricing/rules', rule);
    }
  }
}

async function getMOQRules(): Promise<MOQRuleAdmin[]> {
  const data = await api.get<any[]>('/admin/pricing/moq');
  return Array.isArray(data) ? data.map(normalizeMOQRule) : [];
}

async function resolveCategoryId(categorySlug: string): Promise<string> {
  const categories = await api.get<any[]>('/categories');
  const match = Array.isArray(categories)
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  if (!match?.id) {
    throw new Error(`Category not found for slug: ${categorySlug}`);
  }

  return match.id;
}

async function saveMOQRule(rule: MOQRuleAdmin): Promise<MOQRuleAdmin> {
  const categoryId = await resolveCategoryId(rule.categorySlug);

  const payload = {
    categoryId,
    productSlug: rule.productSlug || undefined,
    minQuantity: Number(rule.minQuantity),
    unit: rule.unit,
  };

  const saved =
    rule.id && !rule.id.startsWith('moq-new')
      ? await api.put<any>(`/admin/pricing/moq/${rule.id}`, payload)
      : await api.post<any>('/admin/pricing/moq', payload);

  return normalizeMOQRule(saved);
}

async function deleteMOQRule(id: string): Promise<void> {
  await api.delete(`/admin/pricing/moq/${id}`);
}

async function getBulkDiscountTiers(): Promise<BulkDiscountTier[]> {
  const data = await api.get<any[]>('/admin/pricing/tiers');
  return Array.isArray(data) ? data.map(normalizeBulkDiscountTier) : [];
}

async function saveBulkDiscountTier(tier: BulkDiscountTier): Promise<BulkDiscountTier> {
  const saved =
    tier.id && !tier.id.startsWith('tier-new')
      ? await api.put<any>(`/admin/pricing/tiers/${tier.id}`, tier)
      : await api.post<any>('/admin/pricing/tiers', tier);

  return normalizeBulkDiscountTier(saved);
}

async function deleteBulkDiscountTier(id: string): Promise<void> {
  await api.delete(`/admin/pricing/tiers/${id}`);
}

// ---------- Price List CRUD ----------

function normalizePriceListItemAdmin(item: any): PriceListItemAdmin {
  const rawCategory = item.category ?? item.productFamily?.category?.name ?? '';
  const category =
    rawCategory !== null && typeof rawCategory === 'object'
      ? (rawCategory.name ?? '')
      : rawCategory;

  return {
    id: item.id,
    productFamilyId: item.productFamilyId ?? item.productFamily?.id,
    productSlug: item.productSlug ?? item.productFamily?.slug ?? '',
    productName: item.productName ?? item.productFamily?.name ?? '',
    sku: item.sku ?? item.productSlug ?? '',
    category,
    moq: Number(item.moq ?? 0),
    unitPrice: Number(item.unitPrice ?? 0),
    stockStatus: (item.stockStatus ?? 'In Stock') as StockStatus,
    bulkTiers: Array.isArray(item.bulkTiers)
      ? item.bulkTiers.map((t: any) => ({
          label: t.label ?? '',
          minQty: Number(t.minQty ?? 0),
          pricePerUnit: Number(t.pricePerUnit ?? 0),
        }))
      : [],
  };
}

async function getPriceListAdmin(): Promise<PriceListItemAdmin[]> {
  // Try admin endpoint first; fall back to the public price-list endpoint (same data, different access level)
  try {
    const data = await api.get<any[]>('/admin/pricing/price-list');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizePriceListItemAdmin);
    }
  } catch { /* fall through */ }
  const data = await api.get<any[]>('/pricing/price-list');
  return Array.isArray(data) ? data.map(normalizePriceListItemAdmin) : [];
}

async function savePriceListItem(item: PriceListItemAdmin): Promise<PriceListItemAdmin> {
  const saved =
    item.id && !item.id.startsWith('price-new')
      ? await api.put<any>(`/admin/pricing/price-list/${item.id}`, item)
      : await api.post<any>('/admin/pricing/price-list', item);
  return normalizePriceListItemAdmin(saved);
}

async function deletePriceListItem(id: string): Promise<void> {
  await api.delete(`/admin/pricing/price-list/${id}`);
}

export const pricingAdminService = {
  getPricingRules,
  savePricingRules,
  getMOQRules,
  saveMOQRule,
  deleteMOQRule,
  getBulkDiscountTiers,
  saveBulkDiscountTier,
  deleteBulkDiscountTier,
  getPriceListAdmin,
  savePriceListItem,
  deletePriceListItem,
};
