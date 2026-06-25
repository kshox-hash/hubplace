import nodemailer from "nodemailer";
import { renderBookingPaymentLinkEmailTemplate } from "../templates/bookingPaymentLinkEmailTemplate";

export type SendBookingPaymentLinkEmailInput = {
  to: string;
  customerName: string;
  businessName: string;
  bookingDate: string;
  bookingTime: string;
  checkoutUrl: string;
  cancelUrl?: string;
};

export async function sendBookingPaymentLinkEmail(
  input: SendBookingPaymentLinkEmailInput
): Promise<void> {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_FROM_EMAIL
  ) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const html = renderBookingPaymentLinkEmailTemplate(input);

  await transporter.sendMail({
    from: `"${input.businessName}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: input.to,
    subject: `Tu reserva en ${input.businessName} — completa el pago`,
    html,
  });
}
