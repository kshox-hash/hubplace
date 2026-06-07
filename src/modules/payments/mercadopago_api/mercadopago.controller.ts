import { Request, Response } from "express";
import { createPreference } from "./mercado.service";

export const paymentsController = {
  async test(req: Request, res: Response) {
    try {
      
        const accessToken = process.env.ACCESS_TOKEN_MP;

        if (!accessToken) {
        throw new Error("ACCESS_TOKEN no configurado");
        }

        const payment = await createPreference({
        accessToken,
        bookingId: "TEST-001",
        title: "Reserva Flowers",
        amount: 3000,
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