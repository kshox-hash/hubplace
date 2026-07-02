import { Router } from "express";
import { publicPortalController } from "./public-portal.controller";
import { quotesSubmitController } from "../../quotes/quotes.controller";
import { portalSessionMiddleware } from "./portal-session.middleware";
import { statisticsController } from "../../stadistics/stadistics.controller";

const router = Router();

router.get("/shop/:publicSlug",           publicPortalController.open);
router.get("/shop/:publicSlug/cotizador", publicPortalController.openQuotes);
router.post("/shop/:publicSlug/quotes/submit", portalSessionMiddleware, quotesSubmitController.submit);
router.post("/api/public/:publicSlug/reviews", portalSessionMiddleware, publicPortalController.submitReview);
router.patch("/api/public/:publicSlug/reviews/:reviewId", portalSessionMiddleware, publicPortalController.editOwnReview);
router.delete("/api/public/:publicSlug/reviews/:reviewId", portalSessionMiddleware, publicPortalController.deleteOwnReview);
router.post("/api/public/:publicSlug/reviews/:reviewId/like", portalSessionMiddleware, statisticsController.likeReview);
router.get("/api/public/reviews/:userId", portalSessionMiddleware, statisticsController.getPublicReviews);

export default router;