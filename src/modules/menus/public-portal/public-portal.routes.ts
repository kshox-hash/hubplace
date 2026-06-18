import { Router } from "express";
import { publicPortalController } from "./public-portal.controller";
import { quotesSubmitController } from "../../quotes/quotes.controller";
import { portalSessionMiddleware } from "./portal-session.middleware";

const router = Router();

router.get("/shop/:publicSlug",           publicPortalController.open);
router.get("/shop/:publicSlug/cotizador", publicPortalController.openQuotes);
router.post("/api/public/:publicSlug/auth", publicPortalController.portalSignIn);
router.post("/shop/:publicSlug/quotes/submit", portalSessionMiddleware, quotesSubmitController.submit);
router.post("/api/public/:publicSlug/reviews", publicPortalController.submitReview);

export default router;