export function passwordResetTemplate(params: {
  contactName: string;
  resetUrl: string;
  expiresInHours?: number;
}): { subject: string; html: string; text: string } {
  const subject = `Reset your HOMATZ password`;
  const expires = params.expiresInHours ?? 1;

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
              <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">Password Reset Request</h2>
              <p style="margin:0 0 16px;color:#444444;font-size:15px;line-height:1.6;">
                Hi ${params.contactName}, we received a request to reset the password for your HOMATZ account.
              </p>
              <p style="margin:0 0 24px;color:#444444;font-size:15px;line-height:1.6;">
                Click the button below to set a new password. This link will expire in <strong>${expires} hour${expires !== 1 ? 's' : ''}</strong>.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f59e0b;border-radius:4px;">
                    <a href="${params.resetUrl}" style="display:inline-block;padding:14px 28px;color:#1a1a1a;font-weight:bold;font-size:15px;text-decoration:none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#999999;font-size:13px;line-height:1.5;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#999999;font-size:12px;">For security, this link expires in ${expires} hour${expires !== 1 ? 's' : ''}. Questions? Contact support@homatz.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${params.contactName},\n\nWe received a request to reset your HOMATZ password.\n\nReset your password at: ${params.resetUrl}\n\nThis link expires in ${expires} hour${expires !== 1 ? 's' : ''}. If you didn't request this, please ignore this email.`;

  return { subject, html, text };
}
