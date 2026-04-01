import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // TEMP: Auth bypass switch (disable login/register UI and allow direct navigation)
  // Set to false to restore normal authentication gating.
  const TEMP_BYPASS_AUTH = true;

  const { currentUser, userData } = useAuth();

  if (TEMP_BYPASS_AUTH) return children;

  if (!currentUser) {
    const role = allowedRoles?.[0] || 'consumer';
    return <Navigate to="/" state={{ openModal: true, role }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    const dest = userData?.role === 'farmer' ? '/farmer-dashboard' : '/consumer';
    return <Navigate to={dest} replace />;
  }

  return children;
};

export default ProtectedRoute;
