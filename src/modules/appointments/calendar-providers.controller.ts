import { Request, Response } from "express";
import {
  getProvidersByUserId,
  createProvider,
  updateProvider,
  deleteProvider,
} from "./calendar-providers.repository";
import {
  getProviderAvailability,
  saveProviderAvailability,
  clearProviderAvailability,
} from "./appointments-admin.repository";

export const calendarProvidersController = {
  async list(req: Request, res: Response) {
    try {
      const userId     = String(req.params["userId"] || "").trim();
      const authUserId = String(req.user?.userId ?? "").trim();

      if (!userId) return res.status(400).json({ ok: false, message: "userId requerido." });
      if (userId !== authUserId) return res.status(403).json({ ok: false, message: "Sin permisos." });

      const providers = await getProvidersByUserId(userId);
      return res.json({ ok: true, providers });
    } catch (error) {
      console.error("Error listando proveedores:", error);
      return res.status(500).json({ ok: false, message: "No se pudo obtener el equipo." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userId = String(req.user?.userId ?? "").trim();
      if (!userId) return res.status(401).json({ ok: false, message: "No autorizado." });

      const { name } = req.body || {};
      if (!name) return res.status(400).json({ ok: false, message: "name es requerido." });

      const provider = await createProvider({ userId, name: String(name) });
      return res.status(201).json({ ok: true, provider });
    } catch (error) {
      console.error("Error creando proveedor:", error);
      return res.status(500).json({ ok: false, message: "No se pudo crear el proveedor." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id         = String(req.params["id"] || "").trim();
      const authUserId = String(req.user?.userId ?? "").trim();
      const { name, isActive } = req.body || {};

      if (!id || !name) return res.status(400).json({ ok: false, message: "id y name son requeridos." });

      const provider = await updateProvider({ id, name: String(name), isActive, userId: authUserId });
      if (!provider) return res.status(404).json({ ok: false, message: "Proveedor no encontrado." });

      return res.json({ ok: true, provider });
    } catch (error) {
      console.error("Error actualizando proveedor:", error);
      return res.status(500).json({ ok: false, message: "No se pudo actualizar." });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id         = String(req.params["id"] || "").trim();
      const authUserId = String(req.user?.userId ?? "").trim();

      if (!id) return res.status(400).json({ ok: false, message: "id requerido." });

      await deleteProvider(id, authUserId);
      return res.json({ ok: true });
    } catch (error) {
      console.error("Error eliminando proveedor:", error);
      return res.status(500).json({ ok: false, message: "No se pudo eliminar." });
    }
  },

  async getAvailability(req: Request, res: Response) {
    try {
      const id     = String(req.params["id"] || "").trim();
      const userId = String(req.user?.userId ?? "").trim();
      if (!id) return res.status(400).json({ ok: false, message: "id requerido." });

      const rows = await getProviderAvailability(userId, id);
      return res.json({ ok: true, availability: rows });
    } catch (error) {
      console.error("Error obteniendo horario del profesional:", error);
      return res.status(500).json({ ok: false, message: "No se pudo obtener el horario." });
    }
  },

  async saveAvailability(req: Request, res: Response) {
    try {
      const id     = String(req.params["id"] || "").trim();
      const userId = String(req.user?.userId ?? "").trim();
      const { activeWeekdays, openingTime, closingTime, slotDurationMinutes, useGlobal } = req.body || {};

      if (!id) return res.status(400).json({ ok: false, message: "id requerido." });

      if (useGlobal) {
        await clearProviderAvailability(userId, id);
        return res.json({ ok: true, useGlobal: true });
      }

      if (!Array.isArray(activeWeekdays) || !openingTime || !closingTime) {
        return res.status(400).json({ ok: false, message: "Datos de horario incompletos." });
      }

      await saveProviderAvailability({
        userId,
        providerId: id,
        activeWeekdays: activeWeekdays.map(Number),
        openingTime: String(openingTime),
        closingTime: String(closingTime),
        slotDurationMinutes: Number(slotDurationMinutes || 30),
      });

      return res.json({ ok: true });
    } catch (error) {
      console.error("Error guardando horario del profesional:", error);
      return res.status(500).json({ ok: false, message: "No se pudo guardar el horario." });
    }
  },
};
