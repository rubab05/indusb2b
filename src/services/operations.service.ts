import { api } from '../lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OpsOrderStatus = 'NEW' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED';

export interface OperationalOrder {
  id: string;
  orderNumber: string;
  partnerName: string;
  partnerType: 'WHOLESALE' | 'DROPSHIP';
  items: { name: string; qty: number; sku: string }[];
  total: number;
  status: OpsOrderStatus;
  assignedTo: string | null;
  internalNotes: { text: string; user: string; date: string }[];
  createdDate: string;
  updatedDate: string;
  statusHistory: { status: string; date: string; user: string }[];
}

export type ReturnStatus = 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED';
export type ResolutionType = 'REFUND' | 'REPLACEMENT' | 'CREDIT' | 'REJECTED';
export type ReturnReason = 'DAMAGED' | 'WRONG_ITEM' | 'MISSING_ITEM' | 'QUALITY_ISSUE' | 'OTHER';

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  partnerName: string;
  reason: ReturnReason;
  description: string;
  status: ReturnStatus;
  resolution?: { type: ResolutionType; notes: string; date: string };
  internalNotes: { text: string; user: string; date: string }[];
  createdDate: string;
  updatedDate: string;
}

export type ActivityActionType =
  | 'ORDER_UPDATE'
  | 'APPROVAL'
  | 'CONTENT_EDIT'
  | 'PRICING_CHANGE'
  | 'RETURN'
  | 'LOGIN';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  actionType: ActivityActionType;
  description: string;
  entityType?: string;
  entityId?: string;
}

export interface OpsStats {
  pendingFulfilment: number;
  avgFulfilmentDays: number;
  openSupportTickets: number;
  overdueSupportTickets: number;
  ordersByStatus: { status: string; count: number }[];
}

interface OpsOrderFilters {
  status?: OpsOrderStatus;
  search?: string;
}

interface ReturnFilters {
  status?: ReturnStatus;
}

interface ActivityLogFilters {
  actionType?: ActivityActionType;
  userName?: string;
  startDate?: string;
  endDate?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const operationsService = {
  async getOperationalOrders(filters?: OpsOrderFilters): Promise<OperationalOrder[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    return api.get<OperationalOrder[]>('/admin/operations/orders', params);
  },

  async getOperationalOrderById(id: string): Promise<OperationalOrder | null> {
    return api.get<OperationalOrder>(`/admin/operations/orders/${id}`);
  },

  async updateOrderStatus(
    id: string,
    status: OpsOrderStatus,
    notes?: string,
  ): Promise<OperationalOrder | null> {
    return api.patch<OperationalOrder>(`/admin/operations/orders/${id}/status`, { status, notes });
  },

  async assignOrder(id: string, assignee: string | null): Promise<OperationalOrder | null> {
    return api.patch<OperationalOrder>(`/admin/operations/orders/${id}/assign`, {
      assignedTo: assignee,
    });
  },

  async addInternalNote(id: string, note: string): Promise<OperationalOrder | null> {
    return api.post<OperationalOrder>(`/admin/operations/orders/${id}/notes`, { note });
  },

  async bulkUpdateStatus(ids: string[], status: OpsOrderStatus): Promise<OperationalOrder[]> {
    return api.post<OperationalOrder[]>('/admin/operations/orders/bulk-status', { ids, status });
  },

  async getReturns(filters?: ReturnFilters): Promise<ReturnRequest[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    return api.get<ReturnRequest[]>('/admin/operations/returns', params);
  },

  async getReturnById(id: string): Promise<ReturnRequest | null> {
    return api.get<ReturnRequest>(`/admin/operations/returns/${id}`);
  },

  async createReturn(data: {
    orderNumber: string;
    partnerName: string;
    reason: ReturnReason;
    description: string;
  }): Promise<ReturnRequest> {
    return api.post<ReturnRequest>('/admin/operations/returns', data);
  },

  async updateReturnStatus(
    id: string,
    status: ReturnStatus,
    resolution?: { type: ResolutionType; notes: string },
  ): Promise<ReturnRequest | null> {
    return api.patch<ReturnRequest>(`/admin/operations/returns/${id}/status`, {
      status,
      resolution,
    });
  },

  async addReturnNote(id: string, note: string): Promise<ReturnRequest | null> {
    return api.post<ReturnRequest>(`/admin/operations/returns/${id}/notes`, { note });
  },

  async getActivityLog(filters?: ActivityLogFilters): Promise<ActivityLogEntry[]> {
    const params: Record<string, string> = {};
    if (filters?.actionType) params.actionType = filters.actionType;
    if (filters?.userName) params.userId = filters.userName;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    return api.get<ActivityLogEntry[]>('/admin/operations/logs', params);
  },

  async exportActivityLogCSV(filters?: ActivityLogFilters): Promise<string> {
    const blob = await api.downloadBlob(
      `/admin/operations/logs/export${buildQuery(filters as Record<string, string | undefined>)}`,
    );
    return blob.text();
  },

  async getOpsStats(): Promise<OpsStats> {
    return api.get<OpsStats>('/admin/operations/stats');
  },
};

function buildQuery(params?: Record<string, string | undefined>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][];
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}
