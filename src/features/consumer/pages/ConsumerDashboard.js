import React from 'react';
import { FaShoppingCart, FaLeaf, FaHandshake, FaCertificate, FaRupeeSign, FaTruck, FaSeedling } from 'react-icons/fa';
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
 * Consumer Dashboard - Agriculture Marketplace
 * Direct farmer-to-consumer platform for fresh organic produce
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

  // Agriculture Categories
  const categories = ['All', 'Vegetables', 'Leafy Greens', 'Grains & Pulses', 'Fruits', 'Spices'];

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

  return (
    <div className="consumer-dashboard">
      {/* Top Header Strip */}
      <div className="top-header-strip">
        <div className="header-strip-content">
          <FaSeedling className="strip-icon" />
          <p>Fresh crops directly from farmers to your doorstep.</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-headline">Support Farmers, Eat Healthy.</h1>
            <p className="hero-subtext">100% Organic produce sourced directly from local farmers.</p>
            <button className="hero-button">Shop Now</button>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600" 
              alt="Fresh vegetables from farm" 
            />
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Info Cards Strip */}
        <div className="info-cards-strip">
          <div className="info-card">
            <div className="info-icon">
              <FaHandshake />
            </div>
            <div className="info-text">Direct from Farmer</div>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <FaCertificate />
            </div>
            <div className="info-text">Organic Certified</div>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <FaRupeeSign />
            </div>
            <div className="info-text">Fair Price</div>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <FaTruck />
            </div>
            <div className="info-text">Farm Fresh Delivery</div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${
                (category === 'All' && selectedCategory === 'all') ||
                category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === selectedCategory
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                if (category === 'All') {
                  setSelectedCategory('all');
                } else {
                  setSelectedCategory(category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
                }
              }}
            >
              {category === 'Vegetables' && '🥕'}
              {category === 'Leafy Greens' && '🥬'}
              {category === 'Grains & Pulses' && '🌾'}
              {category === 'Fruits' && '🍎'}
              {category === 'Spices' && '🌶️'}
              {category === 'All' && '📦'}
              {' '}
              {category}
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="filter-search-section">
          <FilterSection
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            organicOnly={organicOnly}
            onOrganicToggle={setOrganicOnly}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Products Info */}
        <div className="products-info">
          <p>
            Showing <span className="products-count">{filteredProducts.length}</span> fresh products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading fresh products...</p>
          </div>
        ) : (
          <div className="products-grid">
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
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}

        {/* Promotional Banner */}
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-text">
              <h2>Are you a Farmer?</h2>
              <p>Sell your crops easily and reach thousands of customers</p>
            </div>
            <button className="promo-button">Join as Farmer</button>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
                <FaLeaf className="footer-logo-icon" />
                <span className="footer-logo-text">FARM2HOME</span>
              </div>
              <p className="footer-tagline">Empowering Indian Agriculture</p>
            </div>
            <div className="footer-column">
              <h4>Shop</h4>
              <ul>
                <li><a href="#rice">Rice</a></li>
                <li><a href="#wheat">Wheat</a></li>
                <li><a href="#dal">Dal</a></li>
                <li><a href="#spices">Spices</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#farmers">Our Farmers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Help</h4>
              <ul>
                <li><a href="#shipping">Shipping Policy</a></li>
                <li><a href="#returns">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Farm2Home. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
