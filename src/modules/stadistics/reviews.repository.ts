import DB from "../../db/db_configuration";

export class ReviewsRepository {
  private pool = DB.getPool();

  /**
   * Crea una nueva reseña.
   *
   * @param userId      dueño del negocio (a quién le dejan la reseña)
   * @param rating      número del 1 al 5
   * @param comment     comentario opcional
   * @param clientName  nombre opcional de quien deja la reseña
   * @param moduleId    opcional: si la reseña es sobre un módulo
   *                    específico (ej. 'cotizador', 'agenda')
   */
  async create(
    userId: string,
    rating: number,
    comment?: string | null,
    clientName?: string | null,
    moduleId?: string | null
  ) {
    const result = await this.pool.query(
      `
      INSERT INTO reviews (user_id, rating, comment, client_name, module_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, rating, comment, client_name, module_id, created_at
      `,
      [userId, rating, comment ?? null, clientName ?? null, moduleId ?? null]
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
      `
      SELECT id, rating, comment, client_name, module_id, created_at
      FROM reviews
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      `,
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
  async getAllPaginated(userId: string, limit: number = 20, offset: number = 0) {
    const [dataResult, countResult] = await Promise.all([
      this.pool.query(
        `
        SELECT id, rating, comment, client_name, module_id, created_at
        FROM reviews
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [userId, limit, offset]
      ),
      this.pool.query(
        `SELECT COUNT(*) AS total FROM reviews WHERE user_id = $1`,
        [userId]
      ),
    ]);

    return {
      rows: dataResult.rows,
      total: Number(countResult.rows[0].total),
    };
  }

  /**
   * Borra una reseña (ej. moderación).
   * Se exige userId también para que un usuario no pueda
   * borrar reseñas de otro usuario por error.
   */
  async delete(reviewId: string, userId: string) {
    await this.pool.query(
      `DELETE FROM reviews WHERE id = $1 AND user_id = $2`,
      [reviewId, userId]
    );
  }
}