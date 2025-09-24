// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ResourceSharePage from './pages/ResourceSharePage';
// Removed EcommercePage import
import CropRecommendationPage from './pages/CropRecommendationPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            {/* Removed ecommerce route */}
            <Route path="/crop-recommendations" element={<CropRecommendationPage />} />
            
            {/* Resource Share - Protected route for farmers */}
            <Route
              path="/resource-share"
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <ResourceSharePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/farmer"
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consumer"
              element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <ConsumerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
