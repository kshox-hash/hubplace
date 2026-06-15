import { Request, Response } from "express";
import { verifyMpSignature, processApprovedPayment } from "./mp-webhook.service";

export const mpWebhookController = {
  async handle(req: Request, res: Response): Promise<Response> {
    const topic = req.query["topic"] ?? req.query["type"] ?? req.body?.type;

    if (topic && topic !== "payment") {
      return res.status(200).json({ ok: true, ignored: true, topic });
    }

    const paymentId = String(
      req.body?.data?.id ?? req.query["data.id"] ?? req.query["id"] ?? ""
    ).trim();

    if (!paymentId) {
      return res.status(200).json({ ok: true, ignored: true, reason: "sin paymentId" });
    }

    const xSignature = req.headers["x-signature"] as string | undefined;
    const xRequestId = req.headers["x-request-id"] as string | undefined;

    try {
      verifyMpSignature(xSignature, xRequestId, paymentId);
    } catch (sigError) {
      console.error("[webhook] Firma inválida:", (sigError as Error).message);
      return res.status(401).json({ ok: false, message: "Firma inválida" });
    }

    const mpUserId = String(req.body?.user_id ?? "").trim() || undefined;

    try {
      const result = await processApprovedPayment(paymentId, mpUserId);

      if (result.skipped) {
        return res.status(200).json({
          ok: true,
          ignored: true,
          reason: result.reason,
          ...(result.bookingId ? { bookingId: result.bookingId } : {}),
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Pago procesado correctamente",
        bookingId: result.bookingId,
      });
    } catch (error) {
      console.error("[webhook] Error procesando pago:", error);
      // MP requiere 200 siempre — un 500 provoca reintentos y baja el score de integración
      return res.status(200).json({ ok: false, message: "Error interno, reintento no necesario" });
    }
  },
};
