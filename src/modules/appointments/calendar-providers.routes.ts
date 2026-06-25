import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { calendarProvidersController } from "./calendar-providers.controller";

const router = express.Router();

router.get("/api/calendar/providers/:userId",              authMiddleware, calendarProvidersController.list);
router.post("/api/calendar/providers",                     authMiddleware, calendarProvidersController.create);
router.put("/api/calendar/providers/:id",                  authMiddleware, calendarProvidersController.update);
router.delete("/api/calendar/providers/:id",               authMiddleware, calendarProvidersController.remove);
router.get("/api/calendar/providers/:id/availability",     authMiddleware, calendarProvidersController.getAvailability);
router.put("/api/calendar/providers/:id/availability",     authMiddleware, calendarProvidersController.saveAvailability);

export default router;
