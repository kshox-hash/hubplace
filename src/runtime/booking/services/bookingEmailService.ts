import nodemailer from "nodemailer";

import {
  renderConfirmationEmailTemplate,
} from "../templates/confirmationEmailTemplate";

type SendBookingConfirmationEmailInput = {
  to: string;
  customerName: string;
  bookingDate: string;
  bookingTime: string;
  confirmationUrl: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmationEmail(
  input: SendBookingConfirmationEmailInput
): Promise<void> {
  const html = renderConfirmationEmailTemplate({
    customerName: input.customerName,
    bookingDate: input.bookingDate,
    bookingTime: input.bookingTime,
    confirmationUrl: input.confirmationUrl,
  });

  await transporter.sendMail({
    from: `"Automatiza Fácil" <${process.env.SMTP_FROM_EMAIL}>`,
    to: input.to,
    subject: "Confirma tu reserva",
    html,
  });
}