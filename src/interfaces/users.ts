import type { BaseResponse, PaginatedData } from './base';

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  country: string;
  town_city: string;
  state: string;
  address: string | null;
  profile_image: string | null;
  profile_image_id: string | null;
  role: 'admin';
  status: 'active' | 'inactive' | 'suspended';
  suspended_at: string | null;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  town_city: string;
  state: string;
  address: string | null;
  profile_image: string | null;
  profile_image_id: string | null;
  role: 'user' | 'mechanic' | 'workshop' | string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  language: string;
  timezone: string;
  status: 'active' | 'suspended' | 'inactive';
  suspended_at: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: 'user' | 'mechanic' | 'workshop';
  country?: string | null;
  state?: string | null;
  town_city?: string | null;
  address?: string | null;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role?: 'user' | 'mechanic' | 'workshop';
  country?: string | null;
  state?: string | null;
  town_city?: string | null;
  address?: string | null;
}

export interface UpdateUserRoleRequest {
  role: 'user' | 'mechanic' | 'workshop';
}

// Response types
export type GetUsersResponse = BaseResponse<PaginatedData<User>>;
export type GetUserResponse = BaseResponse<User>;
