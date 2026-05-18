-- ================================================================
-- SwapBox Database Schema
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable PostGIS for distance calculation
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  username        TEXT UNIQUE,
  email           TEXT UNIQUE NOT NULL,
  bio             TEXT,
  avatar_url      TEXT,
  rating          NUMERIC(3,2) DEFAULT 0,
  total_reviews   INT DEFAULT 0,
  followers       INT DEFAULT 0,
  following       INT DEFAULT 0,
  successful_swaps INT DEFAULT 0,
  location        TEXT,
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  verified        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Items ────────────────────────────────────────────────────────────────────
CREATE TABLE items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT,
  condition        TEXT,
  images           TEXT[] DEFAULT '{}',
  want_in_exchange TEXT[] DEFAULT '{}',
  location         TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  status           TEXT DEFAULT 'available', -- available | swapped | archived
  likes            INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- View: items with distance calculation (requires user lat/lng in query)
-- ใช้ PostGIS คำนวณระยะห่างเป็น km
CREATE OR REPLACE VIEW items_with_distance AS
SELECT
  i.*,
  0 AS distance_km  -- จะ override ด้วย RPC function จริง
FROM items i;

-- Function สำหรับดึง items ตามระยะ
CREATE OR REPLACE FUNCTION nearby_items(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION, radius_km DOUBLE PRECISION)
RETURNS TABLE (
  id UUID, user_id UUID, title TEXT, description TEXT, category TEXT,
  condition TEXT, images TEXT[], want_in_exchange TEXT[], location TEXT,
  lat DOUBLE PRECISION, lng DOUBLE PRECISION, status TEXT, likes INT,
  created_at TIMESTAMPTZ, distance_km DOUBLE PRECISION
)
LANGUAGE sql AS $$
  SELECT
    i.*,
    (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(i.lat)) *
        cos(radians(i.lng) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(i.lat))
      )
    ) AS distance_km
  FROM items i
  WHERE i.status = 'available'
    AND i.lat IS NOT NULL AND i.lng IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(i.lat)) *
        cos(radians(i.lng) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(i.lat))
      )
    ) <= radius_km
  ORDER BY distance_km ASC;
$$;

-- ─── Swipes ───────────────────────────────────────────────────────────────────
CREATE TABLE swipes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id    UUID REFERENCES items(id) ON DELETE CASCADE,
  direction  TEXT NOT NULL, -- like | pass
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, item_id)
);

-- ─── Matches ──────────────────────────────────────────────────────────────────
CREATE TABLE matches (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id  UUID REFERENCES users(id),
  user_b_id  UUID REFERENCES users(id),
  item_a_id  UUID REFERENCES items(id),
  item_b_id  UUID REFERENCES items(id),
  status     TEXT DEFAULT 'matched', -- matched | exchanged | cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Conversations & Messages ────────────────────────────────────────────────
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id   UUID REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id),
  text            TEXT NOT NULL,
  read            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- ─── Auctions ────────────────────────────────────────────────────────────────
CREATE TABLE auctions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID REFERENCES items(id) ON DELETE CASCADE,
  seller_id   UUID REFERENCES users(id),
  start_bid   NUMERIC NOT NULL,
  current_bid NUMERIC NOT NULL,
  bid_count   INT DEFAULT 0,
  end_time    TIMESTAMPTZ NOT NULL,
  status      TEXT DEFAULT 'active', -- active | ended | cancelled
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bids (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id  UUID REFERENCES users(id),
  amount     NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime on auctions for live bidding
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;

-- ─── Exchanges ────────────────────────────────────────────────────────────────
CREATE TABLE exchanges (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id         UUID REFERENCES matches(id),
  initiated_by     UUID REFERENCES users(id),
  method           TEXT NOT NULL, -- meetup | ship
  status           TEXT DEFAULT 'pending', -- pending | confirmed | shipped | in_transit | delivered
  -- Meetup fields
  meetup_location  TEXT,
  meetup_time      TIMESTAMPTZ,
  meetup_phone     TEXT,
  -- Shipping fields
  from_address     TEXT,
  to_address       TEXT,
  courier          TEXT,
  shipping_fee     NUMERIC,
  tracking_number  TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Feed Posts ───────────────────────────────────────────────────────────────
CREATE TABLE feed_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  type          TEXT NOT NULL, -- wanted | offer | giveaway
  tags          TEXT[] DEFAULT '{}',
  images        TEXT[] DEFAULT '{}',
  like_count    INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE post_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),       -- คนที่ถูกรีวิว
  reviewer_id  UUID REFERENCES users(id),       -- คนที่รีวิว
  exchange_id  UUID REFERENCES exchanges(id),
  rating       INT CHECK (rating BETWEEN 1 AND 5),
  text         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches       ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchanges     ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;

-- Users: everyone can read, only owner can write
CREATE POLICY "users_read"   ON users FOR SELECT USING (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (auth.uid() = id);

-- Items: everyone can read, only owner can write
CREATE POLICY "items_read"   ON items FOR SELECT USING (true);
CREATE POLICY "items_insert" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "items_update" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "items_delete" ON items FOR DELETE USING (auth.uid() = user_id);

-- Messages: only participants can read/write
CREATE POLICY "messages_read" ON messages FOR SELECT
  USING (auth.uid() = sender_id);
CREATE POLICY "messages_insert" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Feed: everyone reads, owner writes
CREATE POLICY "feed_read"   ON feed_posts FOR SELECT USING (true);
CREATE POLICY "feed_insert" ON feed_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auctions & bids: everyone reads
CREATE POLICY "auctions_read" ON auctions FOR SELECT USING (true);
CREATE POLICY "bids_read"     ON bids     FOR SELECT USING (true);
CREATE POLICY "bids_insert"   ON bids     FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
CREATE POLICY "uploads_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "uploads_auth_write"  ON storage.objects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND bucket_id = 'uploads');
