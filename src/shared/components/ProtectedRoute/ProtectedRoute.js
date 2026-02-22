import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    // Not logged in — go home and auto-open the login modal
    const role = allowedRoles?.[0] || 'consumer';
    return <Navigate to="/" state={{ openModal: true, role }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    // User is logged in, but does not have the required role
    // Redirect them to a page they do have access to (e.g., home or their dashboard)
    // Or show an 'Unauthorized' page
    return <Navigate to="/" />; 
  }

  return children;
};

export default ProtectedRoute;
