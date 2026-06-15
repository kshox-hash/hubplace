import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { getClients, getClientBookings } from "./clients.repository";

function uid(req: Request): string {
  return String(req.params["userId"]);
}

function isForbidden(req: Request): boolean {
  return req.user?.userId !== uid(req);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export const clientsController = {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const clients = await getClients(uid(req));
      return res.json({ ok: true, clients });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async bookings(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const email = String(req.params["email"] || "").trim();
      if (!email) return res.status(400).json({ ok: false, message: "email requerido" });
      const bookings = await getClientBookings(uid(req), email);
      return res.json({ ok: true, bookings });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async sendEmail(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const { to, subject, message } = req.body;
      if (!to || !subject || !message) {
        return res.status(400).json({ ok: false, message: "to, subject y message son requeridos" });
      }
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Automatiza Fácil" <${process.env.SMTP_FROM_EMAIL}>`,
        to: String(to),
        subject: String(subject),
        html: `<div style="font-family:sans-serif;padding:24px;max-width:600px">
          <p style="white-space:pre-line;font-size:15px;color:#1C2D40;line-height:1.6">${String(message).replace(/</g, "&lt;")}</p>
          <hr style="border:none;border-top:1px solid #CDD6E4;margin:24px 0"/>
          <p style="font-size:12px;color:#8FA8C0">Enviado desde Automatiza Fácil</p>
        </div>`,
      });
      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },
};
