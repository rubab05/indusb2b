import { AccountType } from '../types/auth';
import { api } from '../lib/api-client';

export type OrderStatus = 'Pending' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

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

// Mapping from backend uppercase status to display-friendly status
const STATUS_MAP: Record<string, OrderStatus> = {
  NEW: 'Pending',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

interface ApiRawOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  items?: { id: string }[];
  total: string | number;
  status: string;
}

interface ApiRawTicket {
  id: string;
  status: string;
}

export const dashboardService = {
  async getData(accountType: AccountType): Promise<DashboardData> {
    const [orders, tickets] = await Promise.all([
      api.get<ApiRawOrder[]>('/orders'),
      api.get<ApiRawTicket[]>('/support'),
    ]);

    const recentOrders: RecentOrder[] = orders.slice(0, 5).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: o.createdAt,
      items: o.items?.length ?? 0,
      total: `£${parseFloat(String(o.total)).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      status: STATUS_MAP[o.status] ?? 'Pending',
    }));

    const pendingCount = orders.filter((o) => o.status === 'NEW' || o.status === 'PROCESSING').length;
    const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

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