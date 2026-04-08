import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import type { CreateTicketInput, TicketMessageInput } from '../validators/commerce.validators.js';

function generateTicketNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TKT-${ts}-${rand}`;
}

export async function getTickets(
  userId: string,
  filters: { status?: string; page?: number; limit?: number }
) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId };
  if (filters.status) where.status = filters.status;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return { tickets, total, page, limit };
}

export async function getTicketById(userId: string, ticketId: string) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      // internal notes excluded for partner view
    },
  });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  return ticket;
}

export async function createTicket(userId: string, data: CreateTicketInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!user) throw ApiError.notFound('User not found');

  const ticketNumber = generateTicketNumber();
  const authorName = user.profile?.contactName ?? user.companyName;

  return prisma.supportTicket.create({
    data: {
      ticketNumber,
      userId,
      subject: data.subject,
      category: data.category,
      relatedOrderId: data.relatedOrderId,
      status: 'OPEN',
      priority: 'NORMAL',
      messages: {
        create: {
          author: 'partner',
          authorName,
          body: data.body,
        },
      },
    },
    include: { messages: true },
  });
}

export async function addMessage(
  userId: string,
  ticketId: string,
  data: TicketMessageInput
) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
  });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  if (ticket.status === 'CLOSED') {
    throw ApiError.badRequest('Cannot add a message to a closed ticket');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  const authorName = user?.profile?.contactName ?? user?.companyName ?? 'Partner';

  const [message] = await prisma.$transaction([
    prisma.ticketMessage.create({
      data: {
        ticketId,
        author: 'partner',
        authorName,
        body: data.body,
      },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'OPEN', updatedAt: new Date() },
    }),
  ]);

  return message;
}

export async function closeTicket(userId: string, ticketId: string) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
  });
  if (!ticket) throw ApiError.notFound('Support ticket not found');
  if (ticket.status === 'CLOSED') {
    throw ApiError.badRequest('Ticket is already closed');
  }

  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: 'CLOSED' },
  });
}
