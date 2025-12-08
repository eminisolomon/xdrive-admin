import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
} from '@/interfaces';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Queries
  const useGetUsers = (page = 1, perPage = 20) => {
    return useQuery({
      queryKey: ['users', page, perPage],
      queryFn: () => userService.getAll(page, perPage),
    });
  };

  const useGetUser = (id: string) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: () => userService.getById(id),
      enabled: !!id,
    });
  };

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: (id: string) => userService.suspend(id),
    onSuccess: (_, id) => {
      toast.success('User suspended successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to suspend user');
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: (id: string) => userService.activate(id),
    onSuccess: (_, id) => {
      toast.success('User activated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to activate user');
    },
  });

  const verifyUserEmailMutation = useMutation({
    mutationFn: (id: string) => userService.verifyEmail(id),
    onSuccess: (_, id) => {
      toast.success('User email verified successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify user email');
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRoleRequest }) =>
      userService.updateRole(id, data),
    onSuccess: (_, variables) => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });

  return {
    useGetUsers,
    useGetUser,

    createUser: createUserMutation.mutateAsync,
    createUserStatus: createUserMutation.status,
    createUserError: createUserMutation.error,
    createUserPending: createUserMutation.isPending,

    updateUser: updateUserMutation.mutateAsync,
    updateUserStatus: updateUserMutation.status,
    updateUserError: updateUserMutation.error,
    updateUserPending: updateUserMutation.isPending,

    deleteUser: deleteUserMutation.mutateAsync,
    deleteUserStatus: deleteUserMutation.status,
    deleteUserError: deleteUserMutation.error,
    deleteUserPending: deleteUserMutation.isPending,

    suspendUser: suspendUserMutation.mutateAsync,
    suspendUserStatus: suspendUserMutation.status,
    suspendUserError: suspendUserMutation.error,
    suspendUserPending: suspendUserMutation.isPending,

    activateUser: activateUserMutation.mutateAsync,
    activateUserStatus: activateUserMutation.status,
    activateUserError: activateUserMutation.error,
    activateUserPending: activateUserMutation.isPending,

    verifyUserEmail: verifyUserEmailMutation.mutateAsync,
    verifyUserEmailStatus: verifyUserEmailMutation.status,
    verifyUserEmailError: verifyUserEmailMutation.error,
    verifyUserEmailPending: verifyUserEmailMutation.isPending,

    updateUserRole: updateUserRoleMutation.mutateAsync,
    updateUserRoleStatus: updateUserRoleMutation.status,
    updateUserRoleError: updateUserRoleMutation.error,
    updateUserRolePending: updateUserRoleMutation.isPending,
  };
};
