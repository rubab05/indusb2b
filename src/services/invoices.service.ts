import { api } from '../lib/api-client';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

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

interface RawInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  amount: string | number;
  status: string;
  issuedDate: string;
  dueDate: string;
  order?: { orderNumber?: string };
}

function normalizeInvoice(raw: RawInvoice): Invoice {
  return {
    id: raw.id,
    invoiceNumber: raw.invoiceNumber,
    orderId: raw.orderId,
    orderNumber: raw.order?.orderNumber ?? raw.orderId,
    date: raw.issuedDate,
    dueDate: raw.dueDate,
    amount: typeof raw.amount === 'number' ? raw.amount : parseFloat(raw.amount) || 0,
    status: raw.status as InvoiceStatus,
  };
}

export const invoicesService = {
  async list(): Promise<Invoice[]> {
    const raw = await api.get<RawInvoice[]>('/invoices');
    return raw.map(normalizeInvoice);
  },

  async download(invoiceId: string): Promise<void> {
    const blob = await api.downloadBlob(`/invoices/${invoiceId}/download`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },
};