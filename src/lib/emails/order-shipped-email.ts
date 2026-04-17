export function getOrderShippedHtml({
  customerName,
  orderNumber,
  trackingNumber,
}: {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Maison Scêntia - Đơn Hàng Đang Được Giao</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" max-width="600" style="margin: 0 auto; background-color: #ffffff; max-width: 600px;">
        <!-- Header -->
        <tr>
          <td align="center" style="padding: 40px 20px; background-color: #111111;">
            <h1 style="margin: 0; font-family: 'Times New Roman', serif; font-size: 32px; font-weight: normal; letter-spacing: 0.2em; color: #d4af37; text-transform: uppercase;">
              Maison Scêntia
            </h1>
            <p style="margin: 10px 0 0; font-family: Arial, sans-serif; font-size: 10px; color: #ffffff; letter-spacing: 0.4em; text-transform: uppercase;">
              Paris
            </p>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding: 40px 30px;">
            <p style="margin: 0 0 20px; font-family: 'Times New Roman', serif; font-size: 20px; color: #111111;">
              Tiên quý <strong>${customerName}</strong>,
            </p>
            <p style="margin: 0 0 30px; font-family: Arial, sans-serif; font-size: 15px; color: #444444; line-height: 1.6;">
              Maison Scêntia xin vui mừng thông báo: Kiệt tác hương thơm trong đơn hàng <strong>#${orderNumber}</strong> của bạn đã chính thức rời xưởng và đang trên đường đến với bạn.
            </p>

            <div style="background-color: #fcf8e3; border: 1px solid #faebcc; padding: 20px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 13px; color: #8a6d3b; text-transform: uppercase; letter-spacing: 0.1em;">
                Thông Tin Vận Chuyển
              </h3>
              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #111111;">
                <strong>Mã vận đơn:</strong> ${trackingNumber || "Đang cập nhật"}
              </p>
            </div>

            <p style="margin: 0 0 30px; font-family: Arial, sans-serif; font-size: 15px; color: #444444; line-height: 1.6;">
              Từng giọt hương đều mang tâm huyết của chúng tôi. Hy vọng bạn sẽ hài lòng khi nhận được và trải nghiệm sự sang trọng thanh tao từ Maison Scêntia.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/profile/orders" style="display: inline-block; padding: 15px 30px; background-color: #111111; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase;">
                    Theo Dõi Đơn Hàng
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding: 30px; background-color: #f1f1f1;">
            <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em;">
              © ${new Date().getFullYear()} Maison Scêntia Paris. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
