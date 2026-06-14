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
  async getLinkOpensTrend(userId: string, days: number = 30) {
    const metric = 'page_views';

    const [history, comparison] = await Promise.all([
      this.repo.getDailyHistory(userId, metric, days, null),
      this.repo.getPeriodComparison(userId, metric, days, null),
    ]);

    const current = Number(comparison.current_period) || 0;
    const previous = Number(comparison.previous_period) || 0;

    const percentChange = previous > 0
      ? Math.round(((current - previous) / previous) * 100)
      : null;

    return {
      total: current,
      percentChange,
      series: history.map(row => ({
        date: row.day,
        count: Number(row.count),
      })),
    };
  }

  /**
   * NUEVO: ranking de módulos por visitas (más visitado / menos visitado)
   *
   * IMPORTANTE: esto asume que cuando registras una visita a un
   * módulo lo haces con metric = 'module_visits' y moduleId = el
   * módulo correspondiente (ej. 'cotizador', 'agenda').
   * Si usas otro nombre de métrica, cambia el string de abajo.
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

  async getModuleRanking(userId: string) {
  const dashboard = await this.getDashboard(userId);

  const moduleEntries = (Object.entries(dashboard) as [string, number][])
    .filter(([key]) => key.startsWith('module_visits_'))
    .map(([key, count]) => ({
      moduleId: key.replace('module_visits_', ''),
      count,
    }));

  const total = moduleEntries.reduce((sum, m) => sum + m.count, 0);

  return moduleEntries
    .map(m => ({
      ...m,
      percentage: total > 0 ? Math.round((m.count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}
}