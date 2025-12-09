import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useUsers } from '@/queries/useUsers';
import { Button, Loading, Pagination } from '@/components';
import {
  UserModal,
  UserDeleteModal,
  UserSuspendModal,
  UserActivateModal,
} from '@/components/User';
import { User, CreateUserRequest, UpdateUserRequest } from '@/interfaces/users';

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const {
    useGetUsers,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
    verifyUserEmail,
  } = useUsers();

  const { data: usersResponse, isLoading: usersLoading } = useGetUsers(page);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({
    isOpen: false,
    userId: null,
  });

  const [suspendConfirmation, setSuspendConfirmation] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [activateConfirmation, setActivateConfirmation] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, userId: id });
  };

  const confirmSuspend = (user: User) => {
    setSuspendConfirmation({ isOpen: true, user });
  };

  const confirmActivate = (user: User) => {
    setActivateConfirmation({ isOpen: true, user });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.userId) return;

    try {
      await deleteUser(deleteConfirmation.userId);
      setDeleteConfirmation({ isOpen: false, userId: null });
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleSuspend = async () => {
    if (!suspendConfirmation.user) return;

    try {
      await suspendUser(suspendConfirmation.user.id);
      setSuspendConfirmation({ isOpen: false, user: null });
    } catch (error) {
      console.error('Failed to suspend user', error);
    }
  };

  const handleActivate = async () => {
    if (!activateConfirmation.user) return;

    try {
      await activateUser(activateConfirmation.user.id);
      setActivateConfirmation({ isOpen: false, user: null });
    } catch (error) {
      console.error('Failed to activate user', error);
    }
  };

  const handleVerifyEmail = async (id: string) => {
    try {
      await verifyUserEmail(id);
    } catch (error) {
      console.error('Failed to verify email', error);
    }
  };

  const handleSubmit = async (data: CreateUserRequest) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Prepare update data - allow partial updates
        const updateData: UpdateUserRequest = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          role: data.role,
          country: data.country,
          state: data.state,
          town_city: data.town_city,
          address: data.address,
        };
        await updateUser({
          id: editingUser.id,
          data: updateData,
        });
      } else {
        await createUser(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (usersLoading) {
    return <Loading />;
  }

  const usersList = usersResponse?.data?.data || [];
  const pagination = usersResponse?.data?.pagination;
  const isEmpty = usersList.length === 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Users Management"
          description="Manage all users in the system."
          icon={<UserGroupIcon className="h-12 w-12" />}
        />
        <Button onClick={handleCreate} icon={<PlusIcon className="h-5 w-5" />}>
          Create User
        </Button>
      </div>

      <div className="mt-8">
        {isEmpty ? (
          <div className="text-center py-12 bg-(--color-surface) rounded-3xl border border-dashed border-(--color-border)">
            <UserGroupIcon className="h-12 w-12 mx-auto text-(--color-inactive) mb-3" />
            <h3 className="text-lg font-medium text-(--color-text)">
              No users found
            </h3>
            <p className="text-(--color-body)">
              There are no users registered in the system yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {usersList.map((user) => (
                <div
                  key={user.id}
                  className={`
                    relative bg-(--color-surface) rounded-2xl border transition-all duration-200 flex flex-col
                    ${
                      user.status === 'active'
                        ? 'border-(--color-border) shadow-sm hover:shadow-md'
                        : 'border-(--color-border) opacity-75 bg-(--color-background)/50'
                    }
                  `}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`
                        px-2.5 py-1 rounded-full text-xs font-medium border
                        ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : user.status === 'suspended'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                        }
                      `}
                    >
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col items-center text-center mt-4">
                    {/* Avatar */}
                    <div className="mb-4">
                      <div className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-bold text-3xl">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          user.first_name.charAt(0)
                        )}
                      </div>
                    </div>

                    {/* Name & Role */}
                    <h3 className="font-bold text-lg text-(--color-text) mb-1">
                      {user.first_name} {user.last_name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-4 capitalize">
                      {user.role}
                    </span>

                    {/* Details */}
                    <div className="w-full space-y-2 text-sm text-(--color-body)">
                      <div
                        className="flex items-center justify-center gap-2"
                        title={user.email}
                      >
                        <EnvelopeIcon className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="truncate max-w-[180px]">
                          {user.email}
                        </span>
                        {user.email_verified_at ? (
                          <CheckCircleIcon
                            className="h-4 w-4 text-emerald-500"
                            title="Verified"
                          />
                        ) : (
                          <div
                            className="h-2 w-2 rounded-full bg-amber-400"
                            title="Unverified"
                          />
                        )}
                      </div>
                      {user.phone_number && (
                        <div className="flex items-center justify-center gap-2">
                          <PhoneIcon className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="truncate">{user.phone_number}</span>
                        </div>
                      )}
                      {(user.town_city || user.country) && (
                        <div className="flex items-center justify-center gap-2">
                          <MapPinIcon className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="truncate">
                            {[user.town_city, user.country]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-(--color-border) space-y-2">
                    {!user.email_verified_at && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-blue-600 hover:bg-blue-50 border-blue-200"
                        onClick={() => handleVerifyEmail(user.id)}
                        icon={<EnvelopeIcon className="h-4 w-4" />}
                      >
                        Verify Email
                      </Button>
                    )}

                    {user.status === 'suspended' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                        onClick={() => confirmActivate(user)}
                        icon={<CheckCircleIcon className="h-4 w-4" />}
                      >
                        Activate User
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-amber-600 hover:bg-amber-50 border-amber-200"
                        onClick={() => confirmSuspend(user)}
                        icon={<NoSymbolIcon className="h-4 w-4" />}
                      >
                        Suspend User
                      </Button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-center"
                        onClick={() => handleEdit(user)}
                        icon={<PencilIcon className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-center text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                        onClick={() => confirmDelete(user.id)}
                        icon={<TrashIcon className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUser}
        isLoading={isSubmitting}
      />

      <UserDeleteModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, userId: null })}
        onConfirm={handleDelete}
        isLoading={false}
      />

      <UserSuspendModal
        isOpen={suspendConfirmation.isOpen}
        onClose={() => setSuspendConfirmation({ isOpen: false, user: null })}
        onConfirm={handleSuspend}
        user={suspendConfirmation.user}
        isLoading={false}
      />

      <UserActivateModal
        isOpen={activateConfirmation.isOpen}
        onClose={() => setActivateConfirmation({ isOpen: false, user: null })}
        onConfirm={handleActivate}
        user={activateConfirmation.user}
        isLoading={false}
      />
    </div>
  );
};

export default Users;
