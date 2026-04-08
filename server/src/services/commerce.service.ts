import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import type { CreateOrderInput, QuoteRequestInput } from '../validators/commerce.validators.js';

// ─── Helpers ────────────────────────────────────────────

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

function generateInvoiceNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  return `INV-${ts}`;
}

function generateReferenceNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QR-${ts}-${rand}`;
}

// ─── Orders ─────────────────────────────────────────────

export async function getOrders(
  userId: string,
  filters: { status?: string; page?: number; limit?: number; search?: string }
) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId };
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.orderNumber = { contains: filters.search, mode: 'insensitive' };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true, tracking: true, invoice: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, tracking: true, timeline: true, invoice: true },
  });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function createOrder(userId: string, data: CreateOrderInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  // Look up price list items for each item in the order
  const resolvedItems: Array<{
    productFamilyId: string | null;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: Decimal;
    lineTotal: Decimal;
  }> = [];

  for (const item of data.items) {
    const family = await prisma.productFamily.findUnique({
      where: { slug: item.productSlug },
      include: { priceListItems: true },
    });

    const priceItem = family?.priceListItems[0];

    // Check MOQ
    if (priceItem && item.quantity < priceItem.moq) {
      throw ApiError.badRequest(
        `Minimum order quantity for ${item.productSlug} is ${priceItem.moq}`
      );
    }

    const unitPrice: Decimal = priceItem?.unitPrice ?? new Decimal(0);
    const lineTotal = unitPrice.mul(item.quantity);

    resolvedItems.push({
      productFamilyId: family?.id ?? null,
      productName: family?.name ?? item.productSlug,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    });
  }

  const subtotal = resolvedItems.reduce((acc, i) => acc.add(i.lineTotal), new Decimal(0));
  const shippingCost = new Decimal(0);
  const total = subtotal.add(shippingCost);

  // For dropship users, check and debit balance
  if (user.accountType === 'DROPSHIP') {
    const balance = await prisma.dropshipBalance.findUnique({ where: { userId } });
    if (!balance) throw ApiError.badRequest('Dropship balance account not found');
    if (balance.isLocked) {
      throw ApiError.forbidden('Account is locked due to low balance. Please top up.');
    }
    if (balance.currentBalance.lt(total)) {
      throw ApiError.badRequest('Insufficient dropship balance');
    }
  }

  const orderNumber = generateOrderNumber();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: 'NEW',
        subtotal,
        shippingCost,
        total,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        items: {
          create: resolvedItems,
        },
        timeline: {
          create: { status: 'NEW', note: 'Order placed', userId },
        },
        invoice: {
          create: {
            invoiceNumber: generateInvoiceNumber(),
            amount: total,
            status: 'pending',
            dueDate,
          },
        },
      },
      include: { items: true, invoice: true, timeline: true },
    });

    // Debit dropship balance
    if (user.accountType === 'DROPSHIP') {
      const bal = await tx.dropshipBalance.update({
        where: { userId },
        data: { currentBalance: { decrement: total } },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: 'order',
          reference: orderNumber,
          description: `Order ${orderNumber}`,
          amount: total.neg(),
          runningBalance: bal.currentBalance,
        },
      });

      // Lock if below threshold
      if (bal.currentBalance.lte(bal.threshold)) {
        await tx.dropshipBalance.update({
          where: { userId },
          data: { isLocked: true },
        });
      }
    }

    return created;
  });

  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!order) throw ApiError.notFound('Order not found');

  if (!['NEW', 'PROCESSING'].includes(order.status)) {
    throw ApiError.badRequest('Order cannot be cancelled at this stage');
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CANCELLED',
      timeline: {
        create: { status: 'CANCELLED', note: 'Cancelled by partner', userId },
      },
    },
    include: { items: true, tracking: true, invoice: true, timeline: true },
  });

  return updated;
}

export async function reorder(userId: string, orderId: string) {
  const original = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
  if (!original) throw ApiError.notFound('Order not found');

  const items = original.items.map((i) => ({
    productSlug: i.sku, // best effort — slug not stored, use sku as fallback key
    sku: i.sku,
    quantity: i.quantity,
  }));

  return createOrder(userId, {
    items,
    shippingAddress: original.shippingAddress as CreateOrderInput['shippingAddress'],
    notes: original.notes ?? undefined,
  });
}

// ─── Invoices ───────────────────────────────────────────

export async function getInvoices(
  userId: string,
  filters: { status?: string; page?: number; limit?: number }
) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    order: { userId },
  };
  if (filters.status) where.status = filters.status;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { order: { select: { orderNumber: true, userId: true } } },
      orderBy: { issuedDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total, page, limit };
}

export async function getInvoiceById(userId: string, invoiceId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, order: { userId } },
    include: {
      order: {
        include: { items: true, user: { select: { companyName: true, email: true } } },
      },
    },
  });
  if (!invoice) throw ApiError.notFound('Invoice not found');
  return invoice;
}

export async function generateInvoicePDF(_invoiceId: string): Promise<Buffer> {
  // Placeholder — returns a minimal PDF-like buffer
  // Replace with a real PDF library (pdfkit, puppeteer) in production
  const placeholder = `%PDF-1.4 INVOICE PLACEHOLDER`;
  return Buffer.from(placeholder, 'utf-8');
}

// ─── Tracking ───────────────────────────────────────────

export async function getActiveShipments(userId: string) {
  return prisma.trackingInfo.findMany({
    where: {
      order: {
        userId,
        status: { in: ['SHIPPED', 'PROCESSING', 'PACKED'] },
      },
    },
    include: { order: { select: { orderNumber: true, status: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTrackingByOrderId(userId: string, orderId: string) {
  const tracking = await prisma.trackingInfo.findFirst({
    where: { orderId, order: { userId } },
    include: { order: { select: { orderNumber: true, status: true, timeline: true } } },
  });
  if (!tracking) throw ApiError.notFound('Tracking information not found');
  return tracking;
}

// ─── Pricing ────────────────────────────────────────────

export async function getPriceList(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  const isWholesale = user.accountType === 'WHOLESALE';

  // Get pricing rules to filter visibility
  const rules = await prisma.pricingRule.findMany({ include: { category: true } });

  const items = await prisma.priceListItem.findMany({
    include: {
      productFamily: {
        include: { category: true },
      },
    },
  });

  return items.filter((item) => {
    const family = item.productFamily;
    const categoryId = family.categoryId;

    // Check category-level visibility rule
    const categoryRule = rules.find((r) => r.categoryId === categoryId);
    if (categoryRule) {
      return isWholesale ? categoryRule.visibleToWholesale : categoryRule.visibleToDropship;
    }

    // Check product-level visibility rule
    const productRule = rules.find((r) => r.productFamilySlug === family.slug);
    if (productRule) {
      return isWholesale ? productRule.visibleToWholesale : productRule.visibleToDropship;
    }

    return true; // visible by default
  });
}

export async function getMOQRules() {
  return prisma.mOQRule.findMany({ include: { category: true } });
}

export async function getBulkDiscountTiers() {
  return prisma.bulkDiscountTier.findMany({ orderBy: { minQty: 'asc' } });
}

export async function createQuoteRequest(userId: string, data: QuoteRequestInput) {
  const referenceNumber = generateReferenceNumber();
  return prisma.quoteRequest.create({
    data: {
      referenceNumber,
      userId,
      lines: data.lines,
      specialRequirements: data.specialRequirements,
      status: 'pending',
    },
  });
}

export async function getQuoteRequests(userId: string) {
  return prisma.quoteRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
