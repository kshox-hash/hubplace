import DB from "../../db/db_configuration";

const pool = DB.getPool();

function toInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();
}

export async function getProvidersByUserId(userId: string) {
  const result = await pool.query(
    `SELECT id::text, user_id::text, name, color, avatar_initials, is_active
     FROM calendar_providers
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId]
  );
  return result.rows;
}

export async function createProvider(input: {
  userId: string;
  name: string;
  color?: string;
}) {
  const result = await pool.query(
    `INSERT INTO calendar_providers (user_id, name, color, avatar_initials)
     VALUES ($1, $2, $3, $4)
     RETURNING id::text, user_id::text, name, color, avatar_initials, is_active`,
    [
      input.userId,
      input.name.trim(),
      input.color || "#63ACF1",
      toInitials(input.name),
    ]
  );
  return result.rows[0];
}

export async function updateProvider(input: {
  id: string;
  name: string;
  color?: string;
  isActive?: boolean;
}) {
  const result = await pool.query(
    `UPDATE calendar_providers
     SET name = $2, color = $3, avatar_initials = $4,
         is_active = $5, updated_at = NOW()
     WHERE id = $1
     RETURNING id::text, user_id::text, name, color, avatar_initials, is_active`,
    [
      input.id,
      input.name.trim(),
      input.color || "#63ACF1",
      toInitials(input.name),
      input.isActive !== false,
    ]
  );
  return result.rows[0] ?? null;
}

export async function deleteProvider(id: string) {
  await pool.query(`DELETE FROM calendar_providers WHERE id = $1`, [id]);
}

export async function getActiveProvidersByUserId(userId: string) {
  const result = await pool.query(
    `SELECT id::text, name, color, avatar_initials
     FROM calendar_providers
     WHERE user_id = $1 AND is_active = true
     ORDER BY created_at ASC`,
    [userId]
  );
  return result.rows;
}
