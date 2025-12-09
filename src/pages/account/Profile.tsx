import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PageHeader, Input, Button } from '@/components';
import { useAuthStore } from '@/stores';
import { UpdateProfileRequest } from '@/interfaces';
import { useUsers } from '@/queries';

const Profile = () => {
  const { admin } = useAuthStore();
  const { updateProfile, updateProfilePending } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileRequest>({
    defaultValues: {
      first_name: admin?.first_name || '',
      last_name: admin?.last_name || '',
      phone_number: admin?.phone_number || '',
      country: admin?.country || '',
      town_city: admin?.town_city || '',
      state: admin?.state || '',
      address: admin?.address || '',
    },
  });

  useEffect(() => {
    if (admin) {
      reset({
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone_number: admin.phone_number || '',
        country: admin.country || '',
        town_city: admin.town_city || '',
        state: admin.state || '',
        address: admin.address || '',
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const fullName =
    `${admin?.first_name || ''} ${admin?.last_name || ''}`.trim() || 'Admin';

  return (
    <div>
      <PageHeader
        title="Profile Settings"
        description="View and manage your account information."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-(--color-surface) rounded-xl border border-(--color-border) shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-(--color-primary) flex items-center justify-center text-white text-2xl font-bold mb-4">
              {getInitials(fullName)}
            </div>
            <h2 className="text-xl font-bold text-(--color-text)">
              {fullName}
            </h2>
            <p className="text-(--color-body) text-sm mt-1">{admin?.email}</p>
            <span className="mt-3 px-3 py-1 bg-(--color-primary-container) text-(--color-primary) text-xs font-medium rounded-full">
              {admin?.role || 'Administrator'}
            </span>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-(--color-surface) rounded-xl border border-(--color-border) shadow-sm p-6">
            <h3 className="text-lg font-semibold text-(--color-text) mb-4">
              Personal Information
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  error={errors.first_name?.message}
                  {...register('first_name', {
                    required: 'First name is required',
                  })}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  error={errors.last_name?.message}
                  {...register('last_name', {
                    required: 'Last name is required',
                  })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    value={admin?.email || ''}
                    readOnly
                    className="bg-gray-100 opacity-75"
                    helperText="Email cannot be changed"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                    error={errors.phone_number?.message}
                    {...register('phone_number')}
                  />
                </div>
                <Input
                  label="Country"
                  placeholder="Enter country"
                  error={errors.country?.message}
                  {...register('country')}
                />
                <Input
                  label="State"
                  placeholder="Enter state"
                  error={errors.state?.message}
                  {...register('state')}
                />
                <Input
                  label="Town / City"
                  placeholder="Enter town or city"
                  error={errors.town_city?.message}
                  {...register('town_city')}
                />
                <Input
                  label="Address"
                  placeholder="Enter address"
                  error={errors.address?.message}
                  {...register('address')}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" isLoading={updateProfilePending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
