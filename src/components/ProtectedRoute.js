// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with real auth check later
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
