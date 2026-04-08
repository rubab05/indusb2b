export function approvedEmailTemplate(params: {
  companyName: string;
  contactName: string;
  accountType: string;
  portalUrl: string;
  adminNotes?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Your HOMATZ application has been approved`;

  const notesSection = params.adminNotes
    ? `<p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;background:#f9f9f9;padding:12px 16px;border-left:3px solid #f59e0b;">
        <strong>Note from our team:</strong> ${params.adminNotes}
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
              <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;">&#10003; Application Approved</h2>
              <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
                Hi ${params.contactName}, we're pleased to let you know that your <strong>${params.accountType.charAt(0) + params.accountType.slice(1).toLowerCase()}</strong> partner application for <strong>${params.companyName}</strong> has been approved.
              </p>
              <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
                You now have full access to the HOMATZ partner portal where you can browse products, place orders, and manage your account.
              </p>
              ${notesSection}
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f59e0b;border-radius:4px;">
                    <a href="${params.portalUrl}" style="display:inline-block;padding:14px 28px;color:#1a1a1a;font-weight:bold;font-size:15px;text-decoration:none;">
                      Access Your Portal
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

  const text = `Hi ${params.contactName},\n\nYour HOMATZ ${params.accountType} partner application for ${params.companyName} has been approved.\n\nAccess your portal at: ${params.portalUrl}`;

  return { subject, html, text };
}
