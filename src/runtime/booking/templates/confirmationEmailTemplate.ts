export type ConfirmationEmailTemplateInput = {
  customerName: string;
  bookingDate: string;
  bookingTime: string;
  confirmationUrl: string;
};

export function renderConfirmationEmailTemplate(
  input: ConfirmationEmailTemplateInput
): string {
  return `
<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#0f1011;font-family:Arial,sans-serif;color:#f3f4f6;">
  <div style="max-width:560px;margin:0 auto;padding:32px 18px;">
    <div style="background:#16191f;border-radius:24px;padding:32px;border:1px solid rgba(255,255,255,.08);">
      
      <div style="width:44px;height:44px;border-radius:14px;background:#63acf1;color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;margin-bottom:22px;">
        AF
      </div>

      <h1 style="margin:0 0 14px;font-size:28px;line-height:1.1;color:#f3f4f6;">
        Confirma tu reserva
      </h1>

      <p style="margin:0;font-size:15px;line-height:1.7;color:#b8bdc7;">
        Hola ${input.customerName}, recibimos tu solicitud de reserva.
      </p>

      <div style="margin-top:24px;padding:18px;border-radius:18px;background:#1b1f25;">
        <div style="color:#63acf1;font-weight:700;font-size:15px;">
          ${input.bookingDate}
        </div>
        <div style="margin-top:6px;color:#f3f4f6;font-size:14px;">
          ${input.bookingTime} hrs
        </div>
      </div>

      <p style="margin-top:24px;font-size:14px;line-height:1.6;color:#b8bdc7;">
        Para confirmar tu hora, presiona el siguiente botón.
      </p>

      <a href="${input.confirmationUrl}"
         style="display:inline-block;margin-top:14px;background:#63acf1;color:#0f1011;padding:15px 24px;border-radius:999px;text-decoration:none;font-weight:800;font-size:14px;">
        Confirmar hora
      </a>

      <p style="margin-top:28px;font-size:12px;line-height:1.6;color:#8b929f;">
        Si no solicitaste esta reserva, puedes ignorar este correo.
      </p>

      <div style="margin-top:24px;font-size:13px;color:#8b929f;">
        Automatiza Fácil
      </div>
    </div>
  </div>
</body>
</html>
`;
}