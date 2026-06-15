import express from "express";
import { calendarAdminController } from "./appointments-admin.controller";

const router = express.Router();

router.put("/api/calendar/settings", calendarAdminController.saveSettings);

router.get(
  "/api/calendar/settings/:userId",
  calendarAdminController.getSettings
);

router.get(
  "/api/calendar/bookings/:userId",
  calendarAdminController.getBookings
);

router.patch(
  "/api/calendar/bookings/:id/status",
  calendarAdminController.updateBookingStatus
);

export default router;