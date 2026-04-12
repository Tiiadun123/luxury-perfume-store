export function getOrderReceiptHtml({
  customerName,
  orderNumber,
  totalAmount,
  items,
}: {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  items: {
    product_name: string;
    variant_size: number;
    quantity: number;
    total_price: number;
  }[];
}) {
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalAmount);

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee;">
          <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 16px; color: #111111;">
            <strong>${item.product_name}</strong>
          </p>
          <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;">
            ${item.variant_size}ml &times; ${item.quantity}
          </p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right;">
          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #111111;">
            ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.total_price)}
          </p>
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Maison Scêntia - Xác Nhận Đơn Hàng</title>
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
              Xin chào <strong>${customerName}</strong>,
            </p>
            <p style="margin: 0 0 30px; font-family: Arial, sans-serif; font-size: 15px; color: #444444; line-height: 1.6;">
              Cảm ơn bạn đã lựa chọn Maison Scêntia. Đơn hàng <strong>#${orderNumber}</strong> của bạn đã được thanh toán thành công và hiện đang được các nghệ nhân của chúng tôi chuẩn bị.
            </p>

            <h2 style="margin: 0 0 15px; font-family: Arial, sans-serif; font-size: 13px; color: #111111; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #111111; padding-bottom: 8px;">
              Chi Tiết Đơn Hàng
            </h2>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 20px 12px 12px;">
                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #111111; letter-spacing: 0.1em; text-transform: uppercase;">
                    <strong>Tổng Tiền:</strong>
                  </p>
                </td>
                <td style="padding: 20px 12px 12px; text-align: right;">
                  <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 20px; color: #d4af37;">
                    <strong>${formattedTotal}</strong>
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 15px; color: #444444; line-height: 1.6;">
              Chúng tôi sẽ gửi thêm một email cập nhật trạng thái vận chuyển cho bạn ngay khi đơn hàng được bàn giao cho đối tác giao hàng.
            </p>
            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 15px; color: #444444; line-height: 1.6;">
              Kính chúc bạn một ngày tuyệt vời,<br>
              <strong>Đội ngũ Maison Scêntia</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding: 30px; background-color: #f1f1f1;">
            <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em;">
              © ${new Date().getFullYear()} Maison Scêntia Paris. All rights reserved.
            </p>
            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #888888;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" style="color: #111111; text-decoration: underline;">Tiếp Tục Mua Sắm</a> | 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/profile/orders" style="color: #111111; text-decoration: underline;">Quản Lý Đơn Hàng</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
