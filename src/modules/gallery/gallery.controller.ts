import { Request, Response } from "express";
import cloudinary from "../../config/cloudinary.config";
import { getSlugByValueService } from "../slug/slug.service";
import {
  addGalleryPhoto,
  getGalleryPhotosByUserId,
  updateGalleryPhotoDescription,
  deleteGalleryPhoto,
} from "./gallery.repository";

export const galleryController = {

  async upload(req: Request, res: Response) {
    try {
      const userId = String(req.user?.userId ?? "").trim();
      const file   = (req as any).file as Express.Multer.File | undefined;
      if (!file) return res.status(400).json({ ok: false, message: "No se recibió ninguna imagen." });

      const description = req.body?.description
        ? String(req.body.description).trim() || null
        : null;

      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `gallery/${userId}`,
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: 70, fetch_format: "auto" },
            ],
          },
          (err, result) => {
            if (err || !result) return reject(err ?? new Error("Upload failed"));
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      const photo = await addGalleryPhoto(userId, uploadResult.secure_url, description);
      return res.json({ ok: true, photo });
    } catch (err) {
      console.error("[gallery] upload:", err);
      return res.status(500).json({ ok: false, message: "No se pudo subir la foto." });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = String(req.user?.userId ?? "").trim();
      const photos = await getGalleryPhotosByUserId(userId);
      return res.json({ ok: true, photos });
    } catch (err) {
      console.error("[gallery] list:", err);
      return res.status(500).json({ ok: false, message: "Error al obtener la galería." });
    }
  },

  async updateDescription(req: Request, res: Response) {
    try {
      const userId      = String(req.user?.userId ?? "").trim();
      const id          = String(req.params["id"] || "").trim();
      const description = req.body?.description
        ? String(req.body.description).trim() || null
        : null;

      const photo = await updateGalleryPhotoDescription(id, userId, description);
      if (!photo) return res.status(404).json({ ok: false, message: "Foto no encontrada." });
      return res.json({ ok: true, photo });
    } catch (err) {
      console.error("[gallery] updateDescription:", err);
      return res.status(500).json({ ok: false, message: "Error al actualizar." });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const userId = String(req.user?.userId ?? "").trim();
      const id     = String(req.params["id"] || "").trim();

      const url = await deleteGalleryPhoto(id, userId);
      if (!url) return res.status(404).json({ ok: false, message: "Foto no encontrada." });

      const publicId = url.split("/upload/")[1]?.replace(/\.[^.]+$/, "");
      if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});

      return res.json({ ok: true });
    } catch (err) {
      console.error("[gallery] remove:", err);
      return res.status(500).json({ ok: false, message: "Error al eliminar." });
    }
  },

  async listPublic(req: Request, res: Response) {
    try {
      const publicSlug = String(req.params["publicSlug"] || "").trim();
      const slug = await getSlugByValueService(publicSlug);
      if (!slug) return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
      const photos = await getGalleryPhotosByUserId(slug.user_id);
      return res.json({ ok: true, photos });
    } catch (err) {
      console.error("[gallery] listPublic:", err);
      return res.status(500).json({ ok: false, message: "Error al obtener la galería." });
    }
  },
};
