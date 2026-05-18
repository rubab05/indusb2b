export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface BulkTier {
  minQty: number;
  pricePerUnit: number;
  label: string;
}

export interface PriceListItem {
  id: string;
  productFamilyId: string;
  productName: string;
  productSlug: string;
  sku: string;
  category: string;
  moq: number;
  unitPrice: number;
  bulkTiers: BulkTier[];
  stockStatus: StockStatus;
}

export interface MOQRule {
  category: string;
  moq: number;
  unit: string;
  notes: string;
}

export interface BulkDiscount {
  tierLabel: string;
  minSpend: string;
  discountPercent: number;
}

export interface OrderLineInput {
  item: PriceListItem;
  qty: number;
}

export type QuoteStatus = 'pending' | 'responded';

export interface QuoteRequest {
  id: string;
  referenceNumber: string;
  userId: string;
  lines: Array<{ productName?: string; sku: string; quantity?: number; qty?: number }>;
  specialRequirements: string | null;
  status: QuoteStatus;
  adminResponse: string | null;
  respondedAt: string | null;
  respondedBy: string | null;
  createdAt: string;
}

export interface AdminQuoteRequest extends QuoteRequest {
  partner: { id: string; email: string; companyName: string } | null;
}

export interface DropshipBalance {
  currentBalance: number;
  currency: string;
  threshold: number;
  isLocked: boolean;
  lastUpdated: string;
}

export type TransactionType = "top-up" | "order" | "refund" | "adjustment";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  reference: string;
  description: string;
  amount: number;
  runningBalance: number;
}

export interface TopUpRequest {
  amount: number;
  method: "bank-transfer" | "card";
  reference?: string;
}

export type TopUpStatus = "pending" | "confirmed" | "failed";

export interface TopUpRequestRecord {
  id: string;
  amount: number;
  method: "bank-transfer" | "card";
  referenceNumber: string | null;
  status: TopUpStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceThreshold {
  warningLevel: number;
  lockLevel: number;
  currency: string;
}

export interface BalanceHistoryPoint {
  date: string;
  balance: number;
}
