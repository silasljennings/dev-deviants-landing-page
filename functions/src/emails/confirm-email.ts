// src/emails/ConfirmEmail.ts
export class ConfirmEmail {
    private static readonly baseUrl = process.env.FRONTEND_URL ?? 'https://devdeviants.com';
    private static readonly logoUrl = process.env.LOGO_URL ?? 'https://yourdomain.com/logo.png';
    private static readonly companyName = 'Dev Deviants';
    private static readonly supportEmail = 'support@devdeviants.com';

    /**
     * Returns the full HTML for the confirmation email,
     * with the verification token injected into all relevant links.
     */
    public static getHtml(token: string): string {
        const verifyLink = `${this.baseUrl}/verify-email?token=${token}`;

        return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <title>Please Verify Your Email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    /* CLIENT-SPECIFIC STYLES */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; }

    /* RESET STYLES */
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
    table { border-collapse:collapse !important; }
    body { margin:0 !important; padding:0 !important; width:100% !important; }

    /* MOBILE STYLES */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-padding { padding: 20px !important; }
    }

    /* BUTTON STYLE */
    .btn {
      background-color: #36013F;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 1rem;
      display: inline-block;
      font-family: sans-serif;
      font-size: 16px;
    }
  </style>
</head>
<body style="background-color:#f2f2f2; margin:0; padding:0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
      <td align="center" bgcolor="#1a82e2">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td align="center" valign="top" style="padding: 40px 0;">
              <img src="${this.logoUrl}" alt="${this.companyName} Logo" width="120" style="display:block; border:0;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- HERO -->
    <tr>
      <td align="center" bgcolor="#f2f2f2">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600"
               style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <tr>
            <td class="mobile-padding" align="left"
                style="padding:40px; font-family:sans-serif; font-size:18px; line-height:28px; color:#333333;">
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#333333;">
                Verify Your Email
              </h1>
              <p style="margin:20px 0 30px;">
                Thanks for signing up to ${this.companyName}! Please confirm your email address by clicking the
                button below:
              </p>
              <p align="center">
                <a href="${verifyLink}" class="btn">Verify Email</a>
              </p>
              <p style="margin:30px 0 0; font-size:14px; color:#777777;">
                If the button doesn’t work, copy and paste the following link into your browser:
                <br/>
                <a href="${verifyLink}" style="color:#1a82e2;">${verifyLink}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td align="center" bgcolor="#f2f2f2" style="padding:20px 0;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td align="center"
                style="font-family:sans-serif; font-size:12px; color:#888888;">
              © ${new Date().getFullYear()} ${this.companyName}. All rights reserved.<br/>
              If you have any questions, contact us at
              <a href="mailto:${this.supportEmail}" style="color:#1a82e2;">
                ${this.supportEmail}
              </a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
}
