import { api } from '../lib/api-client';

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

export const pricingAdminService = {
  getPricingRules,
  savePricingRules,
  getMOQRules,
  saveMOQRule,
  deleteMOQRule,
  getBulkDiscountTiers,
  saveBulkDiscountTier,
  deleteBulkDiscountTier,
};
