import type { BaseResponse, PaginatedData } from './base';
import { User } from './users';

export interface MechanicServiceItem {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mechanic {
  id: string;
  name: string;
  phone_number: string;
  years_of_experience: number;
  self_description: string;
  available_days: string[];
  images: string[] | null;
  average_rating: number;
  total_reviews: number;
  address: string;
  city: string;
  state: string;
  country: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  services: MechanicServiceItem[];
}

// Request types
export interface RejectMechanicRequest {
  reason: string;
}

// Response types
export type GetMechanicsResponse = BaseResponse<PaginatedData<Mechanic>>;
export type GetMechanicResponse = BaseResponse<Mechanic>;
