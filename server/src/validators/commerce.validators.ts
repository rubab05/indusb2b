import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        sku: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    name: z.string().min(1),
    company: z.string().optional(),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    postcode: z.string().min(1),
    country: z.string().default('United Kingdom'),
  }),
  notes: z.string().optional(),
});

export const topUpSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['bank-transfer', 'card']),
});

export const createTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  category: z.enum(['Order Issue', 'Product Query', 'Account', 'Billing', 'Other']),
  relatedOrderId: z.string().optional(),
  body: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ticketMessageSchema = z.object({
  body: z.string().min(1, 'Message body is required'),
});

export const quoteRequestSchema = z.object({
  lines: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        sku: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, 'Quote must contain at least one line'),
  specialRequirements: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type TopUpInput = z.infer<typeof topUpSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
