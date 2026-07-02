import { Request, Response } from "express";
import { StatisticsService } from "./stadistics.service";
import { ReviewsService } from "./reviews.service";
import {
  getRevenueStats,
  getBusiestSlots,
  getClientStats,
  getReviewsStats,
  getQuotesStats,
  getPortalStats,
  getPendingBookingsStats,
} from "./booking-stats.repository";

const statsService = new StatisticsService();
const reviewsService = new ReviewsService();

function uid(req: Request): string {
  return String(req.params["userId"]);
}

function isForbidden(req: Request): boolean {
  return req.user?.userId !== uid(req);
}

export const statisticsController = {
  async increment(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const { metric, moduleId } = req.body;
      if (!metric) return res.status(400).json({ ok: false, message: "metric es requerido" });
      await statsService.increment(uid(req), metric, moduleId);
      return res.status(200).json({ ok: true });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getDashboard(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const data = await statsService.getDashboard(uid(req));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getHomeStats(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const data = await statsService.getHomeStats(uid(req));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getTodayStats(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const data = await statsService.getTodayStats(uid(req));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async createReview(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const { rating, comment, clientName, moduleId } = req.body;
      if (!rating) return res.status(400).json({ ok: false, message: "rating es requerido" });
      const review = await reviewsService.create(uid(req), Number(rating), comment, clientName, moduleId);
      return res.status(201).json(review);
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getReviewsSummary(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const data = await reviewsService.getSummary(uid(req));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getAllReviews(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
      const data = await reviewsService.getAll(uid(req), page, pageSize);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async deleteReview(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const reviewId = req.params["reviewId"] as string;
      await reviewsService.delete(reviewId, uid(req));
      return res.status(200).json({ ok: true });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getBusinessStats(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const userId = uid(req);
      const [revenue, portal, busiestSlots, clients, reviews, quotes, pending] = await Promise.all([
        getRevenueStats(userId),
        getPortalStats(userId),
        getBusiestSlots(userId),
        getClientStats(userId),
        getReviewsStats(userId),
        getQuotesStats(userId),
        getPendingBookingsStats(userId),
      ]);
      return res.json({ ok: true, revenue, portal, busiestSlots, clients, reviews, quotes, pending });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getLinkOpensDaily(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const days = Math.min(Math.max(parseInt(String(req.query["days"] || "30"), 10) || 30, 7), 90);
      const repo = new (await import("./statistics.repository")).StatisticsRepository();
      const rows = await repo.getDailyHistory(uid(req), "link_opens", days, null);
      return res.json({ ok: true, days: rows });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async getPublicReviews(req: Request, res: Response): Promise<Response> {
    try {
      const userId = String(req.params["userId"]);
      const page = Math.max(1, parseInt(String(req.query["page"] || "1"), 10) || 1);
      const portalUser = (req as any).portalUser as { email?: string } | undefined;
      const portalEmail = portalUser?.email;
      const [summary, recent] = await Promise.all([
        page === 1 ? reviewsService.getSummary(userId) : Promise.resolve(null),
        reviewsService.getAll(userId, page, 10, portalEmail),
      ]);
      return res.json({ ok: true, summary, reviews: recent.data, pagination: recent.pagination });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async likeReview(req: Request, res: Response): Promise<Response> {
    try {
      const portalUser = (req as any).portalUser as { email?: string; name?: string; picture?: string } | undefined;
      if (!portalUser?.email) return res.status(401).json({ ok: false, message: "Sesión requerida" });
      const reviewId = parseInt(String(req.params["reviewId"]), 10);
      if (!reviewId) return res.status(400).json({ ok: false, message: "reviewId inválido" });
      const result = await reviewsService.toggleLike(reviewId, portalUser.email, portalUser.name, portalUser.picture);
      return res.json({ ok: true, ...result });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },

  async replyToReview(req: Request, res: Response): Promise<Response> {
    try {
      if (isForbidden(req)) return res.status(403).json({ ok: false, message: "Forbidden" });
      const reviewId = parseInt(String(req.params["reviewId"]), 10);
      if (!reviewId) return res.status(400).json({ ok: false, message: "reviewId inválido" });
      const reply = typeof req.body.reply === "string" ? req.body.reply.trim() : "";
      await reviewsService.setAdminReply(reviewId, reply, uid(req));
      return res.json({ ok: true });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
    }
  },
};
