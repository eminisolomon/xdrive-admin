import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services';
import { UpdateSettingsRequest } from '@/interfaces/settings';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const getSettings = () => {
    return useQuery({
      queryKey: ['settings'],
      queryFn: settingsService.getAll,
    });
  };

  const updateSettingsMutation = useMutation({
    mutationFn: (payload: UpdateSettingsRequest) =>
      settingsService.update(payload),
    onSuccess: () => {
      toast.success('Settings updated');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  return {
    getSettings,
    updateSettings: updateSettingsMutation.mutateAsync,
    updateSettingsStatus: updateSettingsMutation.status,
    updateSettingsError: updateSettingsMutation.error,
    updateSettingsPending: updateSettingsMutation.isPending,
  };
};
