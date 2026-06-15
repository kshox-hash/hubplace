import DB from "../../db/db_configuration";

const pool = DB.getPool();

export type MpConnection = {
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  mp_user_id: string | null;
  public_key: string | null;
  expires_at: Date | null;
};

export async function saveMpConnection(input: {
  userId: string;
  accessToken: string;
  refreshToken: string | null;
  mpUserId: string | null;
  publicKey: string | null;
  expiresAt: Date | null;
}): Promise<void> {
  await pool.query(
    `INSERT INTO payment_provider_connections
       (user_id, provider, access_token, refresh_token, mp_user_id, public_key, expires_at, updated_at)
     VALUES ($1, 'mercadopago', $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id, provider) DO UPDATE SET
       access_token  = EXCLUDED.access_token,
       refresh_token = EXCLUDED.refresh_token,
       mp_user_id    = EXCLUDED.mp_user_id,
       public_key    = EXCLUDED.public_key,
       expires_at    = EXCLUDED.expires_at,
       updated_at    = NOW()`,
    [
      input.userId,
      input.accessToken,
      input.refreshToken,
      input.mpUserId,
      input.publicKey,
      input.expiresAt,
    ]
  );
}

export async function getMpConnection(userId: string): Promise<MpConnection | null> {
  const result = await pool.query(
    `SELECT user_id, access_token, refresh_token, mp_user_id, public_key, expires_at
     FROM payment_provider_connections
     WHERE user_id = $1 AND provider = 'mercadopago'
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] ?? null;
}

export async function deleteMpConnection(userId: string): Promise<void> {
  await pool.query(
    `DELETE FROM payment_provider_connections WHERE user_id = $1 AND provider = 'mercadopago'`,
    [userId]
  );
}

export async function getAccessTokenByMpUserId(mpUserId: string): Promise<string | null> {
  const result = await pool.query(
    `SELECT access_token FROM payment_provider_connections
     WHERE mp_user_id = $1 AND provider = 'mercadopago'
     LIMIT 1`,
    [mpUserId]
  );
  return result.rows[0]?.access_token ?? null;
}
