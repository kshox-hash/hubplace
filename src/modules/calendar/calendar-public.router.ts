import express from "express";
import { calendarPublicController } from "./calendar-public.controller";
import { confirmBookingByToken } from "./booking/services/bookingConfirmation.service";
import { renderBookingConfirmationSuccessHtml } from "./booking/views/bookingConfirmationSuccessHtml";
import { renderBookingConfirmationErrorHtml } from "./booking/views/bookingConfirmationErrorHtml";

const router = express.Router();

// Página pública de reservas
router.get("/open/:publicSlug/reservas", calendarPublicController.openReservas);

// Slots disponibles
router.get("/api/public/:publicSlug/slots", calendarPublicController.getSlots);

// Crear reserva
router.post("/api/public/:publicSlug/bookings", calendarPublicController.createBooking);

// Crear pago para una reserva
router.post(
  "/api/public/:publicSlug/bookings/:bookingId/pay",
  calendarPublicController.createPayment
);

// Confirmación de reserva por token (email)
router.get("/api/bookings/confirm/:token", async (req, res) => {
  try {
    const token = String(req.params["token"] || "");
    const result = await confirmBookingByToken(token);

    if (!result.ok) {
      return res.status(400).send(renderBookingConfirmationErrorHtml(result.message));
    }

    return res.send(renderBookingConfirmationSuccessHtml());
  } catch (error) {
    console.error("[calendar] Error confirmando reserva:", error);
    return res.status(500).send(
      renderBookingConfirmationErrorHtml("Ocurrió un error confirmando la reserva.")
    );
  }
});

export default router;
