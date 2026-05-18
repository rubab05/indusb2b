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

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

// function normalizePriceListItem(item: any): PriceListItem {
//   return {
//     ...item,
//     moq: toNumber(item.moq),
//     unitPrice: toNumber(item.unitPrice),
//     bulkTiers: Array.isArray(item.bulkTiers)
//       ? item.bulkTiers.map((tier: any) => ({
//           ...tier,
//           minQty: toNumber(tier.minQty),
//           pricePerUnit: toNumber(tier.pricePerUnit),
//         }))
//       : [],
//   };
// }

function normalizePriceListItem(item: any): PriceListItem {
  return {
    id: item.id,
    productFamilyId: item.productFamilyId ?? item.productFamily?.id ?? '',
    productSlug: item.productSlug ?? item.productFamily?.slug ?? '',
    productName: item.productName ?? item.productFamily?.name ?? '',
    sku: item.sku ?? item.productFamily?.sku ?? item.productSlug ?? item.productFamily?.slug ?? '',
    category: item.category ?? item.productFamily?.category?.name ?? '',
    moq: toNumber(item.moq),
    unitPrice: toNumber(item.unitPrice),
    stockStatus: item.stockStatus,
    bulkTiers: Array.isArray(item.bulkTiers)
      ? item.bulkTiers.map((tier: any) => ({
          label: tier.label ?? '',
          minQty: toNumber(tier.minQty),
          pricePerUnit: toNumber(tier.pricePerUnit),
        }))
      : [],
  };
}

export const pricingService = {
  async getPriceList(): Promise<PriceListItem[]> {
    const data = await api.get<any[]>('/pricing/price-list');
    return Array.isArray(data) ? data.map(normalizePriceListItem) : [];
  },

  async getBySkus(skus: string[]): Promise<PriceListItem[]> {
    const all = await api.get<PriceListItem[]>('/pricing/price-list');
    const upper = skus.map((s) => s.toUpperCase());
    return all.filter((p) => upper.includes(p.sku.toUpperCase()));
  },

  async getMOQRules(): Promise<MOQRule[]> {
    try {
      const data = await api.get<any[]>('/pricing/moq-rules');
      if (!Array.isArray(data) || data.length === 0) return MOQ_RULES;
      return data.map((rule: any) => ({
        category:
          rule.category !== null && typeof rule.category === 'object'
            ? (rule.category.name ?? '')
            : (rule.category ?? ''),
        moq: toNumber(rule.moq ?? rule.minQuantity),
        unit: rule.unit ?? 'units',
        notes: rule.notes ?? '',
      }));
    } catch {
      return MOQ_RULES;
    }
  },

  async getBulkDiscounts(): Promise<BulkDiscount[]> {
    try {
      const data = await api.get<any[]>('/pricing/bulk-discounts');
      if (!Array.isArray(data) || data.length === 0) return BULK_DISCOUNTS;
      return data.map((tier: any) => ({
        tierLabel: tier.tierLabel ?? tier.tierName ?? '',
        minSpend: tier.minSpend ?? (tier.minQty != null ? `£${tier.minQty}` : '£0'),
        discountPercent: toNumber(tier.discountPercent),
      }));
    } catch {
      return BULK_DISCOUNTS;
    }
  },
};
