// App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Import styles
import './App.css';
import './styles/responsive.css';

// Lazy load pages for better performance - Using feature-based structure
const HomePage = React.lazy(() => import('./features/home/pages/HomePage'));
const FarmerDashboard = React.lazy(() => import('./features/farmer/pages/FarmerDashboard'));
// Using new modular ConsumerDashboard
const ConsumerDashboard = React.lazy(() => import('./features/consumer/pages/ConsumerDashboard'));
const SignupPage = React.lazy(() => import('./features/auth/pages/SignupPage'));
const LoginPage = React.lazy(() => import('./features/auth/pages/LoginPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const ResourceSharePage = React.lazy(() => import('./pages/ResourceSharePage'));
const CropRecommendationPage = React.lazy(() => import('./pages/CropRecommendationPage'));

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
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
              {/* Temporarily disabled authentication - will be added later */}
              <Route
                path="/resource-share"
                element={
                  // <ProtectedRoute allowedRoles={['farmer']}>
                    <ResourceSharePage />
                  // </ProtectedRoute>
                }
              />

              <Route
                path="/farmer"
                element={<FarmerDashboard />}
              />
              <Route
                path="/consumer"
                element={<ConsumerDashboard />}
              />
            </Routes>
          </Suspense>
        </div>
        <Analytics />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
