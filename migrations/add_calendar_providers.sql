-- ============================================================
-- Multi-provider calendar support
-- Run this on your Render PostgreSQL database
-- ============================================================

-- Staff / provider table
CREATE TABLE IF NOT EXISTS calendar_providers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL,
  name            VARCHAR(100) NOT NULL,
  color           VARCHAR(7)  NOT NULL DEFAULT '#63ACF1',
  avatar_initials VARCHAR(3),
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cal_providers_user ON calendar_providers(user_id);

-- Link bookings to a provider (nullable = no specific provider assigned)
ALTER TABLE calendar_bookings
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES calendar_providers(id) ON DELETE SET NULL;

-- Link availability rows to a provider (nullable = applies to all providers)
ALTER TABLE calendar_availability
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES calendar_providers(id) ON DELETE CASCADE;
