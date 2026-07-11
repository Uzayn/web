-- Publish dedupe for the bai bridge: remember which bai prediction a pick
-- came from, so re-publishing the same drafts (double-tap, reloaded review
-- list) can't insert duplicates. Publishing upserts ON CONFLICT (bai_pick_id)
-- DO NOTHING against this index.
--
-- Manual/admin-entered picks keep bai_pick_id NULL; Postgres treats NULLs as
-- distinct in unique indexes, so they are unaffected.

ALTER TABLE picks ADD COLUMN IF NOT EXISTS bai_pick_id INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS picks_bai_pick_id_key ON picks(bai_pick_id);
