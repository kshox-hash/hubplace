import crypto from "crypto";
import { getPaymentById } from "../payments/mercado.service";
import {
  markPaymentAsPaid,
  confirmBooking,
  getBusinessNameByUserId,
} from "./mp-webhook.repository";
import { sendBookingPaidEmail } from "../calendar/booking/services/bookingPaidEmailService";
import { sendBusinessBookingPaidEmail } from "../calendar/booking/services/businessBookingPaidEmailService";

const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET ?? "";
const ACCESS_TOKEN_MP = process.env.ACCESS_TOKEN_MP ?? "";

/**
 * Verifica la firma HMAC-SHA256 que MercadoPago envía en x-signature.
 * Lanza un error si la firma es inválida o ausente.
 *
 * Formato del header x-signature: "ts=1704067200,v1=abc123..."
 * Manifest: "id:<paymentId>;request-id:<xRequestId>;ts:<ts>;"
 */
export function verifyMpSignature(
  xSignature: string | undefined,
  xRequestId: string | undefined,
  paymentId: string | undefined
): void {
  if (!WEBHOOK_SECRET) {
    throw new Error("MP_WEBHOOK_SECRET no está configurado");
  }

  if (!xSignature) {
    throw new Error("Header x-signature ausente");
  }

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => {
      const idx = part.indexOf("=");
      return [part.slice(0, idx), part.slice(idx + 1)] as [string, string];
    })
  );

  const ts = parts["ts"];
  const v1 = parts["v1"];

  if (!ts || !v1) {
    throw new Error("Header x-signature malformado");
  }

  const segments: string[] = [];
  if (paymentId) segments.push(`id:${paymentId}`);
  if (xRequestId) segments.push(`request-id:${xRequestId}`);
  segments.push(`ts:${ts}`);

  const manifest = segments.join(";") + ";";

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  if (
    expected.length !== v1.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  ) {
    throw new Error("Firma HMAC inválida");
  }
}

export type WebhookResult =
  | { skipped: true; reason: string; bookingId?: string }
  | { skipped: false; bookingId: string };

export async function processApprovedPayment(
  paymentId: string
): Promise<WebhookResult> {
  if (!ACCESS_TOKEN_MP) {
    throw new Error("ACCESS_TOKEN_MP no está configurado");
  }

  const paymentInfo = await getPaymentById(ACCESS_TOKEN_MP, paymentId);

  if (paymentInfo.status !== "approved") {
    return { skipped: true, reason: `status=${paymentInfo.status}` };
  }

  const bookingId = String(paymentInfo.external_reference ?? "").trim();

  if (!bookingId) {
    return { skipped: true, reason: "pago aprobado sin external_reference" };
  }

  const payment = await markPaymentAsPaid(bookingId, paymentId);

  if (!payment) {
    return { skipped: true, reason: "pago ya procesado anteriormente", bookingId };
  }

  const booking = await confirmBooking(bookingId);

  if (!booking) {
    return { skipped: false, bookingId };
  }

  const businessName =
    (await getBusinessNameByUserId(booking.user_id)) ?? "Negocio";

  const bookingDateStr = new Date(booking.booking_date).toLocaleDateString("es-CL");
  const bookingTimeStr = String(booking.start_time).slice(0, 5);

  if (booking.client_email) {
    sendBookingPaidEmail({
      to: booking.client_email,
      customerName: booking.client_name || "Cliente",
      businessName,
      bookingDate: bookingDateStr,
      bookingTime: bookingTimeStr,
    }).catch((e) => console.error("[webhook] Error email cliente:", e));
  }

  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;
  if (businessEmail) {
    sendBusinessBookingPaidEmail({
      to: businessEmail,
      businessName,
      customerName: booking.client_name || "Cliente",
      customerEmail: booking.client_email || "",
      customerPhone: booking.client_phone || "",
      bookingDate: bookingDateStr,
      bookingTime: bookingTimeStr,
      amount: Number(payment.amount || 0),
    }).catch((e) => console.error("[webhook] Error email negocio:", e));
  }

  return { skipped: false, bookingId };
}
