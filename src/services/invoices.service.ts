import { api } from '../lib/api-client';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

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

export const invoicesService = {
  async list(): Promise<Invoice[]> {
    return api.get<Invoice[]>('/invoices');
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
