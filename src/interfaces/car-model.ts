import type { BaseResponse, PaginatedData } from './base';
import { Brand } from './brand';

export interface CarModel {
  id: string;
  brand_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cars_count: number;
  brand?: Brand;
}

// Request types
export interface CreateCarModelRequest {
  name: string;
  is_active?: boolean;
}

export interface UpdateCarModelRequest {
  name?: string;
  is_active?: boolean;
}

// Response types
export type GetCarModelsResponse = BaseResponse<PaginatedData<CarModel>>;
export type CreateCarModelResponse = BaseResponse<CarModel>;
export type UpdateCarModelResponse = BaseResponse<CarModel>;
export type DeleteCarModelResponse = BaseResponse;
