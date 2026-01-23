import React, { useState, useEffect, useRef } from 'react';
import { 
  FaShoppingCart, 
  FaLeaf, 
  FaHandshake, 
  FaCertificate, 
  FaRupeeSign, 
  FaTruck, 
  FaSeedling,
  FaAward,
  FaShieldAlt,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaBox,
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard/ProductCard';
import SearchBar from '../components/Filters/SearchBar';
import FilterSection from '../components/Filters/FilterSection';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { useFilters } from '../hooks/useFilters';
import { useProducts } from '../hooks/useProducts';
import { sampleProducts } from '../data/productsData';
import './ConsumerDashboard.css';

/**
 * Consumer Dashboard - Modern Agriculture Marketplace
 * Premium farmer-to-consumer platform for fresh organic produce
 */
const ConsumerDashboard = () => {
  // Fetch products from Firestore (silently in background)
  const { products: firestoreProducts, loading } = useProducts({ realtime: true });
  
  // Use Firestore products if available, otherwise use sample data
  const productsToUse = firestoreProducts.length > 0 ? firestoreProducts : sampleProducts;
  
  // Custom Hooks
  const { addToCart, getTotalItems } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    organicOnly,
    setOrganicOnly,
    filteredProducts,
    resetFilters
  } = useFilters(productsToUse);

  // Local state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Ref for category section
  const categorySectionRef = useRef(null);

  // Scroll detection for sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (categorySectionRef.current) {
        const categoryBottom = categorySectionRef.current.getBoundingClientRect().bottom;
        // Show sidebar when category section is scrolled past
        setShowSidebar(categoryBottom <= 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Agriculture Categories with images
  const categories = [
    { name: 'All', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=300', id: 'all' },
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300', id: 'vegetables' },
    { name: 'Leafy Greens', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300', id: 'leafy-greens' },
    { name: 'Grains & Pulses', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', id: 'grains-pulses' },
    { name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300', id: 'fruits' },
    { name: 'Spices', image: 'https://images.unsplash.com/photo-1596040033229-a0b83fd2f6dd?w=300', id: 'spices' }
  ];

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    console.log(`Added ${product.name} to cart!`);
  };

  // Handle viewing product details
  const handleViewDetails = (product) => {
    console.log('View product details:', product);
  };

  // Calculate stats
  const totalProducts = productsToUse.length;
  const organicCount = productsToUse.filter(p => p.organic).length;
  const cartCount = getTotalItems();
  const activeFarmers = 150; // This would come from backend

  return (
    <div className="consumer-dashboard">
      {/* Hero Section - Redesigned */}
      <section className="hero-section-modern">
        <div className="hero-overlay"></div>
        <div className="hero-content-modern">
          <h1 className="hero-title-modern">
            Farm Fresh to Your
            <span className="hero-highlight"> Doorstep</span>
          </h1>
        </div>
      </section>

      <div className="container">
        {/* Category Section - Redesigned */}
        <section className="category-section" ref={categorySectionRef}>
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our fresh produce collection</p>
          </div>
          <div className="category-grid-modern">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-card-modern ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-name">{category.name}</div>
                {selectedCategory === category.id && (
                  <div className="category-check">
                    <FaCheckCircle />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content with Sidebar Layout */}
        <section className="main-content-section">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showSidebar ? 'visible' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
            </div>
            <FilterSection
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              organicOnly={organicOnly}
              onOrganicToggle={setOrganicOnly}
              onResetFilters={resetFilters}
            />
          </aside>

          {/* Products Area */}
          <div className="products-area">
            {/* Products Info */}
            <div className="products-info-header">
              <h3>Discover Products</h3>
              <p className="products-count-badge">
                {filteredProducts.length} products available
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="loading-state-modern">
                <div className="loading-spinner-modern"></div>
                <p className="loading-text-modern">Loading fresh products...</p>
              </div>
            ) : (
              <div className="products-grid-modern">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={isFavorite(product.id)}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="no-products-modern">
                    <div className="no-products-illustration">
                      <FaBox />
                    </div>
                    <h3>No Products Found</h3>
                    <p>Try adjusting your filters or browse different categories</p>
                    <button className="reset-btn" onClick={resetFilters}>
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer - Redesigned */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <div className="brand-logo">
                <FaLeaf className="brand-icon" />
                <span className="brand-name">FARM2HOME</span>
              </div>
              <p className="brand-tagline">
                Connecting farmers and consumers for a healthier, sustainable future.
              </p>
              <div className="social-links">
                {/* Add social media icons here if needed */}
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Shop</h4>
              <ul className="footer-links">
                <li><a href="#vegetables">Vegetables</a></li>
                <li><a href="#fruits">Fruits</a></li>
                <li><a href="#grains">Grains & Pulses</a></li>
                <li><a href="#spices">Spices</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#farmers">Our Farmers</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#shipping">Shipping Policy</a></li>
                <li><a href="#returns">Returns & Refunds</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Farm2Home. All rights reserved. Built with ❤️ for Indian Farmers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConsumerDashboard;
