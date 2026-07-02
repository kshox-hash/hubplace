import { ReviewsRepository } from "./reviews.repository";

export class ReviewsService {
  constructor(private repo = new ReviewsRepository()) {}

  /**
   * Crea una reseña, validando que el rating esté entre 1 y 5
   * antes de tocar la base de datos.
   */
  async create(
    userId: string,
    rating: number,
    comment?: string,
    clientName?: string,
    moduleId?: string
  ) {
    if (rating < 1 || rating > 5) {
      throw new Error("El rating debe estar entre 1 y 5");
    }
    return this.repo.create(userId, rating, comment, clientName, moduleId);
  }

  /**
   * Resumen para el DASHBOARD (no paginado).
   * Devuelve:
   * {
   *   average: 4.6,
   *   total: 24,
   *   distribution: { 5: 18, 4: 4, 3: 1, 2: 1, 1: 0 },
   *   latestReview: { ... } | null
   * }
   */
  async getSummary(userId: string) {
    const [ratingData, distribution, recent] = await Promise.all([
      this.repo.getAverageRating(userId),
      this.repo.getRatingDistribution(userId),
      this.repo.getRecent(userId, 1),
    ]);

    return {
      average: ratingData.average,
      total: ratingData.total,
      distribution,
      latestReview: recent[0] ?? null,
    };
  }

  /**
   * Lista PAGINADA de reseñas para una pantalla
   * "Ver todas las reseñas".
   *
   * @param page     número de página, empieza en 1
   * @param pageSize cantidad de reseñas por página (máx 100)
   *
   * Devuelve:
   * {
   *   data: [...reseñas de esta página...],
   *   pagination: {
   *     page, pageSize, total, totalPages, hasNextPage
   *   }
   * }
   */
  async getAll(userId: string, page: number = 1, pageSize: number = 20, portalEmail?: string, rating?: number) {
    const safePage = Math.max(page, 1);
    const safePageSize = Math.min(Math.max(pageSize, 1), 100);
    const offset = (safePage - 1) * safePageSize;
    const { rows, total } = await this.repo.getAllPaginated(userId, safePageSize, offset, portalEmail, rating);
    return {
      data: rows,
      pagination: {
        page: safePage,
        pageSize: safePageSize,
        total,
        totalPages: Math.ceil(total / safePageSize),
        hasNextPage: safePage * safePageSize < total,
      },
    };
  }

  async toggleLike(reviewId: number, portalEmail: string, portalName?: string, portalAvatar?: string) {
    return this.repo.toggleLike(reviewId, portalEmail, portalName, portalAvatar);
  }

  async getById(reviewId: number, userId: string) {
    return this.repo.getById(reviewId, userId);
  }

  async setAdminReply(reviewId: number, reply: string, userId: string) {
    return this.repo.setAdminReply(reviewId, reply, userId);
  }

  async delete(reviewId: string, userId: string) {
    return this.repo.delete(reviewId, userId);
  }
}