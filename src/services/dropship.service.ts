import {
  DropshipBalance,
  Transaction,
  TransactionType,
  TopUpRequest,
  BalanceThreshold,
  BalanceHistoryPoint,
} from "../types/commerce";

const THRESHOLD: BalanceThreshold = {
  warningLevel: 100,
  lockLevel: 50,
  currency: "GBP",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx-001", date: "2026-04-05", type: "order", reference: "ORD-2026-0099", description: "Order — Barrier Mat 40x60cm x48", amount: -180.0, runningBalance: 452.30 },
  { id: "tx-002", date: "2026-04-03", type: "top-up", reference: "TU-2026-0018", description: "Bank transfer top-up", amount: 250.0, runningBalance: 632.30 },
  { id: "tx-003", date: "2026-04-01", type: "order", reference: "ORD-2026-0095", description: "Order — Wax Burner Geometric x24", amount: -108.0, runningBalance: 382.30 },
  { id: "tx-004", date: "2026-03-30", type: "order", reference: "ORD-2026-0091", description: "Order — Shaggy Rug 120x170 x6", amount: -132.0, runningBalance: 490.30 },
  { id: "tx-005", date: "2026-03-28", type: "refund", reference: "REF-2026-0004", description: "Refund — damaged Hula Hoops x10", amount: 11.50, runningBalance: 622.30 },
  { id: "tx-006", date: "2026-03-25", type: "order", reference: "ORD-2026-0087", description: "Order — Bamboo Fence 1mx4m x10", amount: -125.0, runningBalance: 610.80 },
  { id: "tx-007", date: "2026-03-22", type: "top-up", reference: "TU-2026-0017", description: "Bank transfer top-up", amount: 500.0, runningBalance: 735.80 },
  { id: "tx-008", date: "2026-03-20", type: "order", reference: "ORD-2026-0083", description: "Order — Gazing Ball 20cm Silver x15", amount: -86.25, runningBalance: 235.80 },
  { id: "tx-009", date: "2026-03-18", type: "order", reference: "ORD-2026-0079", description: "Order — Christmas Candle Bridge x12", amount: -87.0, runningBalance: 322.05 },
  { id: "tx-010", date: "2026-03-15", type: "adjustment", reference: "ADJ-2026-0002", description: "Credit adjustment — loyalty bonus", amount: 25.0, runningBalance: 409.05 },
  { id: "tx-011", date: "2026-03-12", type: "order", reference: "ORD-2026-0074", description: "Order — Chindi Rag Rug 60x90 x18", amount: -89.10, runningBalance: 384.05 },
  { id: "tx-012", date: "2026-03-10", type: "top-up", reference: "TU-2026-0016", description: "Bank transfer top-up", amount: 300.0, runningBalance: 473.15 },
  { id: "tx-013", date: "2026-03-07", type: "order", reference: "ORD-2026-0070", description: "Order — Hallway Runner Rug x6", amount: -87.0, runningBalance: 173.15 },
  { id: "tx-014", date: "2026-03-04", type: "order", reference: "ORD-2026-0066", description: "Order — Stock Pot 4.5L x6", amount: -111.0, runningBalance: 260.15 },
  { id: "tx-015", date: "2026-03-01", type: "refund", reference: "REF-2026-0003", description: "Refund — wrong item shipped", amount: 24.5, runningBalance: 371.15 },
  { id: "tx-016", date: "2026-02-26", type: "order", reference: "ORD-2026-0061", description: "Order — Artificial Hedge 1mx1m x10", amount: -85.0, runningBalance: 346.65 },
  { id: "tx-017", date: "2026-02-22", type: "top-up", reference: "TU-2026-0015", description: "Bank transfer top-up", amount: 250.0, runningBalance: 431.65 },
  { id: "tx-018", date: "2026-02-18", type: "order", reference: "ORD-2026-0055", description: "Order — Green Garden Stakes x40", amount: -66.0, runningBalance: 181.65 },
];

interface TransactionFilters {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const dropshipService = {
  async getBalance(): Promise<DropshipBalance> {
    await delay(300);
    const latest = MOCK_TRANSACTIONS[0];
    return {
      currentBalance: latest.runningBalance,
      currency: "GBP",
      threshold: THRESHOLD.lockLevel,
      isLocked: latest.runningBalance < THRESHOLD.lockLevel,
      lastUpdated: latest.date,
    };
  },

  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    await delay(400);
    let result = [...MOCK_TRANSACTIONS];
    if (filters?.type) {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters?.startDate) {
      result = result.filter((t) => t.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      result = result.filter((t) => t.date <= filters.endDate!);
    }
    return result;
  },

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    await delay(300);
    return MOCK_TRANSACTIONS.slice(0, limit);
  },

  async submitTopUp(request: TopUpRequest): Promise<{ referenceNumber: string }> {
    await delay(500);
    const ref = `TU-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    console.info(`[mock] Top-up submitted: £${request.amount} via ${request.method}, ref: ${ref}`);
    return { referenceNumber: ref };
  },

  async getBalanceThreshold(): Promise<BalanceThreshold> {
    await delay(200);
    return THRESHOLD;
  },

  async getBalanceHistory(days: number = 30): Promise<BalanceHistoryPoint[]> {
    await delay(400);
    const points: BalanceHistoryPoint[] = [];
    const now = new Date("2026-04-06");
    let balance = 452.30;

    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split("T")[0];

      // Simulate variance
      const change = (Math.random() - 0.45) * 60;
      balance = Math.max(30, Math.min(800, balance + change));
      points.push({ date: dateStr, balance: Math.round(balance * 100) / 100 });
    }
    // Ensure last point matches current balance
    points[points.length - 1].balance = 452.30;
    return points;
  },

  async getStatementSummary(startDate: string, endDate: string): Promise<{
    transactionCount: number;
    totalCredits: number;
    totalDebits: number;
    netChange: number;
  }> {
    await delay(300);
    const txns = MOCK_TRANSACTIONS.filter((t) => t.date >= startDate && t.date <= endDate);
    const totalCredits = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalDebits = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    return {
      transactionCount: txns.length,
      totalCredits: Math.round(totalCredits * 100) / 100,
      totalDebits: Math.round(totalDebits * 100) / 100,
      netChange: Math.round((totalCredits - totalDebits) * 100) / 100,
    };
  },
};
