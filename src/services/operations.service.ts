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

// ─── Raw backend shapes ───────────────────────────────────────────────────────

interface RawOpsOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: string | number;
  assignedTo?: string | null;
  internalNotes?: unknown;
  createdAt: string;
  updatedAt: string;
  user?: { id?: string; companyName?: string; accountType?: string };
  items?: Array<{ productName?: string; sku?: string; quantity?: number; name?: string; qty?: number }>;
  timeline?: Array<{ status: string; date: string; userId?: string | null }>;
}

interface RawReturn {
  id: string;
  returnNumber: string;
  orderId: string;
  partnerName: string;
  reason: string;
  description: string;
  status: string;
  resolutionType?: string | null;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: Array<{ authorName: string; body: string; createdAt: string }>;
  order?: { orderNumber?: string };
}

interface RawActivityLog {
  id: string;
  userId?: string | null;
  userName: string;
  actionType: string;
  description: string;
  entityType?: string | null;
  entityId?: string | null;
  createdAt: string;
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeOpsOrder(raw: RawOpsOrder): OperationalOrder {
  const internalNotesRaw = Array.isArray(raw.internalNotes) ? raw.internalNotes : [];
  const internalNotes = (internalNotesRaw as Array<Record<string, unknown>>).map((n) => ({
    text: String(n.text ?? n.body ?? ''),
    user: String(n.user ?? n.authorName ?? ''),
    date: String(n.date ?? n.createdAt ?? ''),
  }));

  const statusHistory = (raw.timeline ?? []).map((t) => ({
    status: t.status,
    date: t.date,
    user: t.userId ?? '',
  }));

  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    partnerName: raw.user?.companyName ?? '',
    partnerType: (raw.user?.accountType as 'WHOLESALE' | 'DROPSHIP') ?? 'WHOLESALE',
    items: (raw.items ?? []).map((i) => ({
      name: i.productName ?? i.name ?? '',
      qty: i.quantity ?? i.qty ?? 0,
      sku: i.sku ?? '',
    })),
    total: typeof raw.total === 'number' ? raw.total : parseFloat(raw.total) || 0,
    status: raw.status as OpsOrderStatus,
    assignedTo: raw.assignedTo ?? null,
    internalNotes,
    createdDate: raw.createdAt,
    updatedDate: raw.updatedAt,
    statusHistory,
  };
}

function normalizeReturn(raw: RawReturn): ReturnRequest {
  const internalNotes = (raw.notes ?? []).map((n) => ({
    text: n.body,
    user: n.authorName,
    date: n.createdAt,
  }));

  const resolution =
    raw.resolutionType
      ? {
          type: raw.resolutionType as ResolutionType,
          notes: raw.resolutionNotes ?? '',
          date: raw.resolvedAt ?? raw.updatedAt,
        }
      : undefined;

  return {
    id: raw.id,
    returnNumber: raw.returnNumber,
    orderId: raw.orderId,
    orderNumber: raw.order?.orderNumber ?? raw.orderId,
    partnerName: raw.partnerName,
    reason: raw.reason as ReturnReason,
    description: raw.description,
    status: raw.status as ReturnStatus,
    resolution,
    internalNotes,
    createdDate: raw.createdAt,
    updatedDate: raw.updatedAt,
  };
}

function normalizeActivityLog(raw: RawActivityLog): ActivityLogEntry {
  return {
    id: raw.id,
    timestamp: raw.createdAt,
    userId: raw.userId ?? '',
    userName: raw.userName,
    actionType: raw.actionType as ActivityActionType,
    description: raw.description,
    entityType: raw.entityType ?? undefined,
    entityId: raw.entityId ?? undefined,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const operationsService = {
  async getOperationalOrders(filters?: OpsOrderFilters): Promise<OperationalOrder[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    const raw = await api.get<RawOpsOrder[]>('/admin/operations/orders', params);
    return raw.map(normalizeOpsOrder);
  },

  async getOperationalOrderById(id: string): Promise<OperationalOrder | null> {
    const raw = await api.get<RawOpsOrder>(`/admin/operations/orders/${id}`);
    return raw ? normalizeOpsOrder(raw) : null;
  },

  async updateOrderStatus(
    id: string,
    status: OpsOrderStatus,
    notes?: string,
  ): Promise<OperationalOrder | null> {
    const raw = await api.patch<RawOpsOrder>(`/admin/operations/orders/${id}/status`, { status, notes });
    return raw ? normalizeOpsOrder(raw) : null;
  },

  async assignOrder(id: string, assignee: string | null): Promise<OperationalOrder | null> {
    const raw = await api.patch<RawOpsOrder>(`/admin/operations/orders/${id}/assign`, {
      assignedTo: assignee,
    });
    return raw ? normalizeOpsOrder(raw) : null;
  },

  async addInternalNote(id: string, note: string): Promise<OperationalOrder | null> {
    const raw = await api.post<RawOpsOrder>(`/admin/operations/orders/${id}/notes`, { note });
    return raw ? normalizeOpsOrder(raw) : null;
  },

  async bulkUpdateStatus(ids: string[], status: OpsOrderStatus): Promise<OperationalOrder[]> {
    const raw = await api.post<RawOpsOrder[]>('/admin/operations/orders/bulk-status', { ids, status });
    return raw.map(normalizeOpsOrder);
  },

  async getReturns(filters?: ReturnFilters): Promise<ReturnRequest[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    const raw = await api.get<RawReturn[]>('/admin/operations/returns', params);
    return raw.map(normalizeReturn);
  },

  async getReturnById(id: string): Promise<ReturnRequest | null> {
    const raw = await api.get<RawReturn>(`/admin/operations/returns/${id}`);
    return raw ? normalizeReturn(raw) : null;
  },

  async createReturn(data: {
    orderNumber: string;
    partnerName: string;
    reason: ReturnReason;
    description: string;
  }): Promise<ReturnRequest> {
    const raw = await api.post<RawReturn>('/admin/operations/returns', data);
    return normalizeReturn(raw);
  },

  async updateReturnStatus(
    id: string,
    status: ReturnStatus,
    resolution?: { type: ResolutionType; notes: string },
  ): Promise<ReturnRequest | null> {
    const raw = await api.patch<RawReturn>(`/admin/operations/returns/${id}/status`, {
      status,
      resolution,
    });
    return raw ? normalizeReturn(raw) : null;
  },

  async addReturnNote(id: string, note: string): Promise<ReturnRequest | null> {
    const raw = await api.post<RawReturn>(`/admin/operations/returns/${id}/notes`, { note });
    return raw ? normalizeReturn(raw) : null;
  },

  async getActivityLog(filters?: ActivityLogFilters): Promise<ActivityLogEntry[]> {
    const params: Record<string, string> = {};
    if (filters?.actionType) params.actionType = filters.actionType;
    if (filters?.userName) params.userId = filters.userName;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    const raw = await api.get<RawActivityLog[]>('/admin/operations/logs', params);
    return raw.map(normalizeActivityLog);
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
