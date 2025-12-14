import {
  GetSettingsResponse,
  UpdateSettingsRequest,
} from '@/interfaces/settings';
import { api, handleApiError } from '@/shared';

export const settingsService = {
  getAll: async (): Promise<GetSettingsResponse> => {
    try {
      const response = await api.get<GetSettingsResponse>('/admin/settings');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (payload: UpdateSettingsRequest): Promise<void> => {
    try {
      await api.put('/admin/settings', payload);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
