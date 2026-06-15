import DB from "../../db/db_configuration";

export type CalendarBlock = {
  id: string;
  user_id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
  created_at: string;
};

export async function getBlocks(userId: string): Promise<CalendarBlock[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id, user_id, start_at, end_at, reason, created_at
     FROM calendar_blocks
     WHERE user_id = $1 AND end_at > NOW()
     ORDER BY start_at ASC`,
    [userId]
  );
  return result.rows;
}

export async function createBlock(
  userId: string,
  startAt: string,
  endAt: string,
  reason: string | null
): Promise<CalendarBlock> {
  const pool = DB.getPool();
  const result = await pool.query(
    `INSERT INTO calendar_blocks (user_id, start_at, end_at, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, startAt, endAt, reason ?? null]
  );
  return result.rows[0];
}

export async function deleteBlock(id: string, userId: string): Promise<void> {
  const pool = DB.getPool();
  await pool.query(
    `DELETE FROM calendar_blocks WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
}
