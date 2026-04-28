import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { apiSuccess } from '../utils/api-response.js';
import { logger } from '../utils/logger.js';
import * as emailService from '../services/email.service.js';
import { env } from '../config/env.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  product: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().optional(),
});

// POST /api/contact — public, no auth required
router.post(
  '/',
  validate(contactSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, company, email, product, quantity, message } = req.body as z.infer<typeof contactSchema>;

      const subject = product
        ? `Trade Enquiry: ${product} — ${company}`
        : `Trade Enquiry from ${company}`;

      const html = `
        <h2>New Trade Enquiry</h2>
        <table cellpadding="6" cellspacing="0">
          <tr><td><strong>Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Company</strong></td><td>${company}</td></tr>
          <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${product ? `<tr><td><strong>Product</strong></td><td>${product}</td></tr>` : ''}
          ${quantity ? `<tr><td><strong>Quantity</strong></td><td>${quantity}</td></tr>` : ''}
          ${message ? `<tr><td><strong>Message</strong></td><td>${message}</td></tr>` : ''}
        </table>
      `;
      const text = [
        `Name: ${name}`,
        `Company: ${company}`,
        `Email: ${email}`,
        product && `Product: ${product}`,
        quantity && `Quantity: ${quantity}`,
        message && `Message: ${message}`,
      ].filter(Boolean).join('\n');

      await emailService.sendEnquiryEmail({ to: env.SMTP_FROM || env.SMTP_USER || 'enquiries@homatz.co.uk', subject, html, text, replyTo: email });

      logger.info(`Contact enquiry from ${email} (${company})`);
      res.json(apiSuccess({ message: 'Enquiry received' }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
