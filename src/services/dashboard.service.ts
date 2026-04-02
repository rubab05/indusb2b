import { AccountType } from "../types/auth";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

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

const MOCK_ORDERS: RecentOrder[] = [
  { id: "ord-001", orderNumber: "ORD-2026-0041", date: "28 Mar 2026", items: 4, total: "£1,240.00", status: "Shipped" },
  { id: "ord-002", orderNumber: "ORD-2026-0038", date: "24 Mar 2026", items: 2, total: "£620.00", status: "Delivered" },
  { id: "ord-003", orderNumber: "ORD-2026-0031", date: "18 Mar 2026", items: 7, total: "£2,890.00", status: "Delivered" },
  { id: "ord-004", orderNumber: "ORD-2026-0029", date: "15 Mar 2026", items: 1, total: "£310.00", status: "Cancelled" },
  { id: "ord-005", orderNumber: "ORD-2026-0022", date: "10 Mar 2026", items: 5, total: "£1,750.00", status: "Delivered" },
];

export const dashboardService = {
  async getData(accountType: AccountType): Promise<DashboardData> {
    await new Promise((r) => setTimeout(r, 400));

    return {
      stats: {
        recentOrdersCount: 12,
        pendingOrdersCount: 1,
        openSupportTickets: 0,
      },
      recentOrders: MOCK_ORDERS,
      accountInfo: {
        type: accountType,
        tier: accountType === AccountType.WHOLESALE ? "Standard Wholesale" : "Standard Dropship",
        approvalDate: "1 Jan 2026",
      },
    };
  },
};
