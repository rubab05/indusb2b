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

async function getPricingRules(): Promise<PricingRule[]> {
  return api.get<PricingRule[]>('/admin/pricing/rules');
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
  return api.get<MOQRuleAdmin[]>('/admin/pricing/moq');
}

async function saveMOQRule(rule: MOQRuleAdmin): Promise<MOQRuleAdmin> {
  if (rule.id && !rule.id.startsWith('moq-new')) {
    return api.put<MOQRuleAdmin>(`/admin/pricing/moq/${rule.id}`, rule);
  }
  return api.post<MOQRuleAdmin>('/admin/pricing/moq', rule);
}

async function deleteMOQRule(id: string): Promise<void> {
  await api.delete(`/admin/pricing/moq/${id}`);
}

async function getBulkDiscountTiers(): Promise<BulkDiscountTier[]> {
  return api.get<BulkDiscountTier[]>('/admin/pricing/tiers');
}

async function saveBulkDiscountTier(tier: BulkDiscountTier): Promise<BulkDiscountTier> {
  if (tier.id && !tier.id.startsWith('tier-new')) {
    return api.put<BulkDiscountTier>(`/admin/pricing/tiers/${tier.id}`, tier);
  }
  return api.post<BulkDiscountTier>('/admin/pricing/tiers', tier);
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
