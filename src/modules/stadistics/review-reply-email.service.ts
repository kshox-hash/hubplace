import { createTransporter, SMTP_FROM } from "../../core/mailer";

export async function sendReviewReplyEmail(params: {
  to: string;
  reviewerName: string | null;
  comment: string | null;
  reply: string;
}): Promise<void> {
  let transporter: ReturnType<typeof createTransporter>;
  try { transporter = createTransporter(); } catch { return; }

  const name = params.reviewerName || "Cliente";
  await transporter.sendMail({
    from: SMTP_FROM(),
    to: params.to,
    subject: `Respondieron tu reseña`,
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif;">
<div style="max-width:500px;margin:32px auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
  <h2 style="font-size:18px;color:#1e293b;margin:0 0 8px">Hola ${name} 👋</h2>
  <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 20px">El negocio respondió a tu reseña.</p>
  ${params.comment ? `
  <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:16px">
    <p style="font-size:11px;color:#94a3b8;margin:0 0 6px;text-transform:uppercase;font-weight:600;letter-spacing:.04em">Tu reseña</p>
    <p style="font-size:14px;color:#475569;margin:0;line-height:1.5">"${params.comment}"</p>
  </div>` : ""}
  <div style="border-left:3px solid #6366f1;background:#f5f3ff;border-radius:0 10px 10px 0;padding:14px">
    <p style="font-size:11px;color:#6366f1;margin:0 0 6px;text-transform:uppercase;font-weight:700;letter-spacing:.04em">Respuesta del negocio</p>
    <p style="font-size:14px;color:#374151;margin:0;line-height:1.5">${params.reply}</p>
  </div>
</div>
</body>
</html>`,
  });
}
