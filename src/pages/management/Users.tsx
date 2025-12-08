import { UserGroupIcon } from '@heroicons/react/24/outline';

const Users = () => {
  return (
    <div>
      <div className="mb-12 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-text) flex items-center gap-4 mb-3">
          <UserGroupIcon className="h-12 w-12 text-(--color-primary)" />
          Users Management
        </h1>
        <p className="text-lg text-(--color-body)">
          Manage all users in the system.
        </p>
      </div>

      <div className="bg-(--color-surface) border border-dashed border-(--color-primary)/30 rounded-3xl p-16 text-center shadow-inner">
        <h2 className="text-2xl font-bold text-(--color-text) mb-4">
          Coming Soon
        </h2>
        <p className="text-(--color-body) max-w-md mx-auto leading-relaxed">
          Users management interface is under development.
        </p>
      </div>
    </div>
  );
};

export default Users;
