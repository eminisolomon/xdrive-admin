import type { BaseResponse, PaginatedData } from './base';
import { User } from './users';

export interface MinimalSubscription {
  id: string;
  [key: string]: any;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | string;
  status_label: string;
  is_paid: boolean;
  paid_at: string | null;
  refunded_at: string | null;
  created_at: string;
  user: User;
  subscription: MinimalSubscription | null;
}

export interface RefundPaymentRequest {
  amount?: number;
}

// Response types
export type GetPaymentsResponse = BaseResponse<PaginatedData<Payment>>;
export type GetPaymentResponse = BaseResponse<Payment>;
