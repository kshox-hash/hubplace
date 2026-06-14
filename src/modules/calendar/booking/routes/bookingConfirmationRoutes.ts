import express from "express";

import { confirmBookingByToken } from "../services/bookingConfirmation.service";
import { renderBookingConfirmationSuccessHtml } from "../views/bookingConfirmationSuccessHtml";
import { renderBookingConfirmationErrorHtml } from "../views/bookingConfirmationErrorHtml";

const router = express.Router();

router.get("/api/bookings/confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const result = await confirmBookingByToken(token);

    if (!result.ok) {
      return res
        .status(400)
        .send(renderBookingConfirmationErrorHtml(result.message));
    }

    return res.send(renderBookingConfirmationSuccessHtml());
  } catch (error) {
    console.error("Error confirmando reserva:", error);

    return res
      .status(500)
      .send(
        renderBookingConfirmationErrorHtml(
          "Ocurrió un error confirmando la reserva."
        )
      );
  }
});

export default router;