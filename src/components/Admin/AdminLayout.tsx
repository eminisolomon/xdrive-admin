import { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-(--color-background) text-(--color-text)">
      <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 pt-16 md:ml-[280px] px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <Outlet />
      </main>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
        />
      )}
    </div>
  );
};

export default AdminLayout;
