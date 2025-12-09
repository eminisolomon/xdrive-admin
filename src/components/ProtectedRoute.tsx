import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'admin',
}) => {
  const { admin, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole && admin.role !== requiredRole) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
