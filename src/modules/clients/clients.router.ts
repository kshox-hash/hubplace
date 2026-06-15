import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { clientsController } from "./clients.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/clients/:userId",                  clientsController.list);
router.get("/clients/:userId/:email/bookings",  clientsController.bookings);
router.post("/clients/:userId/email",           clientsController.sendEmail);

export default router;
