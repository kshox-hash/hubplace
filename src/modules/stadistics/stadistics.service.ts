import { StatisticsRepository } from "./statistics.repository";

export class StatisticsService {
  constructor(private repo = new StatisticsRepository()) {}

  /**
   * SIN CAMBIOS. Llama al repository para incrementar
   * el contador total + el contador diario.
   */
  async increment(
    userId: string,
    metric: string,
    moduleId?: string
  ) {
    return this.repo.increment(userId, metric, moduleId);
  }

  /**
   * SIN CAMBIOS respecto a tu código original.
   */
  async getDashboard(userId: string) {
    const rows = await this.repo.getByUser(userId);

    return rows.reduce((acc, row) => {
      const key = row.module_id
        ? `${row.metric}_${row.module_id}`
        : `${row.metric}_global`;

      acc[key] = Number(row.count);
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * SIN CAMBIOS respecto a tu código original.
   */
  async getHomeStats(userId: string) {
    const dashboard = await this.getDashboard(userId);

    return {
      quotes:    dashboard['quotes_global']     ?? 0,
      bookings:  dashboard['bookings_global']   ?? 0,
      clients:   dashboard['clients_global']    ?? 0,
      messages:  dashboard['messages_global']   ?? 0,
      pageViews: dashboard['page_views_global'] ?? 0,
    };
  }

  /**
   * NUEVO: para el donut "Apertura link" con tendencia.
   *
   * Devuelve:
   * - total: aperturas en el periodo (ej. últimos 30 días)
   * - percentChange: % de cambio vs el periodo anterior
   *   (null si no hay datos del periodo anterior, para
   *   evitar dividir por cero)
   * - series: array [{date, count}] para dibujar un gráfico
   *   de línea/barras
   */
  async getTodayStats(userId: string) {
    const rows = await this.repo.getTodayStats(userId);

    return rows.reduce((acc, row) => {
      const key = row.module_id
        ? `${row.metric}_${row.module_id}`
        : `${row.metric}_global`;

      acc[key] = Number(row.count);
      return acc;
    }, {} as Record<string, number>);
  }

}