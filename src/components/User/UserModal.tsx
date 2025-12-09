import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '@/components';
import { CreateUserRequest, User } from '@/interfaces/users';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => void;
  initialData?: User | null;
  isLoading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserRequest>();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          first_name: initialData.first_name,
          last_name: initialData.last_name,
          email: initialData.email,
          phone_number: initialData.phone_number,
          role: initialData.role as 'user' | 'mechanic' | 'workshop',
          country: initialData.country,
          state: initialData.state,
          town_city: initialData.town_city,
          address: initialData.address,
        });
      } else {
        reset({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          password: '',
          role: 'user',
          country: '',
          state: '',
          town_city: '',
          address: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data: CreateUserRequest) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit User' : 'Create User'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register('first_name', { required: 'First Name is required' })}
            error={errors.first_name?.message}
            placeholder="John"
          />
          <Input
            label="Last Name"
            {...register('last_name', { required: 'Last Name is required' })}
            error={errors.last_name?.message}
            placeholder="Doe"
          />
        </div>

        <Input
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
          placeholder="john.doe@example.com"
        />

        <Input
          label="Phone Number"
          {...register('phone_number', {
            required: 'Phone Number is required',
          })}
          error={errors.phone_number?.message}
          placeholder="+1 234 567 890"
        />

        {!initialData && (
          <Input
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required for new users',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            error={errors.password?.message}
            placeholder="********"
          />
        )}

        <div>
          <label className="block text-sm font-medium text-(--color-text) mb-1">
            Role
          </label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="w-full px-4 py-2 bg-(--color-background) border border-(--color-border) rounded-xl text-(--color-text) focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all"
          >
            <option value="user">User</option>
            <option value="mechanic">Mechanic</option>
            <option value="workshop">Workshop</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Country"
            {...register('country')}
            placeholder="Country"
          />
          <Input
            label="State/Province"
            {...register('state')}
            placeholder="State"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="City" {...register('town_city')} placeholder="City" />
          <Input
            label="Address"
            {...register('address')}
            placeholder="Address"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
