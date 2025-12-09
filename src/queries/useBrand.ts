import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CreateBrandRequest,
  CreateBrandResponse,
  UpdateBrandRequest,
  UpdateBrandResponse,
  UploadBrandLogoResponse,
} from '@/interfaces';
import { brandService } from '@/services';

export const useBrand = (
  brandId?: string | null,
  page = 1,
  search?: string,
) => {
  const queryClient = useQueryClient();

  const allBrandsQuery = useQuery({
    queryKey: ['brands', page, search],
    queryFn: () => brandService.getAll(page, search),
  });

  const brandByIdQuery = useQuery({
    queryKey: ['brands', brandId],
    queryFn: () => brandService.getById(brandId || ''),
    enabled: !!brandId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBrandRequest) => brandService.create(data),
    onSuccess: (data: CreateBrandResponse) => {
      toast.success(data.message || 'Brand created');
      queryClient.invalidateQueries({
        queryKey: ['brands'],
      });
    },
    onError: (error) => {
      throw error;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandRequest }) =>
      brandService.update(id, data),
    onSuccess: (data: UpdateBrandResponse, variables) => {
      toast.success(data.message || 'Brand updated');
      queryClient.invalidateQueries({
        queryKey: ['brands', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['brands'],
      });
    },
    onError: (error) => {
      throw error;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => brandService.delete(id),
    onSuccess: (data) => {
      toast.success(data.message || 'Brand deleted');
      queryClient.invalidateQueries({
        queryKey: ['brands'],
      });
    },
    onError: (error) => {
      throw error;
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: ({ brandId, file }: { brandId: string; file: File }) =>
      brandService.uploadLogo(brandId, file),
    onSuccess: (data: UploadBrandLogoResponse, variables) => {
      toast.success(data.message || 'Logo uploaded');
      queryClient.invalidateQueries({
        queryKey: ['brands', variables.brandId],
      });
      queryClient.invalidateQueries({
        queryKey: ['brands'],
      });
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    allBrandsQuery,
    brandByIdQuery,

    createBrand: createMutation.mutateAsync,
    updateBrand: updateMutation.mutateAsync,
    deleteBrand: deleteMutation.mutateAsync,
    uploadBrandLogo: uploadLogoMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploadingLogo: uploadLogoMutation.isPending,

    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    uploadLogoError: uploadLogoMutation.error,
  };
};
