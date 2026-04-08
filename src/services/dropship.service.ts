import {
  DropshipBalance,
  Transaction,
  TransactionType,
  TopUpRequest,
  BalanceThreshold,
  BalanceHistoryPoint,
} from '../types/commerce';
import { api } from '../lib/api-client';

interface TransactionFilters {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}

export const dropshipService = {
  async getBalance(): Promise<DropshipBalance> {
    return api.get<DropshipBalance>('/dropship/balance');
  },

  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const params: Record<string, string> = {};
    if (filters?.type) params.type = filters.type;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    return api.get<Transaction[]>('/dropship/transactions', params);
  },

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return api.get<Transaction[]>('/dropship/transactions/recent', { limit: String(limit) });
  },

  async submitTopUp(request: TopUpRequest): Promise<{ referenceNumber: string }> {
    return api.post<{ referenceNumber: string }>('/dropship/topup', request);
  },

  async getBalanceThreshold(): Promise<BalanceThreshold> {
    const balance = await api.get<DropshipBalance>('/dropship/balance');
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
    const txns = await api.get<Transaction[]>('/dropship/statement', { startDate, endDate });
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
