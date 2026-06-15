import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { mpConnectController } from "./mp-connect.controller";

const router = express.Router();

// OAuth callback — sin auth (viene de MercadoPago)
router.get("/auth/mp/callback", mpConnectController.callback);

// Rutas autenticadas
router.get("/api/payments/mp-connect-url",         authMiddleware, mpConnectController.getConnectUrl);
router.get("/api/payments/mp-status/:userId",       authMiddleware, mpConnectController.getStatus);
router.delete("/api/payments/mp-connection/:userId", authMiddleware, mpConnectController.disconnect);

export default router;
