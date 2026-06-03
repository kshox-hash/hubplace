import { Request, Response } from "express";
import { createPreference } from "./mercado.service";

export const paymentsController = {
  async test(req: Request, res: Response) {
    try {
      const payment = await createPreference({
        accessToken: "APP_USR-5451524037309702-060201-f6620c343896150859b1c2b5a25338d7-3443156939",
        bookingId: "TEST-001",
        title: "Reserva Flowers",
        amount: 1000,
      });

      return res.json(payment);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        ok: false,
        message: "Error creando preferencia",
      });
    }
  },
};