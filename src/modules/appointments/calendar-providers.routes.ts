import express from "express";
import { calendarProvidersController } from "./calendar-providers.controller";

const router = express.Router();

router.get("/api/calendar/providers/:userId", calendarProvidersController.list);
router.post("/api/calendar/providers", calendarProvidersController.create);
router.put("/api/calendar/providers/:id", calendarProvidersController.update);
router.delete("/api/calendar/providers/:id", calendarProvidersController.remove);

export default router;
