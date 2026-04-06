export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface BulkTier {
  minQty: number;
  pricePerUnit: number;
  label: string;
}

export interface PriceListItem {
  id: string;
  productName: string;
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

export interface QuoteRequest {
  id: string;
  referenceNumber: string;
  lines: Array<{ productName: string; sku: string; qty: number }>;
  specialRequirements: string;
  submittedDate: string;
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

export interface BalanceThreshold {
  warningLevel: number;
  lockLevel: number;
  currency: string;
}

export interface BalanceHistoryPoint {
  date: string;
  balance: number;
}
