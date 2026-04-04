import { BulkDiscount, MOQRule, PriceListItem } from "../types/commerce";

export const PRICE_LIST: PriceListItem[] = [
  // Kitchen & Household
  { id: "p01", productName: "Stock Pot 4.5L 24cm", sku: "SP-4524-SS", category: "Kitchen & Household", moq: 12, unitPrice: 18.50, bulkTiers: [{ minQty: 24, pricePerUnit: 16.75, label: "24+" }, { minQty: 60, pricePerUnit: 14.90, label: "60+" }], stockStatus: "In Stock" },
  { id: "p02", productName: "Stock Pot 9L 28cm", sku: "SP-9028-SS", category: "Kitchen & Household", moq: 6, unitPrice: 24.50, bulkTiers: [{ minQty: 12, pricePerUnit: 22.00, label: "12+" }, { minQty: 36, pricePerUnit: 19.50, label: "36+" }], stockStatus: "In Stock" },
  // Mats & Rugs
  { id: "p03", productName: "Barrier Mat 40x60cm — Black", sku: "BM-4060-BK", category: "Mats & Rugs", moq: 24, unitPrice: 3.75, bulkTiers: [{ minQty: 48, pricePerUnit: 3.20, label: "48+" }, { minQty: 120, pricePerUnit: 2.80, label: "120+" }], stockStatus: "In Stock" },
  { id: "p04", productName: "Barrier Mat 60x90cm — Red", sku: "BM-6090-RD", category: "Mats & Rugs", moq: 24, unitPrice: 6.25, bulkTiers: [{ minQty: 48, pricePerUnit: 5.50, label: "48+" }], stockStatus: "In Stock" },
  { id: "p05", productName: "Barrier Mat 60x90cm — Black", sku: "BM-6090-BK", category: "Mats & Rugs", moq: 24, unitPrice: 6.25, bulkTiers: [{ minQty: 48, pricePerUnit: 5.50, label: "48+" }], stockStatus: "Low Stock" },
  { id: "p06", productName: "Shaggy Rug 80x150cm — Cream", sku: "SH-8015-CR", category: "Mats & Rugs", moq: 6, unitPrice: 16.00, bulkTiers: [{ minQty: 12, pricePerUnit: 13.50, label: "12+" }], stockStatus: "In Stock" },
  { id: "p07", productName: "Shaggy Rug 120x170cm — Grey", sku: "SH-1217-GY", category: "Mats & Rugs", moq: 4, unitPrice: 22.00, bulkTiers: [{ minQty: 10, pricePerUnit: 18.50, label: "10+" }], stockStatus: "In Stock" },
  { id: "p08", productName: "Chindi Rag Rug 60x90cm", sku: "CR-6090-MX", category: "Mats & Rugs", moq: 24, unitPrice: 4.95, bulkTiers: [{ minQty: 60, pricePerUnit: 4.10, label: "60+" }], stockStatus: "In Stock" },
  { id: "p09", productName: "Chindi Rag Rug 80x150cm", sku: "CR-8015-MX", category: "Mats & Rugs", moq: 12, unitPrice: 8.50, bulkTiers: [{ minQty: 30, pricePerUnit: 7.20, label: "30+" }], stockStatus: "In Stock" },
  { id: "p10", productName: "Hallway Runner Rug 60x240cm", sku: "HR-6024-BG", category: "Mats & Rugs", moq: 6, unitPrice: 14.50, bulkTiers: [{ minQty: 12, pricePerUnit: 12.50, label: "12+" }], stockStatus: "In Stock" },
  // Decoration & Seasonal
  { id: "p11", productName: "Wax Burner — Geometric White", sku: "WB-GEO-WH", category: "Decoration & Seasonal", moq: 24, unitPrice: 4.50, bulkTiers: [{ minQty: 48, pricePerUnit: 3.80, label: "48+" }, { minQty: 120, pricePerUnit: 3.20, label: "120+" }], stockStatus: "In Stock" },
  { id: "p12", productName: "Wax Burner — Round Ceramic", sku: "WB-RND-CR", category: "Decoration & Seasonal", moq: 24, unitPrice: 3.95, bulkTiers: [{ minQty: 60, pricePerUnit: 3.25, label: "60+" }], stockStatus: "In Stock" },
  { id: "p13", productName: "Artificial Christmas Tree 6ft", sku: "ACT-6FT-GN", category: "Decoration & Seasonal", moq: 6, unitPrice: 18.00, bulkTiers: [{ minQty: 15, pricePerUnit: 15.50, label: "15+" }], stockStatus: "Out of Stock" },
  { id: "p14", productName: "Pencil Slim Christmas Tree 5ft", sku: "PCT-5FT-GN", category: "Decoration & Seasonal", moq: 10, unitPrice: 14.00, bulkTiers: [{ minQty: 20, pricePerUnit: 12.00, label: "20+" }], stockStatus: "Out of Stock" },
  { id: "p15", productName: "Christmas Candle Bridge 7-arm", sku: "CCB-7A-NT", category: "Decoration & Seasonal", moq: 12, unitPrice: 7.25, bulkTiers: [{ minQty: 24, pricePerUnit: 6.25, label: "24+" }], stockStatus: "Out of Stock" },
  // Garden & Outdoor
  { id: "p16", productName: "Bamboo Fence Screening 1mx3m", sku: "BF-1x3-NT", category: "Garden & Outdoor", moq: 20, unitPrice: 9.75, bulkTiers: [{ minQty: 40, pricePerUnit: 8.50, label: "40+" }], stockStatus: "In Stock" },
  { id: "p17", productName: "Bamboo Fence Screening 1mx4m", sku: "BF-1x4-NT", category: "Garden & Outdoor", moq: 10, unitPrice: 12.50, bulkTiers: [{ minQty: 25, pricePerUnit: 10.75, label: "25+" }], stockStatus: "In Stock" },
  { id: "p18", productName: "Bamboo Canes 90cm (Bundle 10)", sku: "BC-90-B10", category: "Garden & Outdoor", moq: 24, unitPrice: 3.20, bulkTiers: [{ minQty: 60, pricePerUnit: 2.70, label: "60+" }], stockStatus: "In Stock" },
  { id: "p19", productName: "Green Garden Stakes 90cm (10pk)", sku: "GS-90-GN10", category: "Garden & Outdoor", moq: 24, unitPrice: 1.65, bulkTiers: [{ minQty: 60, pricePerUnit: 1.35, label: "60+" }], stockStatus: "In Stock" },
  { id: "p20", productName: "Wooden Garden Stakes 90cm (5pk)", sku: "WGS-90-5PK", category: "Garden & Outdoor", moq: 20, unitPrice: 2.50, bulkTiers: [{ minQty: 50, pricePerUnit: 2.10, label: "50+" }], stockStatus: "In Stock" },
  { id: "p21", productName: "Artificial Hedge Screening 1mx1m", sku: "AHS-1x1-GN", category: "Garden & Outdoor", moq: 20, unitPrice: 8.50, bulkTiers: [{ minQty: 40, pricePerUnit: 7.25, label: "40+" }], stockStatus: "Low Stock" },
  { id: "p22", productName: "Gazing Ball 20cm — Silver", sku: "GB-20-SL", category: "Garden & Outdoor", moq: 12, unitPrice: 5.75, bulkTiers: [{ minQty: 30, pricePerUnit: 4.90, label: "30+" }], stockStatus: "In Stock" },
  { id: "p23", productName: "Gazing Ball 30cm — Copper", sku: "GB-30-CU", category: "Garden & Outdoor", moq: 10, unitPrice: 9.50, bulkTiers: [{ minQty: 24, pricePerUnit: 8.25, label: "24+" }], stockStatus: "In Stock" },
  // Toys & Games
  { id: "p24", productName: "Hula Hoop 56cm — Assorted", sku: "HH-56-ASS", category: "Toys & Games", moq: 60, unitPrice: 0.95, bulkTiers: [{ minQty: 120, pricePerUnit: 0.80, label: "120+" }, { minQty: 300, pricePerUnit: 0.68, label: "300+" }], stockStatus: "In Stock" },
  { id: "p25", productName: "Hula Hoop 70cm — Assorted", sku: "HH-70-ASS", category: "Toys & Games", moq: 60, unitPrice: 1.15, bulkTiers: [{ minQty: 120, pricePerUnit: 0.99, label: "120+" }], stockStatus: "In Stock" },
];

export const MOQ_RULES: MOQRule[] = [
  { category: "Kitchen & Household", moq: 6, unit: "units per SKU", notes: "Mixed sizes permitted on same order" },
  { category: "Mats & Rugs", moq: 24, unit: "units per SKU", notes: "Lower MOQ applies to larger sizes (120x170cm+)" },
  { category: "Decoration & Seasonal", moq: 12, unit: "units per SKU", notes: "Seasonal lines may have higher MOQ during peak" },
  { category: "Garden & Outdoor", moq: 10, unit: "units per SKU", notes: "Bamboo products: MOQ is per bundle/pack, not per cane" },
  { category: "Toys & Games", moq: 60, unit: "units per SKU", notes: "High-volume items — speak to your account manager for break-bulk" },
];

export const BULK_DISCOUNTS: BulkDiscount[] = [
  { tierLabel: "Standard", minSpend: "£0", discountPercent: 0 },
  { tierLabel: "Bronze", minSpend: "£500", discountPercent: 5 },
  { tierLabel: "Silver", minSpend: "£1,500", discountPercent: 8 },
  { tierLabel: "Gold", minSpend: "£3,000", discountPercent: 12 },
];

export const CATEGORIES = [...new Set(PRICE_LIST.map((p) => p.category))].sort();

export const pricingService = {
  async getPriceList(): Promise<PriceListItem[]> {
    await new Promise((r) => setTimeout(r, 400));
    return PRICE_LIST;
  },

  async getBySkus(skus: string[]): Promise<PriceListItem[]> {
    await new Promise((r) => setTimeout(r, 300));
    const upper = skus.map((s) => s.toUpperCase());
    return PRICE_LIST.filter((p) => upper.includes(p.sku.toUpperCase()));
  },
};
