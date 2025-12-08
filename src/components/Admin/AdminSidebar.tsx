import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  ReceiptPercentIcon,
  Cog6ToothIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  {
    label: 'Dashboard',
    icon: <ChartBarIcon className="h-6 w-6" />,
    path: '/dashboard',
  },
  {
    label: 'Management',
    icon: <UserGroupIcon className="h-6 w-6" />,
    children: [
      {
        label: 'Users',
        icon: <UserGroupIcon className="h-5 w-5" />,
        path: '/management/users',
      },
      {
        label: 'Mechanics',
        icon: <WrenchScrewdriverIcon className="h-5 w-5" />,
        path: '/management/mechanics',
      },
      {
        label: 'Workshops',
        icon: <BuildingStorefrontIcon className="h-5 w-5" />,
        path: '/management/workshops',
      },
    ],
  },
  {
    label: 'Vehicles',
    icon: <TruckIcon className="h-6 w-6" />,
    children: [
      {
        label: 'Cars',
        icon: <TruckIcon className="h-5 w-5" />,
        path: '/vehicles/cars',
      },
      {
        label: 'Brands',
        icon: <TruckIcon className="h-5 w-5" />,
        path: '/vehicles/brands',
      },
      {
        label: 'Models',
        icon: <TruckIcon className="h-5 w-5" />,
        path: '/vehicles/models',
      },
      {
        label: 'Body Types',
        icon: <TruckIcon className="h-5 w-5" />,
        path: '/vehicles/body-types',
      },
    ],
  },
  {
    label: 'Services',
    icon: <ReceiptPercentIcon className="h-6 w-6" />,
    children: [
      {
        label: 'Services',
        icon: <ReceiptPercentIcon className="h-5 w-5" />,
        path: '/services/list',
      },
      {
        label: 'Subscriptions',
        icon: <ReceiptPercentIcon className="h-5 w-5" />,
        path: '/services/subscriptions',
      },
      {
        label: 'Plans',
        icon: <ReceiptPercentIcon className="h-5 w-5" />,
        path: '/services/plans',
      },
    ],
  },
  {
    label: 'System',
    icon: <Cog6ToothIcon className="h-6 w-6" />,
    children: [
      {
        label: 'Settings',
        icon: <Cog6ToothIcon className="h-5 w-5" />,
        path: '/system/settings',
      },
      {
        label: 'Notifications',
        icon: <Cog6ToothIcon className="h-5 w-5" />,
        path: '/system/notifications',
      },
      {
        label: 'Maintenance',
        icon: <Cog6ToothIcon className="h-5 w-5" />,
        path: '/system/maintenance',
      },
    ],
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const parents: string[] = [];
    SIDEBAR_ITEMS.forEach((item) => {
      if (item.children) {
        const active = item.children.some(
          (child) => child.path && location.pathname.startsWith(child.path),
        );
        if (active) parents.push(item.label);
      }
    });
    setExpanded(parents);
  }, [location.pathname]);

  const toggleExpand = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const isActive = (path?: string) =>
    path && location.pathname.startsWith(path);

  const handleParentClick = (item: any) => {
    if (item.children) toggleExpand(item.label);
    else if (item.path) {
      navigate(item.path);
      onClose?.();
    }
  };

  const handleChildClick = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      <aside className="hidden md:block fixed top-16 left-0 w-[280px] h-[calc(100vh-64px)] bg-(--color-surface) border-r border-(--color-border) overflow-y-auto">
        <nav className="flex flex-col h-full antialiased">
          <ul className="flex-1 px-4 pt-6 space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleParentClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-semibold text-base ${
                    isActive(item.path)
                      ? 'bg-(--color-primary-container) text-(--color-primary)'
                      : 'text-(--color-body) hover:bg-(--color-primary-container) hover:text-(--color-primary)'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.children &&
                    (expanded.includes(item.label) ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    ))}
                </button>

                {item.children && expanded.includes(item.label) && (
                  <ul className="mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <button
                          onClick={() =>
                            child.path && handleChildClick(child.path)
                          }
                          className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                            isActive(child.path)
                              ? 'bg-(--color-primary-container) text-(--color-primary)'
                              : 'text-(--color-body) hover:bg-(--color-primary-container) hover:text-(--color-primary)'
                          }`}
                        >
                          {child.icon}
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="p-4 border-t border-(--color-border) bg-(--color-elevation-1) text-center text-xs text-(--color-inactive)">
            <p>Xdrive Admin v1.0</p>
            <p className="mt-1">© 2025 Xdrive Automobile</p>
          </div>
        </nav>
      </aside>

      {open && (
        <aside className="md:hidden fixed top-16 left-0 w-[280px] h-[calc(100vh-64px)] bg-(--color-surface) border-r border-(--color-border) overflow-y-auto z-20">
          <nav className="flex flex-col h-full antialiased">
            <ul className="flex-1 px-4 pt-6 space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleParentClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-semibold text-base ${
                      isActive(item.path)
                        ? 'bg-(--color-primary-container) text-(--color-primary)'
                        : 'text-(--color-body) hover:bg-(--color-primary-container) hover:text-(--color-primary)'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    {item.children &&
                      (expanded.includes(item.label) ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      ))}
                  </button>

                  {item.children && expanded.includes(item.label) && (
                    <ul className="mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <button
                            onClick={() =>
                              child.path && handleChildClick(child.path)
                            }
                            className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                              isActive(child.path)
                                ? 'bg-(--color-primary-container) text-(--color-primary)'
                                : 'text-(--color-body) hover:bg-(--color-primary-container) hover:text-(--color-primary)'
                            }`}
                          >
                            {child.icon}
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="p-4 border-t border-(--color-border) bg-(--color-elevation-1) text-center text-xs text-(--color-inactive)">
              <p>Xdrive Admin v1.0</p>
              <p className="mt-1">© 2025 Xdrive Automobile</p>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};

export default AdminSidebar;
