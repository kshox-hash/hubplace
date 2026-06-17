import DB from "../../db/db_configuration";

export type CalendarService = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  duration_minutes: number | null;
  color: string;
  is_active: boolean;
  sort_order: number;
};

export async function initCalendarServicesTable(): Promise<void> {
  const pool = DB.getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calendar_services (
      id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id          UUID        NOT NULL,
      name             TEXT        NOT NULL,
      price            INTEGER     NOT NULL DEFAULT 0,
      duration_minutes INTEGER,
      color            TEXT        NOT NULL DEFAULT '#63ACF1',
      is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
      sort_order       INTEGER     NOT NULL DEFAULT 0,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    ALTER TABLE calendar_bookings
      ADD COLUMN IF NOT EXISTS service_id   UUID,
      ADD COLUMN IF NOT EXISTS service_name TEXT,
      ADD COLUMN IF NOT EXISTS service_color TEXT
  `);
}

export async function getServicesByUserId(userId: string): Promise<CalendarService[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order
     FROM calendar_services
     WHERE user_id = $1
     ORDER BY sort_order ASC, name ASC`,
    [userId]
  );
  return result.rows;
}

export async function getActiveServicesByUserId(userId: string): Promise<CalendarService[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order
     FROM calendar_services
     WHERE user_id = $1 AND is_active = TRUE
     ORDER BY sort_order ASC, name ASC`,
    [userId]
  );
  return result.rows;
}

export async function getServiceById(id: string, userId: string): Promise<CalendarService | null> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order
     FROM calendar_services WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0] ?? null;
}

export async function createService(input: {
  userId: string;
  name: string;
  price: number;
  durationMinutes: number | null;
  color: string;
}): Promise<CalendarService> {
  const pool = DB.getPool();
  const result = await pool.query(
    `INSERT INTO calendar_services (user_id, name, price, duration_minutes, color)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order`,
    [input.userId, input.name, input.price, input.durationMinutes ?? null, input.color]
  );
  return result.rows[0];
}

export async function updateService(input: {
  id: string;
  userId: string;
  name: string;
  price: number;
  durationMinutes: number | null;
  color: string;
  isActive: boolean;
}): Promise<CalendarService | null> {
  const pool = DB.getPool();
  const result = await pool.query(
    `UPDATE calendar_services
     SET name = $1, price = $2, duration_minutes = $3, color = $4, is_active = $5
     WHERE id = $6 AND user_id = $7
     RETURNING id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order`,
    [input.name, input.price, input.durationMinutes ?? null, input.color, input.isActive, input.id, input.userId]
  );
  return result.rows[0] ?? null;
}

export async function deleteService(id: string, userId: string): Promise<boolean> {
  const pool = DB.getPool();
  const result = await pool.query(
    `DELETE FROM calendar_services WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}
