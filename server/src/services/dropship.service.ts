import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import type { TopUpInput } from '../validators/commerce.validators.js';

function generateTopUpReference(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TU-${ts}-${rand}`;
}

export async function getBalance(userId: string) {
  let balance = await prisma.dropshipBalance.findUnique({ where: { userId } });

  if (!balance) {
    // Auto-create on first access for dropship users
    balance = await prisma.dropshipBalance.create({
      data: { userId, currentBalance: 0, threshold: 50, isLocked: false },
    });
  }

  return balance;
}

export async function getTransactions(
  userId: string,
  filters: {
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId };
  if (filters.type) where.type = filters.type;
  if (filters.startDate || filters.endDate) {
    const createdAt: Record<string, Date> = {};
    if (filters.startDate) createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) createdAt.lte = new Date(filters.endDate);
    where.createdAt = createdAt;
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total, page, limit };
}

export async function getRecentTransactions(userId: string, limit = 10) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function submitTopUp(userId: string, data: TopUpInput) {
  const reference = generateTopUpReference();
  const topUp = await prisma.topUpRequest.create({
    data: {
      userId,
      amount: new Decimal(data.amount),
      method: data.method,
      reference,
      status: 'pending',
    },
  });
  return topUp;
}

export async function confirmTopUp(topUpId: string) {
  const topUp = await prisma.topUpRequest.findUnique({ where: { id: topUpId } });
  if (!topUp) throw ApiError.notFound('Top-up request not found');
  if (topUp.status !== 'pending') {
    throw ApiError.badRequest('Top-up has already been processed');
  }

  return prisma.$transaction(async (tx) => {
    await tx.topUpRequest.update({
      where: { id: topUpId },
      data: { status: 'confirmed' },
    });

    const bal = await tx.dropshipBalance.update({
      where: { userId: topUp.userId },
      data: { currentBalance: { increment: topUp.amount } },
    });

    await tx.transaction.create({
      data: {
        userId: topUp.userId,
        type: 'top-up',
        reference: topUp.reference ?? topUpId,
        description: `Top-up via ${topUp.method}`,
        amount: topUp.amount,
        runningBalance: bal.currentBalance,
      },
    });

    // Release lock if balance is now above threshold
    if (bal.isLocked && bal.currentBalance.gt(bal.threshold)) {
      await tx.dropshipBalance.update({
        where: { userId: topUp.userId },
        data: { isLocked: false },
      });
    }

    return bal;
  });
}

export async function getBalanceHistory(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const transactions = await prisma.transaction.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true, runningBalance: true, amount: true, type: true },
  });

  // Group by day
  const byDay: Record<string, { date: string; balance: number }> = {};
  for (const t of transactions) {
    const day = t.createdAt.toISOString().slice(0, 10);
    byDay[day] = { date: day, balance: Number(t.runningBalance) };
  }

  return Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getStatement(userId: string, startDate: string, endDate: string) {
  return prisma.transaction.findMany({
    where: {
      userId,
      createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function checkThreshold(userId: string) {
  const balance = await prisma.dropshipBalance.findUnique({ where: { userId } });
  if (!balance) return;

  const shouldLock = balance.currentBalance.lte(balance.threshold);
  if (shouldLock !== balance.isLocked) {
    await prisma.dropshipBalance.update({
      where: { userId },
      data: { isLocked: shouldLock },
    });
  }

  return { ...balance, isLocked: shouldLock };
}
