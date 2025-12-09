import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Public
import Home from './pages/Home';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyForgotPassword from './pages/auth/VerifyForgotPassword';
import NotFound from './pages/NotFound';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/management/Users';
import Mechanics from './pages/management/Mechanics';
import Workshops from './pages/management/Workshops';
import Cars from './pages/vehicles/Cars';
import Brands from './pages/vehicles/Brands';
import Models from './pages/vehicles/Models';
import BodyTypes from './pages/vehicles/BodyTypes';
import ServicesList from './pages/services/ServicesList';
import Subscriptions from './pages/services/Subscriptions';
import Plans from './pages/services/Plans';
import Settings from './pages/system/Settings';
import Notifications from './pages/system/Notifications';
import Maintenance from './pages/system/Maintenance';

// Finance
import Payments from './pages/finance/Payments';

// Reports
import Reports from './pages/reports/Reports';

// Feedback
import Reviews from './pages/feedback/Reviews';
import Comments from './pages/feedback/Comments';

// Account
import Profile from './pages/account/Profile';
import ChangePassword from './pages/account/ChangePassword';

// Components
import { ProtectedRoute, ScrollToTop } from './components';
import { AdminLayout } from './components/Admin';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/verify-forgot-password"
          element={<VerifyForgotPassword />}
        />

        {/* ALL Protected Admin Routes — ONE wrapper */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Dashboard & Pages */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Management */}
          <Route path="management/users" element={<Users />} />
          <Route path="management/mechanics" element={<Mechanics />} />
          <Route path="management/workshops" element={<Workshops />} />

          {/* Finance */}
          <Route path="finance/payments" element={<Payments />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Feedback */}
          <Route path="feedback/reviews" element={<Reviews />} />
          <Route path="feedback/comments" element={<Comments />} />

          {/* Vehicles */}
          <Route path="vehicles/cars" element={<Cars />} />
          <Route path="vehicles/brands" element={<Brands />} />
          <Route path="vehicles/models" element={<Models />} />
          <Route path="vehicles/body-types" element={<BodyTypes />} />

          {/* Services */}
          <Route path="services/list" element={<ServicesList />} />
          <Route path="services/subscriptions" element={<Subscriptions />} />
          <Route path="services/plans" element={<Plans />} />

          {/* System */}
          <Route path="system/settings" element={<Settings />} />
          <Route path="system/notifications" element={<Notifications />} />
          <Route path="system/maintenance" element={<Maintenance />} />

          {/* Account */}
          <Route path="account/profile" element={<Profile />} />
          <Route path="account/change-password" element={<ChangePassword />} />
        </Route>

        {/* 404 - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
