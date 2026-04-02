export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  orderId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}

const MOCK_INVOICES: Invoice[] = [
  { id: "inv-001", invoiceNumber: "INV-2026-0041", orderNumber: "ORD-2026-0041", orderId: "ord-001", date: "28 Mar 2026", dueDate: "27 Apr 2026", amount: 619.2, status: "Pending" },
  { id: "inv-002", invoiceNumber: "INV-2026-0038", orderNumber: "ORD-2026-0038", orderId: "ord-002", date: "24 Mar 2026", dueDate: "23 Apr 2026", amount: 240.0, status: "Paid" },
  { id: "inv-003", invoiceNumber: "INV-2026-0031", orderNumber: "ORD-2026-0031", orderId: "ord-003", date: "18 Mar 2026", dueDate: "17 Apr 2026", amount: 1299.5, status: "Paid" },
  { id: "inv-004", invoiceNumber: "INV-2026-0022", orderNumber: "ORD-2026-0022", orderId: "ord-005", date: "10 Mar 2026", dueDate: "9 Apr 2026", amount: 985.2, status: "Paid" },
  { id: "inv-005", invoiceNumber: "INV-2026-0018", orderNumber: "ORD-2026-0018", orderId: "ord-006", date: "5 Mar 2026", dueDate: "4 Apr 2026", amount: 312.5, status: "Overdue" },
  { id: "inv-006", invoiceNumber: "INV-2026-0011", orderNumber: "ORD-2026-0011", orderId: "ord-007", date: "20 Feb 2026", dueDate: "22 Mar 2026", amount: 552.5, status: "Paid" },
  { id: "inv-007", invoiceNumber: "INV-2026-0005", orderNumber: "ORD-2026-0005", orderId: "ord-008", date: "8 Feb 2026", dueDate: "10 Mar 2026", amount: 660.0, status: "Paid" },
];

export const invoicesService = {
  async list(): Promise<Invoice[]> {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_INVOICES;
  },

  async download(invoiceId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 600));
    // API-ready: trigger PDF download from backend
    console.info("Download invoice:", invoiceId);
  },
};
