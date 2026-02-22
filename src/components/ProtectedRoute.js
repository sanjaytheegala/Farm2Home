import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    // Not logged in — go home and auto-open the login modal for the required role
    const role = allowedRoles?.[0] || 'consumer';
    return <Navigate to="/" state={{ openModal: true, role }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    // Wrong role — send to their own dashboard
    const dest = userData?.role === 'farmer' ? '/farmer-dashboard' : '/consumer';
    return <Navigate to={dest} replace />;
  }

  return children;
};

export default ProtectedRoute;
