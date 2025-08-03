import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

/**
 * Protected Route Component
 * Restricts access to authenticated users
 * Optionally restricts access to admin users
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;