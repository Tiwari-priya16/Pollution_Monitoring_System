import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-forest-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Verifying security credentials...</p>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Determine proper fallback dashboard according to their actual role
    const fallbackPath =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'officer'
        ? '/officer/dashboard'
        : '/citizen/dashboard';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
