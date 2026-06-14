import express from "express";
import rateLimit from "express-rate-limit";
import { mpWebhookController } from "./mp-webhook.controller";

const router = express.Router();

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Demasiadas solicitudes. Intenta más tarde." },
});

router.post("/api/payments/webhook", webhookLimiter, mpWebhookController.handle);

router.get("/payment/success", (_req, res) =>
  res.send(`<!doctype html><html lang="es"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Pago recibido</title>
<style>
body{margin:0;min-height:100vh;background:#0f1011;color:#f3f4f6;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:460px;background:#16191f;border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:34px;text-align:center}
.icon{width:72px;height:72px;border-radius:22px;background:#064e3b;color:#10b981;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;font-size:38px;font-weight:800}
h1{margin:0 0 12px;font-size:28px;line-height:1.1}
p{color:#b8bdc7;font-size:15px;line-height:1.6;margin:0}
.small{margin-top:22px;font-size:12px;color:#8b929f}
</style></head>
<body><div class="card"><div class="icon">✓</div><h1>Pago recibido</h1>
<p>Tu pago fue aprobado. Estamos confirmando tu reserva.</p>
<div class="small">Puedes cerrar esta ventana.</div></div></body></html>`)
);

router.get("/payment/failure", (_req, res) =>
  res.send(`<!doctype html><html lang="es"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Pago no completado</title>
<style>
body{margin:0;min-height:100vh;background:#0f1011;color:#f3f4f6;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:460px;background:#16191f;border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:34px;text-align:center}
.icon{width:72px;height:72px;border-radius:22px;background:#451a1a;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;font-size:34px;font-weight:800}
h1{margin:0 0 12px;font-size:28px;line-height:1.1}
p{color:#b8bdc7;font-size:15px;line-height:1.6;margin:0}
</style></head>
<body><div class="card"><div class="icon">!</div><h1>Pago no completado</h1>
<p>No se pudo completar el pago. Puedes volver e intentarlo nuevamente.</p>
</div></body></html>`)
);

router.get("/payment/pending", (_req, res) =>
  res.send(`<!doctype html><html lang="es"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Pago pendiente</title>
<style>
body{margin:0;min-height:100vh;background:#0f1011;color:#f3f4f6;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:460px;background:#16191f;border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:34px;text-align:center}
.icon{width:72px;height:72px;border-radius:22px;background:#3b2f12;color:#f59e0b;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;font-size:34px;font-weight:800}
h1{margin:0 0 12px;font-size:28px;line-height:1.1}
p{color:#b8bdc7;font-size:15px;line-height:1.6;margin:0}
</style></head>
<body><div class="card"><div class="icon">…</div><h1>Pago pendiente</h1>
<p>Tu pago está siendo procesado. Te avisaremos cuando quede confirmado.</p>
</div></body></html>`)
);

export default router;
