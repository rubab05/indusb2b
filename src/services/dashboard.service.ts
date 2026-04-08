import { AccountType } from '../types/auth';
import { api } from '../lib/api-client';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: number;
  total: string;
  status: OrderStatus;
}

export interface DashboardStats {
  recentOrdersCount: number;
  pendingOrdersCount: number;
  openSupportTickets: number;
}

export interface AccountInfo {
  type: AccountType;
  tier: string;
  approvalDate: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  accountInfo: AccountInfo;
}

interface ApiOrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
}

interface ApiTicket {
  id: string;
  status: string;
}

export const dashboardService = {
  async getData(accountType: AccountType): Promise<DashboardData> {
    const [orders, tickets] = await Promise.all([
      api.get<ApiOrderSummary[]>('/orders'),
      api.get<ApiTicket[]>('/support'),
    ]);

    const recentOrders: RecentOrder[] = orders.slice(0, 5).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: o.date,
      items: o.itemCount,
      total: `£${o.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      status: o.status,
    }));

    const pendingCount = orders.filter((o) => o.status === 'Pending').length;
    const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'InProgress').length;

    return {
      stats: {
        recentOrdersCount: orders.length,
        pendingOrdersCount: pendingCount,
        openSupportTickets: openTickets,
      },
      recentOrders,
      accountInfo: {
        type: accountType,
        tier: accountType === AccountType.WHOLESALE ? 'Standard Wholesale' : 'Standard Dropship',
        approvalDate: '',
      },
    };
  },
};
