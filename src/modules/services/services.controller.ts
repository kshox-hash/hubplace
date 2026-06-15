import { Request, Response } from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "./services.repository";

function uid(req: Request): string {
  return String(req.params["userId"]);
}

function isForbidden(req: Request): boolean {
  return req.user?.userId !== uid(req);
}

export const servicesController = {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const services = await getServices(uid(req));
      return res.json({ ok: true, services });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async create(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const { name, description, durationMinutes, price } = req.body;
      if (!name) return res.status(400).json({ ok: false, message: "name es requerido" });
      const service = await createService(
        uid(req),
        String(name),
        description ? String(description) : null,
        Number(durationMinutes ?? 60),
        Number(price ?? 0)
      );
      return res.status(201).json({ ok: true, service });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const id = String(req.params["serviceId"]);
      const { name, description, durationMinutes, price, active } = req.body;
      if (!name) return res.status(400).json({ ok: false, message: "name es requerido" });
      const service = await updateService(
        id,
        uid(req),
        String(name),
        description ? String(description) : null,
        Number(durationMinutes ?? 60),
        Number(price ?? 0),
        active !== false
      );
      if (!service) return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
      return res.json({ ok: true, service });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async remove(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const id = String(req.params["serviceId"]);
      await deleteService(id, uid(req));
      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },
};
