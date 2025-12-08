import type { BaseResponse, PaginatedData } from './base';
import { User } from './users';

export interface Reviewable {
  id: string;
  type: string; // 'workshop' | 'mechanic'
  name: string | null;
  [key: string]: any;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  flagged: number;
  flagged_at: string | null;
  created_at: string;
  user: User;
  reviewable: Reviewable;
}

// Response types
export type GetReviewsResponse = BaseResponse<PaginatedData<Review>>;
