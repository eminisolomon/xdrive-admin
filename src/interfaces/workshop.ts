import type { BaseResponse, PaginatedData } from './base';
import { User } from './users';

export interface WorkshopServiceItem {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  workshop_name: string;
  phone_number: string;
  years_of_experience: number;
  no_of_mechanics: number;
  workshop_description: string;
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
  services: WorkshopServiceItem[];
}

// Request types
export interface RejectWorkshopRequest {
  reason: string;
}

// Response types
export type GetWorkshopsResponse = BaseResponse<PaginatedData<Workshop>>;
export type GetWorkshopResponse = BaseResponse<Workshop>;
