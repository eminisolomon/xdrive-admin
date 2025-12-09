import type { BaseResponse, PaginatedData } from './base';
import { CarModel } from './car-model';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  car_models?: CarModel[];
}

// Request types
export interface CreateBrandRequest {
  name: string;
  is_active?: boolean;
  logo?: File | null;
}

export interface UpdateBrandRequest {
  name?: string;
  is_active?: boolean;
  logo?: File | null;
}

// Response types
export type GetBrandsResponse = BaseResponse<PaginatedData<Brand>>;
export type GetBrandResponse = BaseResponse<Brand>;
export type CreateBrandResponse = BaseResponse<Brand>;
export type UpdateBrandResponse = BaseResponse<Brand>;
export type DeleteBrandResponse = BaseResponse;

export interface UploadBrandLogoRequest {
  logo: File;
}

export type UploadBrandLogoResponse = BaseResponse<{ logo: string }>;
