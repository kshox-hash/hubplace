import express from "express";
import {
  getNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "./notification.controller";

const router = express.Router();

router.get(
  "/notifications/:userId",
  getNotificationsController
);

router.patch(
  "/notifications/:userId/:notificationId/read",
  markNotificationReadController
);

router.patch(
  "/notifications/:userId/read-all",
  markAllNotificationsReadController
);

export default router;