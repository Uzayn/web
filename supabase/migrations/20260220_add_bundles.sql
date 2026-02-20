-- Create pick_bundles table
CREATE TABLE IF NOT EXISTS pick_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  total_odds DECIMAL NOT NULL DEFAULT 1,
  result TEXT NOT NULL DEFAULT 'pending' CHECK (result IN ('pending', 'win', 'loss', 'void')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create pick_bundle_items table
CREATE TABLE IF NOT EXISTS pick_bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES pick_bundles(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  league TEXT,
  matchup TEXT NOT NULL,
  selection TEXT NOT NULL,
  odds DECIMAL NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  result TEXT NOT NULL DEFAULT 'pending' CHECK (result IN ('pending', 'win', 'loss', 'void')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pick_bundles_created_at ON pick_bundles(created_at);
CREATE INDEX IF NOT EXISTS idx_pick_bundle_items_bundle_id ON pick_bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_pick_bundle_items_order ON pick_bundle_items(bundle_id, order_index);
