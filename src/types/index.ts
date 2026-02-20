export type SubscriptionStatus = 'free' | 'vip' | 'churned';
export type PickResult = 'pending' | 'win' | 'loss' | 'push' | 'void';
export type Confidence = 'low' | 'medium' | 'high';
export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatusType = 'active' | 'cancelled' | 'expired';

export interface User {
  id: string;
  email: string;
  clerk_id: string;
  subscription_status: SubscriptionStatus;
  paystack_customer_id: string | null;
  created_at: string;
}

export interface Pick {
  id: string;
  sport: string;
  league: string | null;
  matchup: string;
  selection: string;
  odds: number | null;
  stake: number | null;
  confidence: Confidence;
  analysis: string | null;
  is_vip: boolean;
  result: PickResult;
  score: string | null;
  profit_loss: number | null;
  event_date: string;
  settled_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  paystack_subscription_code: string;
  paystack_email_token: string;
  plan: SubscriptionPlan;
  amount: number;
  status: SubscriptionStatusType;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface Stats {
  totalPicks: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  winRate: number;
  roi: number;
  unitsProfit: number;
}

export interface SportStats extends Stats {
  sport: string;
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  sport: string;
  league: string | null;
  matchup: string;
  selection: string;
  odds: number;
  event_date: string;
  result: PickResult;
  order_index: number;
  created_at: string;
}

export interface Bundle {
  id: string;
  title: string;
  description: string | null;
  total_odds: number;
  result: PickResult;
  created_at: string;
  items?: BundleItem[];
}
