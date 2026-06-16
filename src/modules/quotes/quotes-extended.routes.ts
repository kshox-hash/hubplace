import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { quoteServicesController } from "./quote-services/quote-services.controller";
import { quoteHistoryController } from "./quote-history/quote-history.controller";
import { quoteSendController } from "./quote-send.controller";

const router = Router();

// ── Send ──────────────────────────────────────────────────────────────────────
router.post("/quotes/send", authMiddleware, quoteSendController.send);

// ── Quote services (catálogo para cotizaciones manuales) ──────────────────────
router.get   ("/quote-services",             authMiddleware, quoteServicesController.list);
router.post  ("/quote-services",             authMiddleware, quoteServicesController.create);
router.put   ("/quote-services/:serviceId",  authMiddleware, quoteServicesController.update);
router.delete("/quote-services/:serviceId",  authMiddleware, quoteServicesController.remove);

// ── Quote history ─────────────────────────────────────────────────────────────
router.get   ("/quote-history",            authMiddleware, quoteHistoryController.list);
router.delete("/quote-history/:quoteId",   authMiddleware, quoteHistoryController.remove);

export default router;
