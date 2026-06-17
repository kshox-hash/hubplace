import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { calendarServicesController } from "./calendar-services.controller";

const router = express.Router();

router.get   ("/api/calendar/services",      authMiddleware, calendarServicesController.list);
router.post  ("/api/calendar/services",      authMiddleware, calendarServicesController.create);
router.put   ("/api/calendar/services/:id",  authMiddleware, calendarServicesController.update);
router.delete("/api/calendar/services/:id",  authMiddleware, calendarServicesController.remove);

export default router;
