import type { BaseResponse, PaginatedData } from './base';
import type { Payment } from './payment';
import { User } from './users';

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly' | string;
  trial_days: number;
  is_active: boolean;
  sort_order: number;
  formatted_price: string;
  billing_cycle_label: string;
  price_per_month: number;
  formatted_price_per_month: string;
  has_trial: boolean;
  subscribers_count: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired' | 'trial' | string;
  status_label: string;
  starts_at: string;
  ends_at: string;
  trial_ends_at: string | null;
  canceled_at: string | null;
  is_recurring: boolean;
  is_active: boolean;
  is_expired: boolean;
  is_on_trial: boolean;
  days_until_expiry: number;
  user: User;
  plan: SubscriptionPlan;
  payments?: Payment[];
}

export interface ExtendSubscriptionRequest {
  days: number;
}

// Response types
export type GetSubscriptionsResponse = BaseResponse<
  PaginatedData<Subscription>
>;
export type GetSubscriptionResponse = BaseResponse<Subscription>;
