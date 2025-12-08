import { api, handleApiError } from '@/shared';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  GetUsersResponse,
  GetUserResponse,
} from '@/interfaces';

export const userService = {
  getAll: async (page = 1, perPage = 20): Promise<GetUsersResponse> => {
    try {
      const response = await api.get<GetUsersResponse>('/admin/users', {
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<GetUserResponse> => {
    try {
      const response = await api.get<GetUserResponse>(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (data: CreateUserRequest): Promise<GetUserResponse> => {
    try {
      const response = await api.post<GetUserResponse>('/admin/users', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (
    id: string,
    data: UpdateUserRequest,
  ): Promise<GetUserResponse> => {
    try {
      const response = await api.put<GetUserResponse>(
        `/admin/users/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/users/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  suspend: async (id: string): Promise<void> => {
    try {
      await api.post(`/admin/users/${id}/suspend`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  activate: async (id: string): Promise<void> => {
    try {
      await api.post(`/admin/users/${id}/activate`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  verifyEmail: async (id: string): Promise<void> => {
    try {
      await api.post(`/admin/users/${id}/verify-email`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateRole: async (
    id: string,
    data: UpdateUserRoleRequest,
  ): Promise<void> => {
    try {
      await api.put(`/admin/users/${id}/role`, data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
