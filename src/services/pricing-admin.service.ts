export interface PricingRule {
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

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

let pricingRules: PricingRule[] = [
  { categorySlug: "kitchen-household", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "kitchen-household", productSlug: "stock-pot-4-5l-24cm", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "mats-rugs", visibleToWholesale: true, visibleToDropship: false },
  { categorySlug: "mats-rugs", productSlug: "barrier-mats", visibleToWholesale: true, visibleToDropship: false },
  { categorySlug: "mats-rugs", productSlug: "shaggy-rugs", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "decoration-seasonal", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "decoration-seasonal", productSlug: "wax-burners", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "decoration-seasonal", productSlug: "christmas-candle-bridges", visibleToWholesale: true, visibleToDropship: false },
  { categorySlug: "garden-outdoor", visibleToWholesale: true, visibleToDropship: false },
  { categorySlug: "garden-outdoor", productSlug: "bamboo-fence-screening", visibleToWholesale: true, visibleToDropship: false },
  { categorySlug: "garden-outdoor", productSlug: "gazing-balls", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "toys-games", visibleToWholesale: true, visibleToDropship: true },
  { categorySlug: "toys-games", productSlug: "hula-hoops", visibleToWholesale: true, visibleToDropship: true },
];

let moqRules: MOQRuleAdmin[] = [
  { id: "moq-1", categorySlug: "kitchen-household", minQuantity: 12, unit: "units" },
  { id: "moq-2", categorySlug: "mats-rugs", minQuantity: 6, unit: "units" },
  { id: "moq-3", categorySlug: "mats-rugs", productSlug: "barrier-mats", minQuantity: 10, unit: "units" },
  { id: "moq-4", categorySlug: "decoration-seasonal", minQuantity: 6, unit: "units" },
  { id: "moq-5", categorySlug: "garden-outdoor", minQuantity: 5, unit: "units" },
  { id: "moq-6", categorySlug: "toys-games", minQuantity: 24, unit: "units" },
];

let bulkDiscountTiers: BulkDiscountTier[] = [
  { id: "tier-1", tierName: "Bronze", minQty: 50, maxQty: 99, discountPercent: 5 },
  { id: "tier-2", tierName: "Silver", minQty: 100, maxQty: 249, discountPercent: 10 },
  { id: "tier-3", tierName: "Gold", minQty: 250, maxQty: 499, discountPercent: 15 },
  { id: "tier-4", tierName: "Platinum", minQty: 500, maxQty: 9999, discountPercent: 20 },
];

async function getPricingRules(): Promise<PricingRule[]> {
  await delay();
  return [...pricingRules];
}

async function savePricingRules(rules: PricingRule[]): Promise<void> {
  await delay();
  pricingRules = [...rules];
}

async function getMOQRules(): Promise<MOQRuleAdmin[]> {
  await delay();
  return [...moqRules];
}

async function saveMOQRule(rule: MOQRuleAdmin): Promise<MOQRuleAdmin> {
  await delay();
  const idx = moqRules.findIndex((r) => r.id === rule.id);
  if (idx >= 0) {
    moqRules[idx] = rule;
  } else {
    rule.id = `moq-${Date.now()}`;
    moqRules.push(rule);
  }
  return rule;
}

async function deleteMOQRule(id: string): Promise<void> {
  await delay();
  moqRules = moqRules.filter((r) => r.id !== id);
}

async function getBulkDiscountTiers(): Promise<BulkDiscountTier[]> {
  await delay();
  return [...bulkDiscountTiers];
}

async function saveBulkDiscountTier(tier: BulkDiscountTier): Promise<BulkDiscountTier> {
  await delay();
  const idx = bulkDiscountTiers.findIndex((t) => t.id === tier.id);
  if (idx >= 0) {
    bulkDiscountTiers[idx] = tier;
  } else {
    tier.id = `tier-${Date.now()}`;
    bulkDiscountTiers.push(tier);
  }
  return tier;
}

async function deleteBulkDiscountTier(id: string): Promise<void> {
  await delay();
  bulkDiscountTiers = bulkDiscountTiers.filter((t) => t.id !== id);
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
