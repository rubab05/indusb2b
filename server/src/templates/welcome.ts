export function welcomeEmailTemplate(params: {
  companyName: string;
  contactName: string;
  accountType: string;
  loginUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Welcome to HOMATZ — Your application has been received`;

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
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;padding:32px 40px;">
              <h1 style="margin:0;color:#f59e0b;font-size:28px;letter-spacing:2px;">HOMATZ</h1>
              <p style="margin:4px 0 0;color:#999999;font-size:13px;">B2B Wholesale &amp; Dropshipping</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">Welcome, ${params.contactName}</h2>
              <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
                Thank you for applying to become a <strong>${params.accountType.charAt(0) + params.accountType.slice(1).toLowerCase()}</strong> partner with HOMATZ.
                We've received your application for <strong>${params.companyName}</strong> and our team will review it shortly.
              </p>
              <p style="margin:0 0 24px;color:#444444;font-size:15px;line-height:1.6;">
                You'll receive a follow-up email once your application has been reviewed. In the meantime, you can log in to track your application status.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f59e0b;border-radius:4px;">
                    <a href="${params.loginUrl}" style="display:inline-block;padding:14px 28px;color:#1a1a1a;font-weight:bold;font-size:15px;text-decoration:none;">
                      Log In to Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#999999;font-size:12px;">
                If you did not create this account, please ignore this email or contact us at support@homatz.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Welcome to HOMATZ, ${params.contactName}!\n\nThank you for applying to become a ${params.accountType} partner. Your application for ${params.companyName} has been received and will be reviewed shortly.\n\nLog in at: ${params.loginUrl}`;

  return { subject, html, text };
}
