import { api, handleApiError } from '@/shared';
import {
  GetBrandsResponse,
  GetBrandResponse,
  CreateBrandRequest,
  CreateBrandResponse,
  UpdateBrandRequest,
  UpdateBrandResponse,
  DeleteBrandResponse,
  UploadBrandLogoResponse,
} from '@/interfaces';

export const brandService = {
  getAll: async (page = 1, search?: string): Promise<GetBrandsResponse> => {
    try {
      const queryParams = new URLSearchParams({ page: page.toString() });
      if (search) {
        queryParams.append('search', search);
      }
      const response = await api.get<GetBrandsResponse>(
        `/admin/brands?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<GetBrandResponse> => {
    try {
      const response = await api.get<GetBrandResponse>(`/admin/brands/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (data: CreateBrandRequest): Promise<CreateBrandResponse> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);

      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active.toString());
      }

      if (data.logo) {
        formData.append('logo', data.logo);
      }

      const response = await api.post<CreateBrandResponse>(
        '/admin/brands',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (
    id: string,
    data: UpdateBrandRequest,
  ): Promise<UpdateBrandResponse> => {
    try {
      const formData = new FormData();

      if (data.name) {
        formData.append('name', data.name);
      }

      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active.toString());
      }

      if (data.logo) {
        formData.append('logo', data.logo);
      }

      const response = await api.post<UpdateBrandResponse>(
        `/admin/brands/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<DeleteBrandResponse> => {
    try {
      const response = await api.delete<DeleteBrandResponse>(
        `/admin/brands/${id}`,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadLogo: async (
    brandId: string,
    file: File,
  ): Promise<UploadBrandLogoResponse> => {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.post<UploadBrandLogoResponse>(
        `/admin/brands/${brandId}/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
