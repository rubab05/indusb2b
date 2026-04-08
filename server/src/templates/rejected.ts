export function rejectedEmailTemplate(params: {
  companyName: string;
  contactName: string;
  supportEmail?: string;
  adminNotes?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Update on your HOMATZ application`;
  const support = params.supportEmail ?? 'support@homatz.com';

  const notesSection = params.adminNotes
    ? `<p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;background:#f9f9f9;padding:12px 16px;border-left:3px solid #dddddd;">
        <strong>Reason:</strong> ${params.adminNotes}
       </p>`
    : '';

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
              <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">Application Update</h2>
              <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
                Hi ${params.contactName}, thank you for your interest in partnering with HOMATZ.
              </p>
              <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
                After reviewing your application for <strong>${params.companyName}</strong>, we're unable to approve your account at this time.
              </p>
              ${notesSection}
              <p style="margin:0 0 24px;color:#444444;font-size:15px;line-height:1.6;">
                If you believe this decision was made in error or would like to discuss further, please contact our team at
                <a href="mailto:${support}" style="color:#f59e0b;">${support}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#999999;font-size:12px;">Contact us: ${support}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${params.contactName},\n\nWe've reviewed your HOMATZ application for ${params.companyName} and are unable to approve your account at this time.\n\n${params.adminNotes ? `Reason: ${params.adminNotes}\n\n` : ''}If you have questions, please contact us at ${support}.`;

  return { subject, html, text };
}
