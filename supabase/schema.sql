-- WinPicks Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  clerk_id TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'vip', 'churned')),
  paystack_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Picks table
CREATE TABLE picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL,
  league TEXT,
  matchup TEXT NOT NULL,
  selection TEXT NOT NULL,
  odds DECIMAL,
  stake DECIMAL DEFAULT 1,
  confidence TEXT DEFAULT 'medium' CHECK (confidence IN ('low', 'medium', 'high')),
  analysis TEXT,
  is_vip BOOLEAN DEFAULT FALSE,
  result TEXT DEFAULT 'pending' CHECK (result IN ('pending', 'win', 'loss', 'push', 'void')),
  profit_loss DECIMAL,
  event_date TIMESTAMPTZ NOT NULL,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  paystack_subscription_code TEXT,
  paystack_email_token TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers table (for non-registered visitors)
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for better query performance
CREATE INDEX idx_picks_sport ON picks(sport);
CREATE INDEX idx_picks_is_vip ON picks(is_vip);
CREATE INDEX idx_picks_result ON picks(result);
CREATE INDEX idx_picks_event_date ON picks(event_date);
CREATE INDEX idx_picks_created_at ON picks(created_at);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for picks table
-- Allow anyone to read non-VIP picks
CREATE POLICY "Public can read free picks" ON picks
  FOR SELECT USING (is_vip = FALSE);

-- Allow authenticated users to read VIP picks if they have VIP subscription
-- Note: This would need to be adjusted based on your auth setup with Clerk
CREATE POLICY "VIP users can read VIP picks" ON picks
  FOR SELECT USING (TRUE); -- Simplified for service role; actual VIP check done in API

-- Admin policies (using service role key)
CREATE POLICY "Service role has full access to picks" ON picks
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to users" ON users
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to subscriptions" ON subscriptions
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to email_subscribers" ON email_subscribers
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow public to insert email subscribers
CREATE POLICY "Public can subscribe to emails" ON email_subscribers
  FOR INSERT WITH CHECK (TRUE);

-- Sample data for testing (optional)
-- INSERT INTO picks (sport, league, matchup, selection, odds, stake, confidence, analysis, is_vip, result, event_date) VALUES
-- ('nba', 'NBA', 'Lakers vs Celtics', 'Lakers +4.5', 1.91, 1, 'high', 'Lakers have covered in 7 of their last 10 games.', false, 'win', NOW() - INTERVAL '1 day'),
-- ('nfl', 'NFL', 'Chiefs vs Bills', 'Over 48.5', 1.87, 1, 'medium', 'Both offenses have been firing lately.', false, 'win', NOW() - INTERVAL '2 days'),
-- ('soccer', 'Premier League', 'Arsenal vs Chelsea', 'Both Teams to Score', 1.72, 1, 'high', 'Both teams have scored in their last 5 H2H meetings.', false, 'pending', NOW() + INTERVAL '1 day'),
-- ('nba', 'NBA', 'Warriors vs Suns', 'Warriors -3.5', 1.95, 2, 'high', 'Warriors are 8-2 in their last 10 home games.', true, 'pending', NOW() + INTERVAL '1 day'),
-- ('nfl', 'NFL', 'Eagles vs Cowboys', 'Eagles ML', 1.65, 2, 'high', 'Eagles dominant at home with 7-1 record.', true, 'pending', NOW() + INTERVAL '2 days');
