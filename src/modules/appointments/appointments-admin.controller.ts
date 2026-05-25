import { Request, Response } from "express";
import {
  getCalendarBookingsByUserId,
  getCalendarSettingsByUserId,
  saveCalendarSettings,
} from "./appointments-admin.repository";

export const calendarAdminController = {
  async getSettings(req: Request<{ userId: string }>, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          ok: false,
          message: "userId requerido.",
        });
      }

      const data = await getCalendarSettingsByUserId(userId);

      return res.json({
        ok: true,
        ...data,
      });
    } catch (error) {
      console.error("Error obteniendo configuración calendario:", error);

      return res.status(500).json({
        ok: false,
        message: "No se pudo obtener la configuración.",
      });
    }
  },

  async saveSettings(req: Request, res: Response) {
    try {
      const body = req.body || {};

      const userId = String(body.userId || "").trim();
      const openingTime = String(body.openingTime || "").trim();
      const closingTime = String(body.closingTime || "").trim();

      const slotDurationMinutes = Number(body.slotDurationMinutes || 30);
      const maxDaysAhead = Number(body.maxDaysAhead || 30);

      const activeWeekdays = Array.isArray(body.activeWeekdays)
        ? body.activeWeekdays.map(Number).filter((n : any) => n >= 1 && n <= 7)
        : [];

      const blockedDates = Array.isArray(body.blockedDates)
        ? body.blockedDates
        : [];

      if (!userId || !openingTime || !closingTime) {
        return res.status(400).json({
          ok: false,
          message: "Faltan datos obligatorios.",
        });
      }

      if (!activeWeekdays.length) {
        return res.status(400).json({
          ok: false,
          message: "Debe existir al menos un día activo.",
        });
      }

      const saved = await saveCalendarSettings({
        userId,
        openingTime,
        closingTime,
        slotDurationMinutes,
        maxDaysAhead,
        timezone: body.timezone || "America/Santiago",
        activeWeekdays,
        blockedDates,
      });

      return res.json({
        ok: true,
        message: "Configuración guardada correctamente.",
        settings: saved,
      });
    } catch (error) {
      console.error("Error guardando configuración calendario:", error);

      return res.status(500).json({
        ok: false,
        message: "No se pudo guardar la configuración.",
      });
    }
  },

  async getBookings(req: Request<{ userId: string }>, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          ok: false,
          message: "userId requerido.",
        });
      }

      const bookings = await getCalendarBookingsByUserId(userId);

      return res.json({
        ok: true,
        bookings,
      });
    } catch (error) {
      console.error("Error obteniendo reservas calendario:", error);

      return res.status(500).json({
        ok: false,
        message: "No se pudieron obtener las reservas.",
      });
    }
  },
};