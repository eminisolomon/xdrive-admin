import type { BaseResponse, PaginatedData } from './base';
import type { Car } from './cars';
import { User } from './users';

export interface Comment {
  id: string;
  user_id: string;
  car_id: string;
  parent_id: string | null;
  content: string;
  flagged: number;
  flagged_at: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  car: Car;
  likes_count: number;
  is_liked: boolean;
}

// Response types
export type GetCommentsResponse = BaseResponse<PaginatedData<Comment>>;
