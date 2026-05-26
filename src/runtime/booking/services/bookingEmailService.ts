import nodemailer from "nodemailer";

import {
  ConfirmationEmailTemplateInput,
} from "../types/booking-email.types";

import { renderConfirmationEmailTemplate } from "../templates/confirmationEmailTemplate";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(
    process.env.SMTP_PORT || 587
  ),

  secure:
    process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type SendBookingConfirmationEmailInput =
  ConfirmationEmailTemplateInput & {
    to: string;
    subject?: string;
  };

export async function sendBookingConfirmationEmail(
  input: SendBookingConfirmationEmailInput
): Promise<void> {
  const html =
    renderConfirmationEmailTemplate(input);

  await transporter.sendMail({
    from:
      `"${input.theme.brandName}" <${process.env.SMTP_FROM_EMAIL}>`,

    to: input.to,

    subject:
      input.subject ||
      "Confirma tu reserva",

    html,
  });
}