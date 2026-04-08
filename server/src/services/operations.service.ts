import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import { logActivity } from './admin.service.js';
import type {
  UpdateOrderStatusInput,
  AssignOrderInput,
  AddOrderNoteInput,
  BulkUpdateOrderStatusInput,
  CreateReturnInput,
  UpdateReturnStatusInput,
  AddReturnNoteInput,
  ActivityLogFilterInput,
  AssignTicketInput,
  AddTicketInternalNoteInput,
  SetTicketPriorityInput,
  AdminReplyTicketInput,
} from '../validators/admin.validators.js';

// ─── Order Workflow ──────────────────────────────────────

export async function getAllOrders(filters: {
  status?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  if (filters.assignedTo) where.assignedTo = filters.assignedTo;
  if (filters.search) {
    where.orderNumber = { contains: filters.search, mode: 'insensitive' };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, companyName: true, email: true } },
        items: true,
        tracking: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function getAdminOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, companyName: true, email: true } },
      items: true,
      tracking: true,
      timeline: { orderBy: { date: 'asc' } },
      invoice: true,
      returns: true,
    },
  });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusInput,
  adminId: string,
  adminName: string
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw ApiError.notFound('Order not found');

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: data.status,
      timeline: {
        create: {
          status: data.status,
          note: data.note,
          userId: adminId,
        },
      },
    },
    include: { timeline: { orderBy: { date: 'asc' } } },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Updated order ${order.orderNumber} status to ${data.status}`,
    entityType: 'Order',
    entityId: orderId,
  });

  return updated;
}

export async function assignOrder(
  orderId: string,
  data: AssignOrderInput,
  adminId: string,
  adminName: string
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw ApiError.notFound('Order not found');

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { assignedTo: data.assignedTo },
    select: { id: true, orderNumber: true, assignedTo: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Assigned order ${order.orderNumber} to ${data.assignedTo}`,
    entityType: 'Order',
    entityId: orderId,
  });

  return updated;
}

export async function addOrderInternalNote(
  orderId: string,
  data: AddOrderNoteInput,
  adminId: string,
  adminName: string
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw ApiError.notFound('Order not found');

  const existingNotes = Array.isArray(order.internalNotes) ? order.internalNotes : [];
  const newNote = { text: data.text, user: adminName, date: new Date().toISOString() };

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { internalNotes: [...existingNotes, newNote] },
    select: { id: true, orderNumber: true, internalNotes: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Added internal note to order ${order.orderNumber}`,
    entityType: 'Order',
    entityId: orderId,
  });

  return updated;
}

export async function bulkUpdateOrderStatus(
  data: BulkUpdateOrderStatusInput,
  adminId: string,
  adminName: string
) {
  const results = await prisma.$transaction(
    data.orderIds.map((orderId) =>
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: data.status,
          timeline: {
            create: { status: data.status, note: data.note, userId: adminId },
          },
        },
        select: { id: true, orderNumber: true, status: true },
      })
    )
  );

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Bulk updated ${data.orderIds.length} orders to status ${data.status}`,
    entityType: 'Order',
  });

  return results;
}

// ─── Returns ─────────────────────────────────────────────

function generateReturnNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RET-${ts}-${rand}`;
}

export async function listReturns(filters: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;

  const [returns, total] = await Promise.all([
    prisma.returnRequest.findMany({
      where,
      include: {
        order: { select: { orderNumber: true, userId: true } },
        notes: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.returnRequest.count({ where }),
  ]);

  return { returns, total, page, limit };
}

export async function getReturnById(returnId: string) {
  const ret = await prisma.returnRequest.findUnique({
    where: { id: returnId },
    include: {
      order: { include: { user: { select: { companyName: true, email: true } } } },
      notes: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!ret) throw ApiError.notFound('Return request not found');
  return ret;
}

export async function createReturn(
  data: CreateReturnInput,
  adminId: string,
  adminName: string
) {
  const order = await prisma.order.findUnique({ where: { id: data.orderId } });
  if (!order) throw ApiError.notFound('Order not found');

  const returnNumber = generateReturnNumber();
  const ret = await prisma.returnRequest.create({
    data: {
      returnNumber,
      orderId: data.orderId,
      partnerName: data.partnerName,
      reason: data.reason,
      description: data.description,
      status: 'REPORTED',
    },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'RETURN',
    description: `Created return ${returnNumber} for order ${order.orderNumber}`,
    entityType: 'ReturnRequest',
    entityId: ret.id,
  });

  return ret;
}

export async function updateReturnStatus(
  returnId: string,
  data: UpdateReturnStatusInput,
  adminId: string,
  adminName: string
) {
  const ret = await prisma.returnRequest.findUnique({ where: { id: returnId } });
  if (!ret) throw ApiError.notFound('Return request not found');

  const updated = await prisma.returnRequest.update({
    where: { id: returnId },
    data: {
      status: data.status,
      resolutionType: data.resolutionType,
      resolutionNotes: data.resolutionNotes,
      resolvedAt: ['RESOLVED', 'REJECTED'].includes(data.status) ? new Date() : undefined,
    },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'RETURN',
    description: `Updated return ${ret.returnNumber} status to ${data.status}`,
    entityType: 'ReturnRequest',
    entityId: returnId,
  });

  return updated;
}

export async function addReturnNote(
  returnId: string,
  data: AddReturnNoteInput,
  adminId: string,
  adminName: string
) {
  const ret = await prisma.returnRequest.findUnique({ where: { id: returnId } });
  if (!ret) throw ApiError.notFound('Return request not found');

  const note = await prisma.returnNote.create({
    data: { returnId, authorName: adminName, body: data.body },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'RETURN',
    description: `Added note to return ${ret.returnNumber}`,
    entityType: 'ReturnRequest',
    entityId: returnId,
  });

  return note;
}

// ─── Activity Log ────────────────────────────────────────

export async function getActivityLog(filters: ActivityLogFilterInput) {
  const page = Math.max(1, filters.page);
  const limit = Math.min(100, filters.limit);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.actionType) where.actionType = filters.actionType;
  if (filters.userId) where.userId = filters.userId;
  if (filters.startDate || filters.endDate) {
    const createdAt: Record<string, Date> = {};
    if (filters.startDate) createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) createdAt.lte = new Date(filters.endDate);
    where.createdAt = createdAt;
  }

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { logs, total, page, limit };
}

export async function exportActivityLogCSV(filters: Omit<ActivityLogFilterInput, 'page' | 'limit'>) {
  const where: Record<string, unknown> = {};
  if (filters.actionType) where.actionType = filters.actionType;
  if (filters.userId) where.userId = filters.userId;
  if (filters.startDate || filters.endDate) {
    const createdAt: Record<string, Date> = {};
    if (filters.startDate) createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) createdAt.lte = new Date(filters.endDate);
    where.createdAt = createdAt;
  }

  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10000,
  });

  const header = 'Date,User,Action,Description,Entity Type,Entity ID\n';
  const rows = logs
    .map((l) =>
      [
        l.createdAt.toISOString(),
        `"${l.userName}"`,
        l.actionType,
        `"${l.description.replace(/"/g, '""')}"`,
        l.entityType ?? '',
        l.entityId ?? '',
      ].join(',')
    )
    .join('\n');

  return header + rows;
}

// ─── Ops Stats ───────────────────────────────────────────

export async function getOpsStats() {
  const [
    ordersByStatus,
    pendingFulfilment,
    openTickets,
    overdueTickets,
    openReturns,
    recentActivity,
  ] = await Promise.all([
    prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.order.count({ where: { status: { in: ['NEW', 'PROCESSING'] } } }),
    prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.supportTicket.count({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        createdAt: { lte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      },
    }),
    prisma.returnRequest.count({ where: { status: { in: ['REPORTED', 'INVESTIGATING'] } } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return {
    ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count.id })),
    pendingFulfilment,
    openTickets,
    overdueTickets,
    openReturns,
    recentActivity,
  };
}

// ─── Admin Support ───────────────────────────────────────

export async function getAllTickets(filters: {
  status?: string;
  priority?: string;
  assignedTo?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assignedTo) where.assignedTo = filters.assignedTo;
  if (filters.category) where.category = filters.category;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, companyName: true, email: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return { tickets, total, page, limit };
}

export async function getAdminTicketById(ticketId: string) {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: { select: { id: true, companyName: true, email: true } },
      messages: { orderBy: { createdAt: 'asc' } },
      internalNotes: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  return ticket;
}

export async function assignTicket(
  ticketId: string,
  data: AssignTicketInput,
  adminId: string,
  adminName: string
) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw ApiError.notFound('Support ticket not found');

  const updated = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { assignedTo: data.assignedTo, status: 'IN_PROGRESS' },
    select: { id: true, ticketNumber: true, assignedTo: true, status: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Assigned ticket ${ticket.ticketNumber} to ${data.assignedTo}`,
    entityType: 'SupportTicket',
    entityId: ticketId,
  });

  return updated;
}

export async function addTicketInternalNote(
  ticketId: string,
  data: AddTicketInternalNoteInput,
  adminId: string,
  adminName: string
) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw ApiError.notFound('Support ticket not found');

  const note = await prisma.ticketInternalNote.create({
    data: { ticketId, authorName: adminName, body: data.body },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Added internal note to ticket ${ticket.ticketNumber}`,
    entityType: 'SupportTicket',
    entityId: ticketId,
  });

  return note;
}

export async function setTicketPriority(
  ticketId: string,
  data: SetTicketPriorityInput,
  adminId: string,
  adminName: string
) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw ApiError.notFound('Support ticket not found');

  const updated = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { priority: data.priority },
    select: { id: true, ticketNumber: true, priority: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Set ticket ${ticket.ticketNumber} priority to ${data.priority}`,
    entityType: 'SupportTicket',
    entityId: ticketId,
  });

  return updated;
}

export async function adminReplyToTicket(
  ticketId: string,
  data: AdminReplyTicketInput,
  adminId: string,
  adminName: string
) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  if (ticket.status === 'CLOSED') {
    throw ApiError.badRequest('Cannot reply to a closed ticket');
  }

  const [message] = await prisma.$transaction([
    prisma.ticketMessage.create({
      data: { ticketId, author: 'support', authorName: adminName, body: data.body },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'IN_PROGRESS', updatedAt: new Date() },
    }),
  ]);

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Replied to ticket ${ticket.ticketNumber}`,
    entityType: 'SupportTicket',
    entityId: ticketId,
  });

  return message;
}

export async function adminCloseTicket(ticketId: string, adminId: string, adminName: string) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  if (ticket.status === 'CLOSED') {
    throw ApiError.badRequest('Ticket is already closed');
  }

  const updated = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: 'CLOSED' },
    select: { id: true, ticketNumber: true, status: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Closed ticket ${ticket.ticketNumber}`,
    entityType: 'SupportTicket',
    entityId: ticketId,
  });

  return updated;
}

export async function adminReopenTicket(ticketId: string, adminId: string, adminName: string) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  if (ticket.status !== 'CLOSED') {
    throw ApiError.badRequest('Ticket is not closed');
  }

  const updated = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: 'OPEN' },
    select: { id: true, ticketNumber: true, status: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Reopened ticket ${ticket.ticketNumber}`,
    entityType: 'SupportTicket',
    entityId: ticketId,
  });

  return updated;
}

// ─── Top-Up Admin ────────────────────────────────────────

export async function listPendingTopUps(filters: { page?: number; limit?: number }) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = { status: 'pending' };

  const [topUps, total] = await Promise.all([
    prisma.topUpRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.topUpRequest.count({ where }),
  ]);

  return { topUps, total, page, limit };
}

export async function confirmTopUpAdmin(topUpId: string, adminId: string, adminName: string) {
  const topUp = await prisma.topUpRequest.findUnique({ where: { id: topUpId } });
  if (!topUp) throw ApiError.notFound('Top-up request not found');
  if (topUp.status !== 'pending') {
    throw ApiError.badRequest('Top-up has already been processed');
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.topUpRequest.update({ where: { id: topUpId }, data: { status: 'confirmed' } });

    const bal = await tx.dropshipBalance.update({
      where: { userId: topUp.userId },
      data: { currentBalance: { increment: topUp.amount } },
    });

    await tx.transaction.create({
      data: {
        userId: topUp.userId,
        type: 'top-up',
        reference: topUp.reference ?? topUpId,
        description: `Top-up confirmed by admin (${topUp.method})`,
        amount: topUp.amount,
        runningBalance: bal.currentBalance,
      },
    });

    if (bal.isLocked && bal.currentBalance.gt(bal.threshold)) {
      await tx.dropshipBalance.update({
        where: { userId: topUp.userId },
        data: { isLocked: false },
      });
    }

    return bal;
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Confirmed top-up of £${topUp.amount} for user ${topUp.userId}`,
    entityType: 'TopUpRequest',
    entityId: topUpId,
  });

  return result;
}

export async function rejectTopUpAdmin(
  topUpId: string,
  adminId: string,
  adminName: string
) {
  const topUp = await prisma.topUpRequest.findUnique({ where: { id: topUpId } });
  if (!topUp) throw ApiError.notFound('Top-up request not found');
  if (topUp.status !== 'pending') {
    throw ApiError.badRequest('Top-up has already been processed');
  }

  const updated = await prisma.topUpRequest.update({
    where: { id: topUpId },
    data: { status: 'failed' },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'ORDER_UPDATE',
    description: `Rejected top-up of £${topUp.amount} for user ${topUp.userId}`,
    entityType: 'TopUpRequest',
    entityId: topUpId,
  });

  return updated;
}
