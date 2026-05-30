import { Request, Response } from "express";
import { notificationService } from "./notification.service";

export const getNotificationsController = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const limit = Number(req.query.limit ?? 30);

    const notifications = await notificationService.findByUserId(userId, limit);
    const unreadCount = await notificationService.countUnread(userId);

    return res.json({
      ok: true,
      unreadCount,
      notifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error?.message || "No se pudieron cargar las notificaciones.",
    });
  }
};

export const markNotificationReadController = async (
  req: Request<{ userId: string; notificationId: string }>,
  res: Response
) => {
  try {
    await notificationService.markAsRead(
      req.params.notificationId,
      req.params.userId
    );

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error?.message || "No se pudo marcar como leída.",
    });
  }
};

export const markAllNotificationsReadController = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    await notificationService.markAllAsRead(req.params.userId);

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error?.message || "No se pudieron marcar como leídas.",
    });
  }
};