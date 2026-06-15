import DB from "../../db/db_configuration";

export type Service = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  active: boolean;
  created_at: string;
};

export async function getServices(userId: string): Promise<Service[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id, user_id, name, description, duration_minutes,
            price::numeric AS price, active, created_at
     FROM services WHERE user_id = $1 ORDER BY name ASC`,
    [userId]
  );
  return result.rows;
}

export async function createService(
  userId: string,
  name: string,
  description: string | null,
  durationMinutes: number,
  price: number
): Promise<Service> {
  const pool = DB.getPool();
  const result = await pool.query(
    `INSERT INTO services (user_id, name, description, duration_minutes, price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, name, description, duration_minutes,
               price::numeric AS price, active, created_at`,
    [userId, name, description ?? null, durationMinutes, price]
  );
  return result.rows[0];
}

export async function updateService(
  id: string,
  userId: string,
  name: string,
  description: string | null,
  durationMinutes: number,
  price: number,
  active: boolean
): Promise<Service | null> {
  const pool = DB.getPool();
  const result = await pool.query(
    `UPDATE services
     SET name = $1, description = $2, duration_minutes = $3, price = $4, active = $5
     WHERE id = $6 AND user_id = $7
     RETURNING id, user_id, name, description, duration_minutes,
               price::numeric AS price, active, created_at`,
    [name, description ?? null, durationMinutes, price, active, id, userId]
  );
  return result.rows[0] ?? null;
}

export async function deleteService(id: string, userId: string): Promise<void> {
  const pool = DB.getPool();
  await pool.query(
    `DELETE FROM services WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
}
