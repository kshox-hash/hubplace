-- Agrega campos OAuth a payment_provider_connections
ALTER TABLE payment_provider_connections
  ADD COLUMN IF NOT EXISTS refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS expires_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mp_user_id    TEXT,
  ADD COLUMN IF NOT EXISTS public_key    TEXT,
  ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Índice único para evitar duplicados por usuario+proveedor
CREATE UNIQUE INDEX IF NOT EXISTS idx_ppc_user_provider
  ON payment_provider_connections(user_id, provider);

-- Índice para lookup por mp_user_id en el webhook
CREATE INDEX IF NOT EXISTS idx_ppc_mp_user_id
  ON payment_provider_connections(mp_user_id)
  WHERE mp_user_id IS NOT NULL;
