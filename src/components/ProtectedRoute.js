import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    // User is logged in, but does not have the required role
    // Redirect them to a page they do have access to (e.g., home or their dashboard)
    // Or show an 'Unauthorized' page
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;
