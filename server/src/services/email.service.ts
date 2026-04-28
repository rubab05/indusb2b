import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { welcomeEmailTemplate } from '../templates/welcome.js';
import { approvedEmailTemplate } from '../templates/approved.js';
import { rejectedEmailTemplate } from '../templates/rejected.js';
import { orderConfirmationTemplate, type OrderLineItem } from '../templates/order-confirmation.js';
import { passwordResetTemplate } from '../templates/password-reset.js';

// ─── Transport ───────────────────────────────────────────

function createTransport() {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  // Dev fallback — log to console
  return null;
}

const transport = createTransport();

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
  if (transport) {
    await transport.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } else {
    // Dev mode: log the full email to console
    logger.info(`[EMAIL DEV] To: ${to} | Subject: ${subject}\n${html}`);
  }
}

// ─── Email Functions ─────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string;
  companyName: string;
  contactName: string;
  accountType: string;
}): Promise<void> {
  const { subject, html, text } = welcomeEmailTemplate({
    companyName: params.companyName,
    contactName: params.contactName,
    accountType: params.accountType,
    loginUrl: `${env.FRONTEND_URL}/login`,
  });
  await sendEmail(params.to, subject, html, text);
}

export async function sendApplicationApproved(params: {
  to: string;
  companyName: string;
  contactName: string;
  accountType: string;
  adminNotes?: string;
}): Promise<void> {
  const { subject, html, text } = approvedEmailTemplate({
    companyName: params.companyName,
    contactName: params.contactName,
    accountType: params.accountType,
    portalUrl: `${env.FRONTEND_URL}/dashboard`,
    adminNotes: params.adminNotes,
  });
  await sendEmail(params.to, subject, html, text);
}

export async function sendApplicationRejected(params: {
  to: string;
  companyName: string;
  contactName: string;
  adminNotes?: string;
}): Promise<void> {
  const { subject, html, text } = rejectedEmailTemplate({
    companyName: params.companyName,
    contactName: params.contactName,
    adminNotes: params.adminNotes,
  });
  await sendEmail(params.to, subject, html, text);
}

export async function sendOrderConfirmation(params: {
  to: string;
  companyName: string;
  contactName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderLineItem[];
  subtotal: string;
  shippingCost: string;
  total: string;
  orderId: string;
}): Promise<void> {
  const { subject, html, text } = orderConfirmationTemplate({
    companyName: params.companyName,
    contactName: params.contactName,
    orderNumber: params.orderNumber,
    orderDate: params.orderDate,
    items: params.items,
    subtotal: params.subtotal,
    shippingCost: params.shippingCost,
    total: params.total,
    portalUrl: `${env.FRONTEND_URL}/dashboard/orders/${params.orderId}`,
  });
  await sendEmail(params.to, subject, html, text);
}

export async function sendPasswordReset(params: {
  to: string;
  contactName: string;
  resetToken: string;
}): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${params.resetToken}`;
  const { subject, html, text } = passwordResetTemplate({
    contactName: params.contactName,
    resetUrl,
    expiresInHours: 1,
  });
  await sendEmail(params.to, subject, html, text);
}

export async function sendTopUpConfirmation(params: {
  to: string;
  companyName: string;
  contactName: string;
  amount: string;
  newBalance: string;
  reference: string;
}): Promise<void> {
  const subject = `Top-up Confirmed — £${params.amount} added to your account`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">
        <tr><td style="background-color:#1a1a1a;padding:32px 40px;">
          <h1 style="margin:0;color:#f59e0b;font-size:28px;letter-spacing:2px;">HOMATZ</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">&#10003; Top-up Confirmed</h2>
          <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
            Hi ${params.contactName}, your account top-up has been confirmed.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:4px;padding:20px;margin-bottom:24px;">
            <tr>
              <td style="color:#666666;font-size:14px;padding:4px 0;">Reference</td>
              <td style="color:#1a1a1a;font-size:14px;text-align:right;font-weight:bold;">${params.reference}</td>
            </tr>
            <tr>
              <td style="color:#666666;font-size:14px;padding:4px 0;">Amount Added</td>
              <td style="color:#1a1a1a;font-size:14px;text-align:right;font-weight:bold;">£${params.amount}</td>
            </tr>
            <tr>
              <td style="color:#666666;font-size:14px;padding:4px 0;border-top:1px solid #eeeeee;padding-top:8px;">New Balance</td>
              <td style="color:#f59e0b;font-size:16px;text-align:right;font-weight:bold;border-top:1px solid #eeeeee;padding-top:8px;">£${params.newBalance}</td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background-color:#f59e0b;border-radius:4px;">
              <a href="${env.FRONTEND_URL}/dashboard/dropship" style="display:inline-block;padding:14px 28px;color:#1a1a1a;font-weight:bold;font-size:15px;text-decoration:none;">
                View Balance
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
          <p style="margin:0;color:#999999;font-size:12px;">Questions? Contact support@homatz.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Hi ${params.contactName},\n\nYour top-up of £${params.amount} (ref: ${params.reference}) has been confirmed.\nNew balance: £${params.newBalance}\n\nView your balance at: ${env.FRONTEND_URL}/dashboard/dropship`;

  await sendEmail(params.to, subject, html, text);
}

export async function sendEnquiryEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  if (transport) {
    await transport.sendMail({
      from: env.SMTP_FROM,
      to: params.to,
      replyTo: params.replyTo,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    logger.info(`Enquiry email sent: ${params.subject}`);
  } else {
    logger.info(`[EMAIL DEV] To: ${params.to} | Subject: ${params.subject}\n${params.text}`);
  }
}
