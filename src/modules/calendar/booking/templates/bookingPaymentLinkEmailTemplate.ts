export function renderBookingPaymentLinkEmailTemplate(input: {
  customerName: string;
  businessName: string;
  bookingDate: string;
  bookingTime: string;
  checkoutUrl: string;
  cancelUrl?: string;
}): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f9;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px;">
    <div style="background:#ffffff;border-radius:20px;padding:32px;border:1px solid #cdd6e4;">

      <h2 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#0a1628;letter-spacing:-0.4px;">
        Tu reserva está esperando pago
      </h2>
      <p style="margin:0 0 24px;font-size:14px;color:#4a6580;line-height:1.65;">
        Hola <strong style="color:#1c2d40;">${input.customerName}</strong>, tu hora en
        <strong style="color:#1c2d40;">${input.businessName}</strong> está bloqueada
        por los próximos 45 minutos. Completa el pago para confirmarla.
      </p>

      <div style="background:#f0f4f9;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:11px;color:#8fa8c0;font-weight:700;letter-spacing:0.8px;margin-bottom:6px;">DETALLE DE LA RESERVA</div>
        <div style="font-size:16px;color:#0a1628;font-weight:700;">${input.bookingDate}</div>
        <div style="font-size:14px;color:#4a6580;margin-top:2px;">${input.bookingTime} hrs · ${input.businessName}</div>
      </div>

      <a href="${input.checkoutUrl}"
         style="display:block;background:#3a7bd5;color:#ffffff;text-decoration:none;
                text-align:center;padding:15px 24px;border-radius:12px;
                font-size:15px;font-weight:700;letter-spacing:-0.1px;">
        Completar pago →
      </a>

      <p style="margin:20px 0 0;font-size:12px;color:#8fa8c0;text-align:center;line-height:1.5;">
        El link expira en 45 minutos.
      </p>
      ${input.cancelUrl ? `
      <p style="margin:16px 0 0;text-align:center;">
        <a href="${input.cancelUrl}" style="font-size:12px;color:#8fa8c0;text-decoration:underline;">
          Cancelar reserva
        </a>
      </p>` : ''}
    </div>
  </div>
</body>
</html>`;
}
