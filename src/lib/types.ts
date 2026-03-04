export type Tier = 'free' | 'pro';

export type SiteCategory = 'event' | 'valentine' | 'personal' | 'funny' | 'work' | 'other';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  tier: Tier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  generations_used: number;
  edits_used: number;
  usage_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  title: string;
  slug: string | null;
  html_content: string;
  css_content: string;
  category: SiteCategory | null;
  published: boolean;
  has_watermark: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  site_id: string;
  prompt: string;
  generation_type: 'create' | 'edit';
  model_used: string;
  tokens_used: number | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  site_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface UsageStats {
  generations: { used: number; limit: number };
  edits: { used: number; limit: number };
  tier: Tier;
}
