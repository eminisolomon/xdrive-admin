import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UpdateCarRequest, RejectCarRequest } from '@/interfaces';
import { carService } from '@/services';

export const useCars = () => {
  const queryClient = useQueryClient();

  // Queries
  const useGetCars = (page = 1, status?: string, search?: string) => {
    return useQuery({
      queryKey: ['cars', page, status, search],
      queryFn: () => carService.getAll(page, status, search),
    });
  };

  const useGetPendingCars = () => {
    return useQuery({
      queryKey: ['cars', 'pending'],
      queryFn: () => carService.getPending(),
    });
  };

  const useGetFlaggedCars = () => {
    return useQuery({
      queryKey: ['cars', 'flagged'],
      queryFn: () => carService.getFlagged(),
    });
  };

  const useGetCar = (id: string) => {
    return useQuery({
      queryKey: ['cars', id],
      queryFn: () => carService.getById(id),
      enabled: !!id,
    });
  };

  // Mutations
  const updateCarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCarRequest }) =>
      carService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Car updated successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update car');
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: (id: string) => carService.delete(id),
    onSuccess: () => {
      toast.success('Car deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete car');
    },
  });

  const approveCarMutation = useMutation({
    mutationFn: (id: string) => carService.approve(id),
    onSuccess: () => {
      toast.success('Car approved successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve car');
    },
  });

  const rejectCarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectCarRequest }) =>
      carService.reject(id, data),
    onSuccess: () => {
      toast.success('Car rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject car');
    },
  });

  const featureCarMutation = useMutation({
    mutationFn: (id: string) => carService.feature(id),
    onSuccess: (_, id) => {
      toast.success('Car featured successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to feature car');
    },
  });

  const unfeatureCarMutation = useMutation({
    mutationFn: (id: string) => carService.unfeature(id),
    onSuccess: (_, id) => {
      toast.success('Car unfeatured successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unfeature car');
    },
  });

  return {
    useGetCars,
    useGetPendingCars,
    useGetFlaggedCars,
    useGetCar,

    updateCar: updateCarMutation.mutateAsync,
    updateCarStatus: updateCarMutation.status,
    updateCarError: updateCarMutation.error,
    updateCarPending: updateCarMutation.isPending,

    deleteCar: deleteCarMutation.mutateAsync,
    deleteCarStatus: deleteCarMutation.status,
    deleteCarError: deleteCarMutation.error,
    deleteCarPending: deleteCarMutation.isPending,

    approveCar: approveCarMutation.mutateAsync,
    approveCarStatus: approveCarMutation.status,
    approveCarError: approveCarMutation.error,
    approveCarPending: approveCarMutation.isPending,

    rejectCar: rejectCarMutation.mutateAsync,
    rejectCarStatus: rejectCarMutation.status,
    rejectCarError: rejectCarMutation.error,
    rejectCarPending: rejectCarMutation.isPending,

    featureCar: featureCarMutation.mutateAsync,
    featureCarStatus: featureCarMutation.status,
    featureCarError: featureCarMutation.error,
    featureCarPending: featureCarMutation.isPending,

    unfeatureCar: unfeatureCarMutation.mutateAsync,
    unfeatureCarStatus: unfeatureCarMutation.status,
    unfeatureCarError: unfeatureCarMutation.error,
    unfeatureCarPending: unfeatureCarMutation.isPending,
  };
};
