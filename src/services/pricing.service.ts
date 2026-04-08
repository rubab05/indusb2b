import { BulkDiscount, MOQRule, PriceListItem } from '../types/commerce';
import { api } from '../lib/api-client';

// Static category list — used for synchronous UI filters
export const CATEGORIES = [
  'Kitchen & Household',
  'Mats & Rugs',
  'Decoration & Seasonal',
  'Garden & Outdoor',
  'Toys & Games',
].sort();

// Static fallback data for synchronous consumption in MOQInfoPage
export const MOQ_RULES: MOQRule[] = [
  { category: 'Kitchen & Household', moq: 6, unit: 'units per SKU', notes: 'Mixed sizes permitted on same order' },
  { category: 'Mats & Rugs', moq: 24, unit: 'units per SKU', notes: 'Lower MOQ applies to larger sizes (120x170cm+)' },
  { category: 'Decoration & Seasonal', moq: 12, unit: 'units per SKU', notes: 'Seasonal lines may have higher MOQ during peak' },
  { category: 'Garden & Outdoor', moq: 10, unit: 'units per SKU', notes: 'Bamboo products: MOQ is per bundle/pack, not per cane' },
  { category: 'Toys & Games', moq: 60, unit: 'units per SKU', notes: 'High-volume items — speak to your account manager for break-bulk' },
];

export const BULK_DISCOUNTS: BulkDiscount[] = [
  { tierLabel: 'Standard', minSpend: '£0', discountPercent: 0 },
  { tierLabel: 'Bronze', minSpend: '£500', discountPercent: 5 },
  { tierLabel: 'Silver', minSpend: '£1,500', discountPercent: 8 },
  { tierLabel: 'Gold', minSpend: '£3,000', discountPercent: 12 },
];

export const pricingService = {
  async getPriceList(): Promise<PriceListItem[]> {
    return api.get<PriceListItem[]>('/pricing/price-list');
  },

  async getBySkus(skus: string[]): Promise<PriceListItem[]> {
    const all = await api.get<PriceListItem[]>('/pricing/price-list');
    const upper = skus.map((s) => s.toUpperCase());
    return all.filter((p) => upper.includes(p.sku.toUpperCase()));
  },

  async getMOQRules(): Promise<MOQRule[]> {
    return api.get<MOQRule[]>('/pricing/moq-rules');
  },

  async getBulkDiscounts(): Promise<BulkDiscount[]> {
    return api.get<BulkDiscount[]>('/pricing/bulk-discounts');
  },
};
