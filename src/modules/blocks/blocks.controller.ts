import { Request, Response } from "express";
import { getBlocks, createBlock, deleteBlock } from "./blocks.repository";

function uid(req: Request): string {
  return String(req.params["userId"]);
}

function isForbidden(req: Request): boolean {
  return req.user?.userId !== uid(req);
}

export const blocksController = {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const blocks = await getBlocks(uid(req));
      return res.json({ ok: true, blocks });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async create(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const { startAt, endAt, reason } = req.body;
      if (!startAt || !endAt) {
        return res.status(400).json({ ok: false, message: "startAt y endAt son requeridos" });
      }
      if (new Date(endAt) <= new Date(startAt)) {
        return res.status(400).json({ ok: false, message: "endAt debe ser posterior a startAt" });
      }
      const block = await createBlock(
        uid(req),
        String(startAt),
        String(endAt),
        reason ? String(reason) : null
      );
      return res.status(201).json({ ok: true, block });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },

  async remove(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const id = String(req.params["blockId"]);
      await deleteBlock(id, uid(req));
      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ ok: false, message: e?.message });
    }
  },
};
