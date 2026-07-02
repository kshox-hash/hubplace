import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { statisticsController } from "./stadistics.controller";

const router = express.Router();

// Rutas públicas (sin auth)
router.get("/public/reviews/:userId", statisticsController.getPublicReviews);

router.use(authMiddleware);

// Stats
router.post("/stats/:userId/increment", statisticsController.increment);
router.get("/stats/:userId/dashboard", statisticsController.getDashboard);
router.get("/stats/:userId/home", statisticsController.getHomeStats);
router.get("/stats/:userId/today", statisticsController.getTodayStats);

// Reviews — summary must be before /:userId to avoid route conflict
router.get("/stats/:userId/business", statisticsController.getBusinessStats);
router.get("/stats/:userId/link-opens-daily", statisticsController.getLinkOpensDaily);
router.get("/stats/:userId/reviews/summary", statisticsController.getReviewsSummary);
router.post("/stats/:userId/reviews", statisticsController.createReview);
router.get("/stats/:userId/reviews", statisticsController.getAllReviews);
router.delete("/stats/:userId/reviews/:reviewId", statisticsController.deleteReview);
router.patch("/stats/:userId/reviews/:reviewId/reply", statisticsController.replyToReview);

export default router;
 