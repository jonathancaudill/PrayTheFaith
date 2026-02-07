-- Pray The Faith: schema for Vercel Postgres (or any PostgreSQL)

CREATE TABLE IF NOT EXISTS encouragements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  location TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_encouragements_status ON encouragements (status);
CREATE INDEX IF NOT EXISTS idx_encouragements_created ON encouragements (created_at DESC);

CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mystery_id TEXT NOT NULL,
  reference TEXT NOT NULL,
  text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_readings_mystery ON readings (mystery_id);
