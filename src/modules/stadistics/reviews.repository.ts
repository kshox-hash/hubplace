import DB from "../../db/db_configuration";

export async function initReviewsGoogleColumns(): Promise<void> {
  const pool = DB.getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id              SERIAL PRIMARY KEY,
      user_id         TEXT        NOT NULL,
      rating          INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment         TEXT,
      client_name     TEXT,
      module_id       TEXT,
      google_name     TEXT,
      google_email    TEXT,
      google_avatar_url TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    ALTER TABLE reviews
      ADD COLUMN IF NOT EXISTS google_name       TEXT,
      ADD COLUMN IF NOT EXISTS google_email      TEXT,
      ADD COLUMN IF NOT EXISTS google_avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS admin_reply       TEXT,
      ADD COLUMN IF NOT EXISTS admin_replied_at  TIMESTAMPTZ
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS review_likes (
      id           SERIAL PRIMARY KEY,
      review_id    INTEGER     NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
      portal_email TEXT        NOT NULL,
      portal_name  TEXT,
      portal_avatar TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(review_id, portal_email)
    )
  `);
  await pool.query(`
    ALTER TABLE review_likes
      ADD COLUMN IF NOT EXISTS portal_name   TEXT,
      ADD COLUMN IF NOT EXISTS portal_avatar TEXT
  `);
}

export class ReviewsRepository {
  private pool = DB.getPool();

  async create(
    userId: string,
    rating: number,
    comment?: string | null,
    clientName?: string | null,
    moduleId?: string | null,
    googleName?: string | null,
    googleEmail?: string | null,
    googleAvatarUrl?: string | null,
  ) {
    const result = await this.pool.query(
      `INSERT INTO reviews
         (user_id, rating, comment, client_name, module_id,
          google_name, google_email, google_avatar_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, user_id, rating, comment, client_name,
                 google_name, google_email, google_avatar_url, created_at`,
      [userId, rating, comment ?? null, clientName ?? null, moduleId ?? null,
       googleName ?? null, googleEmail ?? null, googleAvatarUrl ?? null]
    );
    return result.rows[0];
  }

  /**
   * Promedio de estrellas + cantidad total de reseñas.
   * Esto es lo que alimenta el "4.6 / 5, basado en 24 reseñas".
   *
   * Si el usuario no tiene reseñas, AVG devuelve NULL, por eso
   * se hace el chequeo antes de convertir a Number.
   */
  async getAverageRating(userId: string) {
    const result = await this.pool.query(
      `
      SELECT
        ROUND(AVG(rating)::numeric, 1) AS average,
        COUNT(*) AS total
      FROM reviews
      WHERE user_id = $1
      `,
      [userId]
    );

    const row = result.rows[0];

    return {
      average: row.average ? Number(row.average) : 0,
      total: Number(row.total),
    };
  }

  /**
   * Distribución de estrellas: cuántas reseñas de 1, 2, 3, 4, 5.
   * Útil para un gráfico de barras tipo "5★: 18, 4★: 4, ...".
   *
   * Siempre devuelve las 5 claves (1 al 5), aunque alguna tenga 0,
   * para que el frontend no tenga que validar claves faltantes.
   */
  async getRatingDistribution(userId: string) {
    const result = await this.pool.query(
      `
      SELECT rating, COUNT(*) AS count
      FROM reviews
      WHERE user_id = $1
      GROUP BY rating
      ORDER BY rating DESC
      `,
      [userId]
    );

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const row of result.rows) {
      distribution[row.rating] = Number(row.count);
    }
    return distribution;
  }

  /**
   * Últimas N reseñas (sin paginación, pensado para
   * "última reseña destacada" en el dashboard, donde
   * normalmente N=1 o N=3).
   */
  async getRecent(userId: string, limit: number = 5) {
    const result = await this.pool.query(
      `SELECT id, rating, comment, client_name,
              google_name, google_email, google_avatar_url,
              admin_reply, admin_replied_at, created_at
       FROM reviews WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  /**
   * NUEVO: lista paginada de reseñas + el total de registros.
   *
   * Se hacen 2 queries en paralelo:
   * - dataResult: la página solicitada (LIMIT/OFFSET)
   * - countResult: el total de filas (para calcular totalPages)
   *
   * Esto es lo que se usa para una pantalla "Ver todas las reseñas"
   * con paginación, distinto del dashboard que solo necesita
   * el promedio + 1 reseña reciente.
   */
  async getAllPaginated(userId: string, limit: number = 20, offset: number = 0, portalEmail?: string, rating?: number, unanswered?: boolean) {
    const ratingClause = rating && rating >= 1 && rating <= 5 ? ` AND rating = ${Math.floor(rating)}` : '';
    const unansweredClause = unanswered ? ` AND admin_reply IS NULL` : '';
    const [dataResult, countResult] = await Promise.all([
      this.pool.query(
        `SELECT r.id, r.rating, r.comment, r.client_name,
                r.google_name, r.google_email, r.google_avatar_url,
                r.admin_reply, r.admin_replied_at, r.created_at,
                COUNT(rl.id)::int AS likes_count,
                ${portalEmail ? `MAX(CASE WHEN rl2.portal_email = $4 THEN 1 ELSE 0 END)::boolean AS user_liked` : `false AS user_liked`},
                ${portalEmail ? `bool_or(r.google_email = $4) AS is_own` : `false AS is_own`},
                (SELECT COALESCE(json_agg(json_build_object('avatar',lk.portal_avatar,'name',lk.portal_name) ORDER BY lk.created_at ASC),'[]'::json)
                 FROM (SELECT portal_avatar,portal_name,created_at FROM review_likes WHERE review_id=r.id ORDER BY created_at ASC LIMIT 3) lk
                ) AS top_likers
         FROM reviews r
         LEFT JOIN review_likes rl ON rl.review_id = r.id
         ${portalEmail ? `LEFT JOIN review_likes rl2 ON rl2.review_id = r.id AND rl2.portal_email = $4` : ''}
         WHERE r.user_id = $1${ratingClause}${unansweredClause}
         GROUP BY r.id
         ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`,
        portalEmail ? [userId, limit, offset, portalEmail] : [userId, limit, offset]
      ),
      this.pool.query(
        `SELECT COUNT(*) AS total FROM reviews WHERE user_id = $1${ratingClause}${unansweredClause}`,
        [userId]
      ),
    ]);

    return {
      rows: dataResult.rows,
      total: Number(countResult.rows[0].total),
    };
  }

  async toggleLike(
    reviewId: number,
    portalEmail: string,
    portalName?: string,
    portalAvatar?: string,
  ): Promise<{ liked: boolean; likes: number; likers: Array<{ avatar: string | null; name: string | null }> }> {
    const existing = await this.pool.query(
      `SELECT id FROM review_likes WHERE review_id = $1 AND portal_email = $2`,
      [reviewId, portalEmail]
    );
    if (existing.rows.length > 0) {
      await this.pool.query(`DELETE FROM review_likes WHERE review_id = $1 AND portal_email = $2`, [reviewId, portalEmail]);
    } else {
      await this.pool.query(
        `INSERT INTO review_likes (review_id, portal_email, portal_name, portal_avatar) VALUES ($1, $2, $3, $4)`,
        [reviewId, portalEmail, portalName ?? null, portalAvatar ?? null]
      );
    }
    const [countRes, likersRes] = await Promise.all([
      this.pool.query(`SELECT COUNT(*)::int AS cnt FROM review_likes WHERE review_id = $1`, [reviewId]),
      this.pool.query(
        `SELECT portal_avatar AS avatar, portal_name AS name FROM review_likes WHERE review_id = $1 ORDER BY created_at ASC LIMIT 3`,
        [reviewId]
      ),
    ]);
    return { liked: existing.rows.length === 0, likes: countRes.rows[0].cnt, likers: likersRes.rows };
  }

  async getById(reviewId: number, userId: string): Promise<{ id: number; google_email: string | null; google_name: string | null; comment: string | null } | null> {
    const res = await this.pool.query(
      `SELECT id, google_email, google_name, comment FROM reviews WHERE id = $1 AND user_id = $2`,
      [reviewId, userId]
    );
    return res.rows[0] ?? null;
  }

  async setAdminReply(reviewId: number, reply: string, userId: string): Promise<void> {
    await this.pool.query(
      `UPDATE reviews SET admin_reply = $1, admin_replied_at = NOW() WHERE id = $2 AND user_id = $3`,
      [reply || null, reviewId, userId]
    );
  }

  async updateOwnReview(reviewId: number, portalEmail: string, rating: number, comment: string | null): Promise<boolean> {
    const res = await this.pool.query(
      `UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 AND google_email = $4`,
      [rating, comment, reviewId, portalEmail]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async deleteOwnReview(reviewId: number, portalEmail: string): Promise<boolean> {
    const res = await this.pool.query(
      `DELETE FROM reviews WHERE id = $1 AND google_email = $2`,
      [reviewId, portalEmail]
    );
    return (res.rowCount ?? 0) > 0;
  }

}