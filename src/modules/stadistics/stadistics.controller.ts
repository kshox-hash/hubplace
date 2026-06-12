import { Request, Response } from "express";
import { StatisticsService } from "./stadistics.service";
import { ReviewsService } from "./reviews.service";

const statsService = new StatisticsService();
const reviewsService = new ReviewsService();

export const statisticsController = {
  async increment(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const { metric, moduleId } = req.body;

    if (!metric) {
      return res.status(400).json({ ok: false, message: "metric es requerido" });
    }

    await statsService.increment(userId, metric, moduleId);
    return res.status(200).json({ ok: true });
  },

  async getDashboard(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const data = await statsService.getDashboard(userId);
    return res.status(200).json(data);
  },

  async getHomeStats(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const data = await statsService.getHomeStats(userId);
    return res.status(200).json(data);
  },

  async getLinkOpensTrend(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const days = req.query.days ? Number(req.query.days) : 30;
    const data = await statsService.getLinkOpensTrend(userId, days);
    return res.status(200).json(data);
  },

  async getModuleRanking(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const data = await statsService.getModuleRanking(userId);
    return res.status(200).json(data);
  },

  async createReview(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const { rating, comment, clientName, moduleId } = req.body;

    if (!rating) {
      return res.status(400).json({ ok: false, message: "rating es requerido" });
    }

    const review = await reviewsService.create(userId, Number(rating), comment, clientName, moduleId);
    return res.status(201).json(review);
  },

  async getReviewsSummary(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const data = await reviewsService.getSummary(userId);
    return res.status(200).json(data);
  },

  async getAllReviews(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
    const data = await reviewsService.getAll(userId, page, pageSize);
    return res.status(200).json(data);
  },

  async deleteReview(req: Request, res: Response): Promise<Response> {
    const { userId, reviewId } = req.params;
    await reviewsService.delete(reviewId, userId);
    return res.status(200).json({ ok: true });
  },
};
