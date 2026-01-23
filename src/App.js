// App.js
import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

// Navigation wrapper component to handle navbar interactions
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [cartCount, setCartCount] = useState(0);

  const isConsumerPage = location.pathname === '/consumer';

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error reading cart:', error);
        setCartCount(0);
      }
    };

    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Handle tab changes in consumer dashboard
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    switch(tab) {
      case 'browse':
        navigate('/consumer');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'deals':
        // Handle deals - could scroll to deals section or navigate
        navigate('/consumer');
        break;
      case 'profile':
        // Handle profile navigation
        console.log('Profile clicked - implement profile page');
        break;
      default:
        break;
    }
  };

  const handleSearchClick = () => {
    // Scroll to products section or show search modal
    if (isConsumerPage) {
      const searchSection = document.querySelector('.products-area');
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <Navbar 
        cartCount={cartCount}
        notifications={[]}
        isConsumerDashboard={isConsumerPage}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearchClick={handleSearchClick}
        showCart={true}
        showOrders={true}
      />
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
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <AppContent />
        </div>
        <Analytics />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
