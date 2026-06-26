import DB from "../../../db/db_configuration";

export async function listQuoteServices(userId: string) {
  const res = await DB.getPool().query(
    `SELECT id::text, name, description, COALESCE(unit, 'unidad') AS unit,
            price, is_active, is_quote_only, created_at
     FROM calendar_services
     WHERE user_id = $1 AND is_quote_only = TRUE
     ORDER BY sort_order ASC, name ASC`,
    [userId]
  );
  return res.rows;
}

export async function createQuoteService(
  userId: string,
  params: { name: string; description?: string; unit: string; price: number; isQuoteOnly?: boolean }
) {
  const res = await DB.getPool().query(
    `INSERT INTO calendar_services (user_id, name, description, unit, price, is_quote_only)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id::text, name, description, COALESCE(unit, 'unidad') AS unit,
               price, is_active, is_quote_only, created_at`,
    [userId, params.name, params.description || null, params.unit, params.price, params.isQuoteOnly ?? false]
  );
  return res.rows[0];
}

export async function updateQuoteService(
  userId: string,
  serviceId: string,
  params: {
    name?: string;
    description?: string | null;
    unit?: string;
    price?: number;
    isActive?: boolean;
    isQuoteOnly?: boolean;
  }
) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (params.name        !== undefined) { fields.push(`name = $${i++}`);          values.push(params.name); }
  if (params.description !== undefined) { fields.push(`description = $${i++}`);   values.push(params.description); }
  if (params.unit        !== undefined) { fields.push(`unit = $${i++}`);           values.push(params.unit); }
  if (params.price       !== undefined) { fields.push(`price = $${i++}`);          values.push(params.price); }
  if (params.isActive    !== undefined) { fields.push(`is_active = $${i++}`);      values.push(params.isActive); }
  if (params.isQuoteOnly !== undefined) { fields.push(`is_quote_only = $${i++}`);  values.push(params.isQuoteOnly); }

  if (fields.length === 0) return null;
  values.push(serviceId, userId);

  const res = await DB.getPool().query(
    `UPDATE calendar_services SET ${fields.join(", ")}
     WHERE id = $${i++} AND user_id = $${i++}
     RETURNING id::text, name, description, COALESCE(unit, 'unidad') AS unit,
               price, is_active, is_quote_only, created_at`,
    values
  );
  return res.rows[0] || null;
}

export async function deleteQuoteService(userId: string, serviceId: string) {
  const res = await DB.getPool().query(
    `DELETE FROM calendar_services WHERE id = $1 AND user_id = $2 RETURNING id`,
    [serviceId, userId]
  );
  return res.rows[0] || null;
}
