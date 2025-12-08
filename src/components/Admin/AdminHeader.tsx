import { useState } from 'react';
import {
  Bars3Icon,
  BellIcon,
  Cog8ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { admin, clearAuth } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setIsMenuOpen(false);
    navigate('/');
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
  const role = admin?.role || 'Administrator';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-(--color-surface) border-b border-(--color-border) shadow-sm">
      <div className="flex h-full items-center justify-between px-4 lg:px-8">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-(--color-hover) transition-colors"
          >
            <Bars3Icon className="h-6 w-6 text-(--color-primary)" />
          </button>
          <div className="font-extrabold text-2xl bg-linear-to-r from-(--color-primary) to-(--color-accent) bg-clip-text text-transparent">
            Xdrive
          </div>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-(--color-hover) transition-colors">
            <BellIcon className="h-5 w-5 text-(--color-body)" />
          </button>
          <button className="p-2 rounded-lg hover:bg-(--color-hover) transition-colors">
            <Cog8ToothIcon className="h-5 w-5 text-(--color-body)" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-(--color-hover) transition-colors"
            >
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-(--color-text)">
                  {fullName}
                </p>
                <p className="text-xs text-(--color-inactive)">{role}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary) text-white font-bold text-sm">
                {getInitials(fullName)}
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-(--color-surface) rounded-lg shadow-xl border border-(--color-border) py-2">
                <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-(--color-hover) transition-colors">
                  Profile Settings
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-(--color-hover) transition-colors">
                  Change Password
                </button>
                <hr className="my-2 border-(--color-border)" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-(--color-error) hover:bg-error-container transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
