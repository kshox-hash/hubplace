import DB from "../../db/db_configuration";

export type GalleryFolder = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type GalleryPhoto = {
  id: string;
  user_id: string;
  url: string;
  description: string | null;
  folder_id: string | null;
  created_at: string;
};

export type FolderWithPhotos = {
  folder: GalleryFolder;
  photos: GalleryPhoto[];
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

export async function initGalleryFoldersTable(): Promise<void> {
  const pool = DB.getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_folders (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID        NOT NULL,
      name        TEXT        NOT NULL,
      description TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS gallery_folders_user_id_idx ON gallery_folders(user_id)
  `);
  await pool.query(`
    ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES gallery_folders(id) ON DELETE SET NULL
  `);
}

// ── Folders ───────────────────────────────────────────────────────────────────

export async function createFolder(
  userId: string,
  name: string,
  description: string | null
): Promise<GalleryFolder> {
  const pool = DB.getPool();
  const result = await pool.query(
    `INSERT INTO gallery_folders (user_id, name, description)
     VALUES ($1, $2, $3)
     RETURNING id::text, user_id::text, name, description, created_at::text`,
    [userId, name, description]
  );
  return result.rows[0];
}

export async function listFolders(userId: string): Promise<GalleryFolder[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id::text, user_id::text, name, description, created_at::text
     FROM gallery_folders WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId]
  );
  return result.rows;
}

export async function updateFolder(
  id: string,
  userId: string,
  name: string,
  description: string | null
): Promise<GalleryFolder | null> {
  const pool = DB.getPool();
  const result = await pool.query(
    `UPDATE gallery_folders SET name = $1, description = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id::text, user_id::text, name, description, created_at::text`,
    [name, description, id, userId]
  );
  return result.rows[0] ?? null;
}

export async function deleteFolder(id: string, userId: string): Promise<boolean> {
  const pool = DB.getPool();
  const result = await pool.query(
    `DELETE FROM gallery_folders WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listFoldersWithPhotos(userId: string): Promise<{
  folders: FolderWithPhotos[];
  orphanPhotos: GalleryPhoto[];
}> {
  const pool = DB.getPool();
  const [foldersResult, photosResult] = await Promise.all([
    pool.query(
      `SELECT id::text, user_id::text, name, description, created_at::text
       FROM gallery_folders WHERE user_id = $1 ORDER BY created_at ASC`,
      [userId]
    ),
    pool.query(
      `SELECT id::text, user_id::text, url, description, folder_id::text, created_at::text
       FROM gallery_photos WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    ),
  ]);

  const folders: FolderWithPhotos[] = foldersResult.rows.map(f => ({
    folder: f,
    photos: photosResult.rows.filter((p: GalleryPhoto) => p.folder_id === f.id),
  }));

  const orphanPhotos: GalleryPhoto[] = photosResult.rows.filter((p: GalleryPhoto) => !p.folder_id);

  return { folders, orphanPhotos };
}

// ── Photos ────────────────────────────────────────────────────────────────────

export async function addGalleryPhoto(
  userId: string,
  url: string,
  description: string | null,
  folderId?: string | null
): Promise<GalleryPhoto> {
  const pool = DB.getPool();
  const result = await pool.query(
    `INSERT INTO gallery_photos (user_id, url, description, folder_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id::text, user_id::text, url, description, folder_id::text, created_at::text`,
    [userId, url, description, folderId ?? null]
  );
  return result.rows[0];
}

export async function getGalleryPhotosByUserId(userId: string): Promise<GalleryPhoto[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id::text, user_id::text, url, description, folder_id::text, created_at::text
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
     RETURNING id::text, user_id::text, url, description, folder_id::text, created_at::text`,
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
