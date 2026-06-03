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
  host: "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587  || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: "automatizafacil.chile@gmail.com",
    pass: "vguf xwsg qnmn chjn",
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
    from: `"Automatiza Fácil" <automatizafacil.chile@gmail.com>`,
    to: input.to,
    subject: "Confirma tu reserva",
    html,
  });
}