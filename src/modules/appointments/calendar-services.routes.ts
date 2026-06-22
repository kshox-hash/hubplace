import express from "express";
import multer from "multer";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { calendarServicesController } from "./calendar-services.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get   ("/api/calendar/services",                          authMiddleware, calendarServicesController.list);
router.post  ("/api/calendar/services",                          authMiddleware, calendarServicesController.create);
router.put   ("/api/calendar/services/:id",                      authMiddleware, calendarServicesController.update);
router.delete("/api/calendar/services/:id",                      authMiddleware, calendarServicesController.remove);
router.post  ("/api/calendar/services/:id/photos",               authMiddleware, upload.single("photo"), calendarServicesController.uploadPhoto);
router.delete("/api/calendar/services/:id/photos",               authMiddleware, calendarServicesController.deletePhoto);

export default router;
