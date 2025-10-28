import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const { role } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check role permissions if specified
  if (allowedRoles && role) {
    const userRole = role.name;
    const hasPermission = allowedRoles.includes(userRole);
    
    if (!hasPermission) {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location.pathname }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;