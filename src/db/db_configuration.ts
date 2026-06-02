// src/db/db_configuration.ts
import { Pool, PoolClient } from "pg";

type TxFn<T> = (client: PoolClient) => Promise<T>;

export default class DB {
  private static pool: Pool | null = null;

  static getPool(): Pool {
    if (!DB.pool) {
      DB.pool = new Pool({
        host: process.env.PGHOST ?? "dpg-d7h6ejhkh4rs73ajulsg-a.oregon-postgres.render.com",
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER ?? "kshox",
        password: process.env.PGPASSWORD ?? "NkvUunzoK4IHVqdvaaboM925AaA5K9HG",
        database: process.env.PGDATABASE ?? "automatizafacildb_4h5y",
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
         ssl: {
            rejectUnauthorized: false,
          },
      });

      DB.pool.on("error", (err) => {
        console.error("PostgreSQL pool error:", err);
      });
    }

    return DB.pool;
  }

  static async testConnection(): Promise<void> {
    const pool = DB.getPool();
    const result = await pool.query("SELECT NOW() AS now");
    console.log("PostgreSQL conectado:", result.rows[0]);
  }

  // helper transaccional
  static async withTransaction<T>(fn: TxFn<T>): Promise<T> {
    const pool = DB.getPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // si rollback falla, igual re-lanzamos el error original
      }
      throw err;
    } finally {
      client.release();
    }
  }
}