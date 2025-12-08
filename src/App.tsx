import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyForgotPassword from './pages/auth/VerifyForgotPassword';
import Users from './pages/management/Users';
import Mechanics from './pages/management/Mechanics';
import Workshops from './pages/management/Workshops';
import NotFound from './pages/NotFound';
import { ProtectedRoute, ScrollToTop } from './components';
import { AdminLayout } from './components/Admin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/verify-forgot-password"
        element={<VerifyForgotPassword />}
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Management Routes */}
      <Route
        path="/management/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/mechanics"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Mechanics />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/workshops"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Workshops />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 - Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
