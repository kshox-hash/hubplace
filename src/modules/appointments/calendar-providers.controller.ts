import { Request, Response } from "express";
import {
  getProvidersByUserId,
  createProvider,
  updateProvider,
  deleteProvider,
} from "./calendar-providers.repository";

export const calendarProvidersController = {
  async list(req: Request, res: Response) {
    try {
      const userId = String(req.params["userId"] || "").trim();
      if (!userId) return res.status(400).json({ ok: false, message: "userId requerido." });
      const providers = await getProvidersByUserId(userId);
      return res.json({ ok: true, providers });
    } catch (error) {
      console.error("Error listando proveedores:", error);
      return res.status(500).json({ ok: false, message: "No se pudo obtener el equipo." });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { userId, name, color } = req.body || {};
      if (!userId || !name) {
        return res.status(400).json({ ok: false, message: "userId y name son requeridos." });
      }
      const provider = await createProvider({ userId: String(userId), name: String(name), color: color ? String(color) : undefined });
      return res.status(201).json({ ok: true, provider });
    } catch (error) {
      console.error("Error creando proveedor:", error);
      return res.status(500).json({ ok: false, message: "No se pudo crear el proveedor." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params["id"] || "").trim();
      const { name, color, isActive } = req.body || {};
      if (!id || !name) {
        return res.status(400).json({ ok: false, message: "id y name son requeridos." });
      }
      const provider = await updateProvider({ id, name: String(name), color: color ? String(color) : undefined, isActive });
      if (!provider) return res.status(404).json({ ok: false, message: "Proveedor no encontrado." });
      return res.json({ ok: true, provider });
    } catch (error) {
      console.error("Error actualizando proveedor:", error);
      return res.status(500).json({ ok: false, message: "No se pudo actualizar." });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = String(req.params["id"] || "").trim();
      if (!id) return res.status(400).json({ ok: false, message: "id requerido." });
      await deleteProvider(id);
      return res.json({ ok: true });
    } catch (error) {
      console.error("Error eliminando proveedor:", error);
      return res.status(500).json({ ok: false, message: "No se pudo eliminar." });
    }
  },
};
