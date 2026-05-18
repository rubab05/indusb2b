import { Decimal } from '@prisma/client/runtime/library';
import PDFDocument from 'pdfkit';
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

export async function generateInvoicePDF(invoiceId: string): Promise<Buffer> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      order: {
        include: {
          items: true,
          user: { select: { companyName: true, email: true } },
        },
      },
    },
  });
  if (!invoice) throw ApiError.notFound('Invoice not found');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const grey = '#555555';
    const dark = '#111111';
    const accent = '#F5C518';

    // Header bar
    doc.rect(50, 40, 495, 4).fill(accent);
    doc.moveDown(0.5);

    // Company name + Invoice label
    doc.fontSize(22).fillColor(dark).font('Helvetica-Bold').text('HOMATZ', 50, 60);
    doc.fontSize(10).fillColor(grey).font('Helvetica').text('B2B Wholesale & Dropshipping', 50, 86);

    doc.fontSize(20).fillColor(dark).font('Helvetica-Bold').text('INVOICE', 400, 60, { align: 'right' });

    // Invoice meta
    doc.fontSize(9).fillColor(grey).font('Helvetica');
    const issuedDate = new Date(invoice.issuedDate).toLocaleDateString('en-GB');
    const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-GB');
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 400, 88, { align: 'right' });
    doc.text(`Order #: ${invoice.order.orderNumber}`, 400, 100, { align: 'right' });
    doc.text(`Issued: ${issuedDate}`, 400, 112, { align: 'right' });
    doc.text(`Due: ${dueDate}`, 400, 124, { align: 'right' });

    // Divider
    doc.moveTo(50, 145).lineTo(545, 145).strokeColor('#DDDDDD').lineWidth(1).stroke();

    // Bill To
    doc.fontSize(9).fillColor(grey).font('Helvetica-Bold').text('BILL TO', 50, 158);
    doc.fontSize(10).fillColor(dark).font('Helvetica-Bold').text(invoice.order.user.companyName, 50, 172);
    doc.fontSize(9).fillColor(grey).font('Helvetica').text(invoice.order.user.email, 50, 186);

    // Status badge
    const statusLabel = invoice.status.toUpperCase();
    doc.roundedRect(400, 158, 80, 22, 3).fill(
      invoice.status === 'paid' ? '#D1FAE5' : invoice.status === 'overdue' ? '#FEE2E2' : '#FEF9C3'
    );
    doc.fontSize(9).fillColor(
      invoice.status === 'paid' ? '#065F46' : invoice.status === 'overdue' ? '#991B1B' : '#92400E'
    ).font('Helvetica-Bold').text(statusLabel, 400, 164, { width: 80, align: 'center' });

    // Items table header
    const tableTop = 220;
    doc.rect(50, tableTop, 495, 22).fill('#F3F4F6');
    doc.fontSize(8).fillColor(grey).font('Helvetica-Bold');
    doc.text('ITEM', 58, tableTop + 7);
    doc.text('SKU', 250, tableTop + 7);
    doc.text('QTY', 330, tableTop + 7, { width: 50, align: 'right' });
    doc.text('UNIT PRICE', 390, tableTop + 7, { width: 70, align: 'right' });
    doc.text('TOTAL', 468, tableTop + 7, { width: 70, align: 'right' });

    // Items rows
    let y = tableTop + 28;
    for (const item of invoice.order.items) {
      doc.fontSize(9).fillColor(dark).font('Helvetica');
      doc.text(item.productName, 58, y, { width: 185 });
      doc.text(item.sku, 250, y, { width: 75 });
      doc.text(String(item.quantity), 330, y, { width: 50, align: 'right' });
      doc.text(`£${Number(item.unitPrice).toFixed(2)}`, 390, y, { width: 70, align: 'right' });
      doc.text(`£${Number(item.lineTotal).toFixed(2)}`, 468, y, { width: 70, align: 'right' });
      doc.moveTo(50, y + 18).lineTo(545, y + 18).strokeColor('#F3F4F6').lineWidth(0.5).stroke();
      y += 22;
    }

    // Totals
    y += 10;
    doc.moveTo(350, y).lineTo(545, y).strokeColor('#DDDDDD').lineWidth(1).stroke();
    y += 8;
    doc.fontSize(9).fillColor(grey).font('Helvetica').text('Subtotal', 350, y, { width: 110, align: 'right' });
    doc.fillColor(dark).text(`£${Number(invoice.order.subtotal).toFixed(2)}`, 468, y, { width: 70, align: 'right' });
    y += 16;
    doc.fillColor(grey).text('Shipping', 350, y, { width: 110, align: 'right' });
    doc.fillColor(dark).text(`£${Number(invoice.order.shippingCost).toFixed(2)}`, 468, y, { width: 70, align: 'right' });
    y += 16;
    doc.rect(350, y, 195, 24).fill('#111111');
    doc.fontSize(10).fillColor('#FFFFFF').font('Helvetica-Bold')
      .text('TOTAL', 358, y + 7, { width: 100, align: 'left' })
      .text(`£${Number(invoice.amount).toFixed(2)}`, 468, y + 7, { width: 70, align: 'right' });

    // Footer
    doc.fontSize(8).fillColor(grey).font('Helvetica')
      .text('Thank you for your business. Payment is due by the date shown above.', 50, 740, { align: 'center', width: 495 });
    doc.rect(50, 756, 495, 2).fill(accent);

    doc.end();
  });
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

export async function getAllQuoteRequests() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });
  // Attach partner email/company by joining against User
  const userIds = [...new Set(quotes.map((q) => q.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, companyName: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  return quotes.map((q) => ({ ...q, partner: userMap[q.userId] ?? null }));
}

export async function respondToQuoteRequest(
  quoteId: string,
  adminId: string,
  adminName: string,
  responseText: string,
) {
  return prisma.quoteRequest.update({
    where: { id: quoteId },
    data: {
      adminResponse: responseText,
      respondedAt: new Date(),
      respondedBy: adminName,
      status: 'responded',
    },
  });
}
