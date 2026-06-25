import express from "express";
import multer from "multer";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { galleryController } from "./gallery.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post  ("/api/gallery",                          authMiddleware, upload.single("photo"), galleryController.upload);
router.get   ("/api/gallery",                          authMiddleware, galleryController.list);
router.put   ("/api/gallery/:id",                      authMiddleware, galleryController.updateDescription);
router.delete("/api/gallery/:id",                      authMiddleware, galleryController.remove);
router.get   ("/api/public/:publicSlug/gallery",       galleryController.listPublic);

export default router;
