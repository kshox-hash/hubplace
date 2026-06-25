import DB from "../../db/db_configuration";

export type GalleryPhoto = {
  id: string;
  user_id: string;
  url: string;
  description: string | null;
  created_at: string;
};

export async function initGalleryTable(): Promise<void> {
  const pool = DB.getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_photos (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID        NOT NULL,
      url         TEXT        NOT NULL,
      description TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS gallery_photos_user_id_idx ON gallery_photos(user_id)
  `);
}

export async function addGalleryPhoto(
  userId: string,
  url: string,
  description: string | null
): Promise<GalleryPhoto> {
  const pool = DB.getPool();
  const result = await pool.query(
    `INSERT INTO gallery_photos (user_id, url, description)
     VALUES ($1, $2, $3)
     RETURNING id::text, user_id::text, url, description, created_at::text`,
    [userId, url, description]
  );
  return result.rows[0];
}

export async function getGalleryPhotosByUserId(userId: string): Promise<GalleryPhoto[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id::text, user_id::text, url, description, created_at::text
     FROM gallery_photos WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function updateGalleryPhotoDescription(
  id: string,
  userId: string,
  description: string | null
): Promise<GalleryPhoto | null> {
  const pool = DB.getPool();
  const result = await pool.query(
    `UPDATE gallery_photos SET description = $1
     WHERE id = $2 AND user_id = $3
     RETURNING id::text, user_id::text, url, description, created_at::text`,
    [description, id, userId]
  );
  return result.rows[0] ?? null;
}

export async function deleteGalleryPhoto(id: string, userId: string): Promise<string | null> {
  const pool = DB.getPool();
  const result = await pool.query(
    `DELETE FROM gallery_photos WHERE id = $1 AND user_id = $2 RETURNING url`,
    [id, userId]
  );
  return result.rows[0]?.url ?? null;
}
