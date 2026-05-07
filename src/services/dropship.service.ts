import {
  DropshipBalance,
  Transaction,
  TransactionType,
  TopUpRequest,
  TopUpRequestRecord,
  BalanceThreshold,
  BalanceHistoryPoint,
} from '../types/commerce';
import { api } from '../lib/api-client';

interface TransactionFilters {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}

interface RawTopUpRequest {
  id: string;
  amount: string | number;
  method: string;
  reference: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeTopUpRequest(raw: RawTopUpRequest): TopUpRequestRecord {
  return {
    id: raw.id,
    amount: toNum(raw.amount),
    method: raw.method as TopUpRequestRecord['method'],
    referenceNumber: raw.reference,
    status: raw.status as TopUpRequestRecord['status'],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// Raw backend shapes
interface RawBalance {
  currentBalance: string | number;
  currency: string;
  threshold: string | number;
  isLocked: boolean;
  updatedAt?: string;
}

interface RawTransaction {
  id: string;
  type: string;
  reference: string;
  description: string;
  amount: string | number;
  runningBalance: string | number;
  createdAt: string;
}

function toNum(v: string | number | undefined | null): number {
  if (v === undefined || v === null) return 0;
  return typeof v === 'number' ? v : parseFloat(v) || 0;
}

function normalizeBalance(raw: RawBalance): DropshipBalance {
  return {
    currentBalance: toNum(raw.currentBalance),
    currency: raw.currency,
    threshold: toNum(raw.threshold),
    isLocked: raw.isLocked,
    lastUpdated: raw.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeTransaction(raw: RawTransaction): Transaction {
  return {
    id: raw.id,
    date: raw.createdAt,
    type: raw.type as TransactionType,
    reference: raw.reference,
    description: raw.description,
    amount: toNum(raw.amount),
    runningBalance: toNum(raw.runningBalance),
  };
}

export const dropshipService = {
  async getBalance(): Promise<DropshipBalance> {
    const raw = await api.get<RawBalance>('/dropship/balance');
    return normalizeBalance(raw);
  },

  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const params: Record<string, string> = { limit: '200' };
    if (filters?.type) params.type = filters.type;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    const raw = await api.get<RawTransaction[]>('/dropship/transactions', params);
    return raw.map(normalizeTransaction);
  },

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const raw = await api.get<RawTransaction[]>('/dropship/transactions/recent', { limit: String(limit) });
    return raw.map(normalizeTransaction);
  },

  async submitTopUp(request: TopUpRequest): Promise<{ referenceNumber: string }> {
    const raw = await api.post<{ referenceNumber: string }>('/dropship/topup', request);
    return raw;
  },

  async getTopUpRequests(): Promise<TopUpRequestRecord[]> {
    const raw = await api.get<RawTopUpRequest[]>('/dropship/topups', { limit: '100' });
    return raw.map(normalizeTopUpRequest);
  },

  async getBalanceThreshold(): Promise<BalanceThreshold> {
    const raw = await api.get<RawBalance>('/dropship/balance');
    const balance = normalizeBalance(raw);
    return {
      warningLevel: balance.threshold * 2,
      lockLevel: balance.threshold,
      currency: balance.currency,
    };
  },

  async getBalanceHistory(days: number = 30): Promise<BalanceHistoryPoint[]> {
    return api.get<BalanceHistoryPoint[]>('/dropship/balance-history', { days: String(days) });
  },

  async getStatementSummary(
    startDate: string,
    endDate: string,
  ): Promise<{
    transactionCount: number;
    totalCredits: number;
    totalDebits: number;
    netChange: number;
  }> {
    const raw = await api.get<RawTransaction[]>('/dropship/statement', { startDate, endDate });
    const txns = raw.map(normalizeTransaction);
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