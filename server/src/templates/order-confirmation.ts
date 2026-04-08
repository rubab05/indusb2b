export interface OrderLineItem {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export function orderConfirmationTemplate(params: {
  companyName: string;
  contactName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderLineItem[];
  subtotal: string;
  shippingCost: string;
  total: string;
  portalUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Order Confirmed — ${params.orderNumber}`;

  const itemRows = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eeeeee;color:#444444;font-size:14px;">${item.productName}<br/><span style="color:#999999;font-size:12px;">${item.sku}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #eeeeee;color:#444444;font-size:14px;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eeeeee;color:#444444;font-size:14px;text-align:right;">£${item.unitPrice}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eeeeee;color:#444444;font-size:14px;text-align:right;">£${item.lineTotal}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">
          <tr>
            <td style="background-color:#1a1a1a;padding:32px 40px;">
              <h1 style="margin:0;color:#f59e0b;font-size:28px;letter-spacing:2px;">HOMATZ</h1>
              <p style="margin:4px 0 0;color:#999999;font-size:13px;">B2B Wholesale &amp; Dropshipping</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 4px;color:#1a1a1a;font-size:22px;">Order Confirmed</h2>
              <p style="margin:0 0 24px;color:#999999;font-size:13px;">Order ${params.orderNumber} &bull; ${params.orderDate}</p>
              <p style="margin:0 0 20px;color:#444444;font-size:15px;line-height:1.6;">
                Hi ${params.contactName}, your order has been received and is being processed.
              </p>
              <!-- Items table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:4px;overflow:hidden;">
                <thead>
                  <tr style="background-color:#f9f9f9;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#999999;font-weight:normal;text-transform:uppercase;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;color:#999999;font-weight:normal;text-transform:uppercase;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#999999;font-weight:normal;text-transform:uppercase;">Unit</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#999999;font-weight:normal;text-transform:uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding:4px 0;color:#666666;font-size:14px;">Subtotal</td>
                  <td style="padding:4px 0;color:#666666;font-size:14px;text-align:right;">£${params.subtotal}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#666666;font-size:14px;">Shipping</td>
                  <td style="padding:4px 0;color:#666666;font-size:14px;text-align:right;">£${params.shippingCost}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0 0;color:#1a1a1a;font-size:16px;font-weight:bold;border-top:2px solid #eeeeee;">Total</td>
                  <td style="padding:8px 0 0;color:#1a1a1a;font-size:16px;font-weight:bold;text-align:right;border-top:2px solid #eeeeee;">£${params.total}</td>
                </tr>
              </table>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background-color:#f59e0b;border-radius:4px;">
                    <a href="${params.portalUrl}" style="display:inline-block;padding:14px 28px;color:#1a1a1a;font-weight:bold;font-size:15px;text-decoration:none;">
                      View Order
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#999999;font-size:12px;">Questions? Contact us at support@homatz.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const itemText = params.items
    .map((i) => `  ${i.productName} (${i.sku}) x${i.quantity} — £${i.lineTotal}`)
    .join('\n');

  const text = `Hi ${params.contactName},\n\nYour order ${params.orderNumber} has been confirmed.\n\nItems:\n${itemText}\n\nTotal: £${params.total}\n\nView your order at: ${params.portalUrl}`;

  return { subject, html, text };
}
