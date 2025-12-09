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
import { Button, Loading, Pagination, Modal } from '@/components';
import { UserModal } from '@/components/User';
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

  // Confirmation states
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
                    group relative bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden
                    ${user.status === 'suspended' ? 'opacity-75 bg-red-50/10' : ''}
                    ${user.status === 'inactive' ? 'opacity-75 bg-gray-50/50' : ''}
                  `}
                >
                  {/* Status Strip */}
                  <div
                    className={`h-1.5 w-full 
                    ${user.status === 'active' ? 'bg-emerald-500' : ''}
                    ${user.status === 'suspended' ? 'bg-red-500' : ''}
                    ${user.status === 'inactive' ? 'bg-gray-300' : ''}
                  `}
                  />

                  <div className="p-5 flex-1 flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-3">
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
                      {/* Status Dot */}
                      <div
                        className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center
                                ${user.status === 'active' ? 'bg-emerald-500' : ''}
                                ${user.status === 'suspended' ? 'bg-red-500' : ''}
                                ${user.status === 'inactive' ? 'bg-gray-400' : ''}
                            `}
                        title={user.status}
                      >
                        {user.status === 'suspended' && (
                          <NoSymbolIcon className="h-3 w-3 text-white" />
                        )}
                        {user.status === 'active' && (
                          <CheckCircleIcon className="h-3 w-3 text-white" />
                        )}
                        {user.status === 'inactive' && (
                          <div className="h-2 w-2 rounded-full bg-white" />
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
                  <div className="border-t border-(--color-border) bg-(--color-background)/30 p-2 flex justify-between items-center gap-1">
                    <div className="flex gap-1">
                      {user.status === 'suspended' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-2! py-1! text-emerald-600 hover:bg-emerald-50 border-transparent hover:border-emerald-200"
                          onClick={() => confirmActivate(user)}
                          title="Activate"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-2! py-1! text-amber-600 hover:bg-amber-50 border-transparent hover:border-amber-200"
                          onClick={() => confirmSuspend(user)}
                          title="Suspend"
                        >
                          <NoSymbolIcon className="h-5 w-5" />
                        </Button>
                      )}
                      {!user.email_verified_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-2! py-1! text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200"
                          onClick={() => handleVerifyEmail(user.id)}
                          title="Verify Email"
                        >
                          <EnvelopeIcon className="h-5 w-5" />
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2! py-1! text-gray-600 hover:bg-gray-100 border-transparent hover:border-gray-200"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2! py-1! text-red-500 hover:bg-red-50 border-transparent hover:border-red-200"
                        onClick={() => confirmDelete(user.id)}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, userId: null })}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-(--color-body)">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, userId: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Suspend Confirmation Modal */}
      <Modal
        isOpen={suspendConfirmation.isOpen}
        onClose={() => setSuspendConfirmation({ isOpen: false, user: null })}
        title="Suspend User"
      >
        <div className="space-y-4">
          <p className="text-(--color-body)">
            Are you sure you want to suspend{' '}
            <b>{suspendConfirmation.user?.first_name}</b>? They will not be able
            to log in until suspended status is removed.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setSuspendConfirmation({ isOpen: false, user: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSuspend}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Suspend
            </Button>
          </div>
        </div>
      </Modal>

      {/* Activate Confirmation Modal */}
      <Modal
        isOpen={activateConfirmation.isOpen}
        onClose={() => setActivateConfirmation({ isOpen: false, user: null })}
        title="Activate User"
      >
        <div className="space-y-4">
          <p className="text-(--color-body)">
            Are you sure you want to activate{' '}
            <b>{activateConfirmation.user?.first_name}</b>? They will regain
            access to the system.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setActivateConfirmation({ isOpen: false, user: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleActivate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Activate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
