import { OrderLineInput, QuoteRequest } from "../types/commerce";

let orderCounter = 43;
let quoteCounter = 1;

export const orderingService = {
  async submitBulkOrder(lines: OrderLineInput[], address: string, notes: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    const orderNumber = `ORD-2026-00${orderCounter++}`;
    console.info("Order submitted:", { orderNumber, lines, address, notes });
    return orderNumber;
  },

  async submitQuickOrder(lines: OrderLineInput[], notes: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 600));
    const orderNumber = `ORD-2026-00${orderCounter++}`;
    console.info("Quick order submitted:", { orderNumber, lines, notes });
    return orderNumber;
  },

  async submitQuoteRequest(data: {
    lines: Array<{ sku: string; productName: string; qty: number }>;
    specialRequirements: string;
  }): Promise<QuoteRequest> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      id: `qr-00${quoteCounter}`,
      referenceNumber: `QR-2026-00${quoteCounter++}`,
      lines: data.lines,
      specialRequirements: data.specialRequirements,
      submittedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
  },
};
