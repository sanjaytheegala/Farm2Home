import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { useLocalStorage, useDebounce } from '../hooks';
import { memoizedFilter, calculateCartTotal } from '../utils/performance';
import LazyImage from '../components/LazyImage';

const ConsumerDashboard = () => {
  // Static data - moved outside component to prevent recreation
  const dryFruits = useMemo(() => [
    { crop: 'Badam', quantity: '20kg', price: 8000, image: '/images/Badam.jpg', image2: '/images/badam2.jpg', rating: 4.5, reviews: 12, farmer: 'Rajesh Kumar', location: 'Hyderabad, Telangana' },
    { crop: 'Cashews', quantity: '20kg', price: 9000, image: '/images/cashews.jpg', rating: 4.3, reviews: 8, farmer: 'Suresh Patel', location: 'Mumbai, Maharashtra' },
    { crop: 'Pista', quantity: '20kg', price: 8500, image: '/images/pista.jpg', image2: '/images/Pista2.jpg', rating: 4.7, reviews: 15, farmer: 'Amit Singh', location: 'Delhi, Delhi' },
    { crop: 'Walnut', quantity: '20kg', price: 9500, image: '/images/Waltnut.jpg', image2: '/images/waltnuts2.jpg', rating: 4.2, reviews: 6, farmer: 'Kumar Reddy', location: 'Bangalore, Karnataka' },
    { crop: 'Peanut', quantity: '50kg', price: 1200, image: '/images/Peanuts.jpg', image2: '/images/Peanut2.jpg', rating: 4.0, reviews: 20, farmer: 'Lakshmi Devi', location: 'Chennai, Tamil Nadu' },
    { crop: 'Hazelnuts', quantity: '15kg', price: 12000, image: '/images/hazel nuts.jpg', rating: 4.6, reviews: 9, farmer: 'Nut Farm Co.', location: 'Srinagar, Jammu & Kashmir' },
    { crop: 'Chestnuts', quantity: '25kg', price: 6000, image: '/images/chestnuts.jpg', rating: 4.1, reviews: 7, farmer: 'Chestnut Valley', location: 'Dehradun, Uttarakhand' },
    { crop: 'Macadamia', quantity: '10kg', price: 15000, image: '/images/macadamia.jpg', rating: 4.8, reviews: 5, farmer: 'Premium Nuts', location: 'Shimla, Himachal Pradesh' },
    { crop: 'Lotus Seeds', quantity: '30kg', price: 4000, image: '/images/lotus seed.jpg', rating: 4.3, reviews: 11, farmer: 'Lotus Farm', location: 'Kolkata, West Bengal' }
  ], []);

  const fruits = useMemo(() => [
    { crop: 'Apple', quantity: '40kg', price: 2500, image: '/images/Apple.jpg', rating: 4.6, reviews: 25, farmer: 'Fruit Farm Co.', location: 'Shimla, Himachal Pradesh' },
    { crop: 'Banana', quantity: '100kg', price: 900, image: '/images/Banana.jpg', image2: '/images/Banana2.jpg', rating: 4.1, reviews: 30, farmer: 'Organic Bananas', location: 'Thiruvananthapuram, Kerala' },
    { crop: 'Mango', quantity: '30kg', price: 2000, image: '/images/Mango.jpg', rating: 4.8, reviews: 18, farmer: 'Mango Paradise', location: 'Mumbai, Maharashtra' },
    { crop: 'Grapes', quantity: '50kg', price: 1800, image: '/images/green grape.jpg', rating: 4.4, reviews: 12, farmer: 'Vineyard Fresh', location: 'Nashik, Maharashtra' },
    { crop: 'Sapota', quantity: '35kg', price: 1100, image: '/images/sapota.jpg', image2: '/images/sapota2.jpg', rating: 4.2, reviews: 10, farmer: 'Sweet Fruits', location: 'Chennai, Tamil Nadu' },
    { crop: 'Guava', quantity: '50kg', price: 900, image: '/images/guva.jpg', rating: 4.3, reviews: 15, farmer: 'Guava Garden', location: 'Lucknow, Uttar Pradesh' },
    { crop: 'Custard Apple', quantity: '30kg', price: 2000, image: '/images/Custard apple.jpg', image2: '/images/custard apple2.jpg', rating: 4.1, reviews: 9, farmer: 'Custard Farm', location: 'Bhopal, Madhya Pradesh' },
    { crop: 'Pomegranate', quantity: '40kg', price: 2200, image: '/images/Promoganate.jpg', rating: 4.5, reviews: 14, farmer: 'Pomegranate Plus', location: 'Mumbai, Maharashtra' },
    { crop: 'Dragon Fruit', quantity: '20kg', price: 4000, image: '/images/dragon fruit.jpg', rating: 4.8, reviews: 3, farmer: 'Exotic Fruits', location: 'Panaji, Goa' },
    { crop: 'Strawberry', quantity: '30kg', price: 3200, image: '/images/strawberry.jpg', rating: 4.6, reviews: 11, farmer: 'Berry Farm', location: 'Chandigarh, Punjab' },
    { crop: 'Orange', quantity: '60kg', price: 1500, image: '/images/orange.jpg', rating: 4.4, reviews: 22, farmer: 'Citrus Farm', location: 'Nagpur, Maharashtra' },
    { crop: 'Kiwi', quantity: '15kg', price: 5000, image: '/images/kiwi.jpg', rating: 4.9, reviews: 4, farmer: 'Kiwi Kingdom', location: 'Shimla, Himachal Pradesh' },
    { crop: 'Peach', quantity: '25kg', price: 2800, image: '/images/Peach.jpg', rating: 4.7, reviews: 8, farmer: 'Peach Orchard', location: 'Jammu, Jammu & Kashmir' },
    { crop: 'Water Apple', quantity: '40kg', price: 1200, image: '/images/water apple.jpg', rating: 4.0, reviews: 6, farmer: 'Water Apple Farm', location: 'Thiruvananthapuram, Kerala' },
    { crop: 'Watermelon', quantity: '80kg', price: 800, image: '/images/water melon.jpg', rating: 4.2, reviews: 16, farmer: 'Melon Farm', location: 'Jaipur, Rajasthan' },
    { crop: 'Gooseberries', quantity: '20kg', price: 1800, image: '/images/goosberries(Amla).jpg', rating: 4.4, reviews: 12, farmer: 'Amla Farm', location: 'Lucknow, Uttar Pradesh' },
    { crop: 'Black Berries', quantity: '15kg', price: 3500, image: '/images/Black Berries.jpg', rating: 4.6, reviews: 7, farmer: 'Berry Garden', location: 'Shimla, Himachal Pradesh' },
    { crop: 'Blue Berries', quantity: '12kg', price: 4000, image: '/images/Black Currant Blue Berries.jpg', rating: 4.8, reviews: 5, farmer: 'Blue Berry Farm', location: 'Srinagar, Jammu & Kashmir' },
    { crop: 'Raspberries', quantity: '18kg', price: 3800, image: '/images/Raspberries.jpg', rating: 4.5, reviews: 9, farmer: 'Raspberry Valley', location: 'Shimla, Himachal Pradesh' }
  ], []);

  const vegetables = useMemo(() => [
    { crop: 'Wheat', quantity: '100kg', price: 1200, image: '/images/wheat.jpg', rating: 4.3, reviews: 16, farmer: 'Wheat Farm', location: 'Chandigarh, Punjab' },
    { crop: 'Rice', quantity: '80kg', price: 1000, image: '/images/rice.jpg', rating: 4.1, reviews: 19, farmer: 'Rice Bowl', location: 'Kolkata, West Bengal' },
    { crop: 'Tomato', quantity: '50kg', price: 500, image: '/images/tomato.jpg', rating: 4.4, reviews: 28, farmer: 'Tomato Garden', location: 'Mumbai, Maharashtra' },
    { crop: 'Onion', quantity: '60kg', price: 700, image: '/images/onion.jpg', rating: 4.0, reviews: 25, farmer: 'Onion Farm', location: 'Mumbai, Maharashtra' },
    { crop: 'Potato', quantity: '90kg', price: 800, image: '/images/potato.jpg', rating: 4.2, reviews: 20, farmer: 'Potato Plus', location: 'Lucknow, Uttar Pradesh' },
    { crop: 'Maize', quantity: '120kg', price: 1100, image: '/images/maize.jpg', rating: 4.1, reviews: 12, farmer: 'Maize Farm', location: 'Bangalore, Karnataka' },
    { crop: 'Beetroot', quantity: '40kg', price: 600, image: '/images/Beetroot.jpg', rating: 4.3, reviews: 14, farmer: 'Beetroot Farm', location: 'Gurgaon, Haryana' },
    { crop: 'Bitter Gourd', quantity: '30kg', price: 400, image: '/images/Bitter gaurd.jpg', rating: 4.0, reviews: 18, farmer: 'Bitter Gourd Farm', location: 'Chennai, Tamil Nadu' },
    { crop: 'Green Chillies', quantity: '25kg', price: 300, image: '/images/Green Chillies.jpg', rating: 4.2, reviews: 22, farmer: 'Chilli Farm', location: 'Vijayawada, Andhra Pradesh' },
    { crop: 'Mushroom', quantity: '20kg', price: 800, image: '/images/Mushroom.jpg', rating: 4.5, reviews: 15, farmer: 'Mushroom Farm', location: 'Shimla, Himachal Pradesh' },
    { crop: 'Dasheen Root', quantity: '35kg', price: 500, image: '/images/Dasheenroot.jpg', rating: 4.1, reviews: 8, farmer: 'Root Farm', location: 'Thiruvananthapuram, Kerala' }
  ], []);

  const pulses = useMemo(() => [
    { crop: 'Black Gram', quantity: '50kg', price: 1200, image: '/images/Black Gram.jpg', rating: 4.4, reviews: 16, farmer: 'Pulse Farm', location: 'Bhopal, Madhya Pradesh' },
    { crop: 'Green Gram', quantity: '45kg', price: 1100, image: '/images/Green Gram.jpg', rating: 4.2, reviews: 14, farmer: 'Green Gram Farm', location: 'Jaipur, Rajasthan' },
    { crop: 'Red Lentils', quantity: '40kg', price: 1000, image: '', rating: 4.3, reviews: 12, farmer: 'Lentil Farm', location: 'Lucknow, Uttar Pradesh' },
    { crop: 'Chickpeas', quantity: '55kg', price: 1300, image: '', rating: 4.1, reviews: 18, farmer: 'Chickpea Farm', location: 'Mumbai, Maharashtra' },
    { crop: 'Kidney Beans', quantity: '35kg', price: 900, image: '', rating: 4.0, reviews: 10, farmer: 'Bean Farm', location: 'Bangalore, Karnataka' },
    { crop: 'Pigeon Peas', quantity: '60kg', price: 1400, image: '', rating: 4.2, reviews: 15, farmer: 'Pea Farm', location: 'Chennai, Tamil Nadu' }
  ], []);

  const items = useMemo(() => [
    { crop: 'Fruits', quantity: '', price: '', image: '/images/fruits.jpg', isFruits: true, description: 'Fresh and organic fruits from local farmers' },
    { crop: 'Dry Fruits', quantity: '', price: '', image: '/images/dry fruits.jpg', isDryFruits: true, description: 'Premium quality dry fruits and nuts' },
    { crop: 'Vegetables', quantity: '', price: '', image: '/images/vegetables.jpg', isVegetables: true, description: 'Fresh vegetables and grains' },
    { crop: 'Pulses', quantity: '', price: '', image: '', isPulses: true, description: 'High-quality pulses and legumes' }
  ], []);

  // State management with optimized hooks
  const [cart, setCart] = useLocalStorage('cart', []);
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('none');
  const [priceRange, setPriceRange] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showDryFruits, setShowDryFruits] = useState(false);
  const [showFruits, setShowFruits] = useState(false);
  const [showVegetables, setShowVegetables] = useState(false);
  const [showPulses, setShowPulses] = useState(false);
  const [hoveredItems, setHoveredItems] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered products
  const filteredFruits = useMemo(() => {
    return memoizedFilter(fruits, {
      searchTerm: debouncedSearchTerm,
      sortType,
      priceRange
    });
  }, [fruits, debouncedSearchTerm, sortType, priceRange]);

  const filteredDryFruits = useMemo(() => {
    return memoizedFilter(dryFruits, {
      searchTerm: debouncedSearchTerm,
      sortType,
      priceRange
    });
  }, [dryFruits, debouncedSearchTerm, sortType, priceRange]);

  const filteredVegetables = useMemo(() => {
    return memoizedFilter(vegetables, {
      searchTerm: debouncedSearchTerm,
      sortType,
      priceRange
    });
  }, [vegetables, debouncedSearchTerm, sortType, priceRange]);

  const filteredPulses = useMemo(() => {
    return memoizedFilter(pulses, {
      searchTerm: debouncedSearchTerm,
      sortType,
      priceRange
    });
  }, [pulses, debouncedSearchTerm, sortType, priceRange]);

  // Memoized cart total
  const cartTotal = useMemo(() => calculateCartTotal(cart), [cart]);

  // Optimized event handlers with useCallback
  const handleAddToCart = useCallback((item) => {
    const existingItem = cart.find(cartItem => cartItem.crop === item.crop && cartItem.farmer === item.farmer);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.crop === item.crop && cartItem.farmer === item.farmer
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }, [cart, setCart]);

  const handleRemoveFromCart = useCallback((itemToRemove) => {
    setCart(cart.filter(item => 
      !(item.crop === itemToRemove.crop && item.farmer === itemToRemove.farmer)
    ));
  }, [cart, setCart]);

  const handleUpdateQuantity = useCallback((item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(item);
    } else {
      setCart(cart.map(cartItem => 
        cartItem.crop === item.crop && cartItem.farmer === item.farmer
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ));
    }
  }, [cart, setCart, handleRemoveFromCart]);

  const toggleWishlist = useCallback((item) => {
    const isInWishlist = wishlist.find(wishItem => 
      wishItem.crop === item.crop && wishItem.farmer === item.farmer
    );
    if (isInWishlist) {
      setWishlist(wishlist.filter(wishItem => 
        !(wishItem.crop === item.crop && wishItem.farmer === item.farmer)
      ));
    } else {
      setWishlist([...wishlist, item]);
    }
  }, [wishlist, setWishlist]);

  const handleImageHover = useCallback((itemId, isHovering) => {
    setHoveredItems(prev => ({
      ...prev,
      [itemId]: isHovering
    }));
  }, []);

  const handleImageLoad = useCallback((itemId) => {
    setLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  }, []);

  const handleImageError = useCallback((itemId) => {
    setLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  }, []);

  // Memoized product card component
  const ProductCard = useCallback(({ item, idx }) => {
    const isInWishlist = wishlist.find(wishItem => 
      wishItem.crop === item.crop && wishItem.farmer === item.farmer
    );
    const itemId = `${item.crop}-${item.farmer}`;
    const isHovered = hoveredItems[itemId];
    const isLoading = loadingStates[itemId] !== false;
    const displayImage = item.image2 && isHovered ? item.image2 : item.image;

    return (
      <div key={idx} style={productCard}>
        <div style={productImageContainer}>
          {displayImage ? (
            <div 
              style={imageWrapper}
              onMouseEnter={() => handleImageHover(itemId, true)}
              onMouseLeave={() => handleImageHover(itemId, false)}
            >
              <LazyImage 
                src={displayImage} 
                alt={item.crop} 
                style={productImage}
                onLoad={() => handleImageLoad(itemId)}
                onError={() => handleImageError(itemId)}
              />
              {isLoading && (
                <div style={imageLoader}>
                  <div style={spinner}></div>
                </div>
              )}
            </div>
          ) : (
            <div style={noImagePlaceholder}>
              <span>No Image Available</span>
            </div>
          )}
          <button 
            onClick={() => toggleWishlist(item)} 
            style={wishlistButton(isInWishlist)}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </button>
          {item.image2 && (
            <div style={hoverIndicator}>
              <span>Hover to see more</span>
            </div>
          )}
        </div>
        <div style={productInfo}>
          <h3 style={productTitle}>{item.crop}</h3>
          <div style={ratingContainer}>
            <div style={starsContainer}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={i < Math.floor(item.rating) ? filledStar : emptyStar}>
                  ★
                </span>
              ))}
            </div>
            <span style={ratingText}>{item.rating}</span>
            <span style={reviewsText}>({item.reviews} reviews)</span>
          </div>
          <p style={farmerInfo}>
            <span style={farmerIcon}>👨‍🌾</span> {item.farmer}
          </p>
          <p style={locationInfo}>
            <span style={locationIcon}>📍</span> {item.location}
          </p>
          <p style={quantityInfo}>
            <span style={quantityIcon}>📦</span> Quantity: {item.quantity}
          </p>
          <p style={priceInfo}>₹{item.price.toLocaleString()}</p>
          <div style={productActions}>
            <button 
              onClick={() => handleAddToCart(item)} 
              style={addToCartButton}
              title="Add to cart"
            >
              🛒 Add to Cart
            </button>
            <button 
              style={contactButton}
              title="Contact farmer"
              onClick={() => navigate('/contact', { state: { farmer: item.farmer, crop: item.crop } })}
            >
              📱 Contact
            </button>
          </div>
        </div>
      </div>
    );
  }, [wishlist, toggleWishlist, handleAddToCart, hoveredItems, handleImageHover, loadingStates, handleImageLoad, handleImageError, navigate]);

  return (
    <div style={container}>
      <Navbar showCart={true} showOrders={true} />
      
      {/* Enhanced Header */}
      <div style={header}>
        <div style={headerContent}>
          <h1 style={headerTitle}>{t('consumer_dashboard') || 'Fresh Produce Market'}</h1>
          <p style={headerSubtitle}>Connect directly with farmers for fresh, quality produce</p>
          <div style={headerStats}>
            <div style={statItem}>
              <span style={statNumber}>{fruits.length + dryFruits.length + vegetables.length + pulses.length}</span>
              <span style={statLabel}>Products</span>
            </div>
            <div style={statItem}>
              <span style={statNumber}>{cart.length}</span>
              <span style={statLabel}>Cart Items</span>
            </div>
            <div style={statItem}>
              <span style={statNumber}>{wishlist.length}</span>
              <span style={statLabel}>Wishlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div style={filterBar}>
        <div style={searchSection}>
          🔍
          <input
            type="text"
            placeholder={t('search_crop') || 'Search products or farmers...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
        </div>
        
        <div style={filterControls}>
          <select onChange={(e) => setSortType(e.target.value)} style={filterSelect}>
            <option value="none">{t('sort_by') || 'Sort by'}</option>
            <option value="low">{t('price_low_to_high') || 'Price: Low to High'}</option>
            <option value="high">{t('price_high_to_low') || 'Price: High to Low'}</option>
            <option value="rating">{t('rating') || 'Rating'}</option>
          </select>
          
          <select onChange={(e) => setPriceRange(e.target.value)} style={filterSelect}>
            <option value="all">{t('all_prices') || 'All Prices'}</option>
            <option value="low">{t('under_1000') || 'Under ₹1000'}</option>
            <option value="medium">{t('1000_to_3000') || '₹1000 - ₹3000'}</option>
            <option value="high">{t('above_3000') || 'Above ₹3000'}</option>
          </select>
        </div>

        <div style={quickActions}>
          <button 
            style={quickActionButton} 
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart ({cart.length})
          </button>
          <button 
            style={quickActionButton}
            onClick={() => navigate('/orders')}
          >
            📋 Orders
          </button>
          <button 
            style={quickActionButton}
            onClick={() => navigate('/wishlist')}
          >
            ❤️ Wishlist ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div style={cartSidebar}>
          <div style={cartHeader}>
            <h3>Shopping Cart</h3>
            <button onClick={() => setShowCart(false)} style={closeButton}>×</button>
          </div>
          {cart.length === 0 ? (
            <p style={emptyCart}>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} style={cartItem}>
                  <LazyImage 
                    src={item.image} 
                    alt={item.crop} 
                    style={cartItemImage}
                  />
                  <div style={cartItemDetails}>
                    <h4>{item.crop}</h4>
                    <p>₹{item.price}</p>
                    <p style={farmerName}>{item.farmer}</p>
                  </div>
                  <div style={quantityControls}>
                    <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item)} style={removeButton}>×</button>
                </div>
              ))}
              <div style={cartTotal}>
                <h4>Total: ₹{cartTotal.toLocaleString()}</h4>
                <button style={checkoutButton}>Checkout</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Categories */}
      <div style={categoriesSection}>
        <h2 style={sectionTitle}>Product Categories</h2>
        <div style={categoriesGrid}>
          {items.map((item, idx) => (
            <div key={idx} style={categoryCard}>
              {item.image ? (
                <LazyImage 
                  src={item.image} 
                  alt={item.crop} 
                  style={categoryImage}
                />
              ) : (
                <div style={categoryImagePlaceholder}>
                  <span>No Image Available</span>
                </div>
              )}
              <div style={categoryContent}>
                <h3 style={categoryTitle}>{item.crop}</h3>
                <p style={categoryDescription}>{item.description}</p>
                <button 
                  onClick={() => {
                    if (item.isFruits) setShowFruits(!showFruits);
                    else if (item.isDryFruits) setShowDryFruits(!showDryFruits);
                    else if (item.isVegetables) setShowVegetables(!showVegetables);
                    else if (item.isPulses) setShowPulses(!showPulses);
                  }} 
                  style={viewProductsButton}
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Display */}
      {showFruits && (
        <div style={productsSection}>
          <div style={productsHeader}>
            <h2>Fresh Fruits</h2>
            <button onClick={() => setShowFruits(false)} style={closeSectionButton}>Close</button>
          </div>
          <div style={productsGrid}>
            {filteredFruits.map((item, idx) => (
              <ProductCard key={idx} item={item} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {showDryFruits && (
        <div style={productsSection}>
          <div style={productsHeader}>
            <h2>Dry Fruits & Nuts</h2>
            <button onClick={() => setShowDryFruits(false)} style={closeSectionButton}>Close</button>
          </div>
          <div style={productsGrid}>
            {filteredDryFruits.map((item, idx) => (
              <ProductCard key={idx} item={item} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {showVegetables && (
        <div style={productsSection}>
          <div style={productsHeader}>
            <h2>Fresh Vegetables & Grains</h2>
            <button onClick={() => setShowVegetables(false)} style={closeSectionButton}>Close</button>
          </div>
          <div style={productsGrid}>
            {filteredVegetables.map((item, idx) => (
              <ProductCard key={idx} item={item} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {showPulses && (
        <div style={productsSection}>
          <div style={productsHeader}>
            <h2>Pulses & Legumes</h2>
            <button onClick={() => setShowPulses(false)} style={closeSectionButton}>Close</button>
          </div>
          <div style={productsGrid}>
            {filteredPulses.map((item, idx) => (
              <ProductCard key={idx} item={item} idx={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

// Add CSS animation for spinner only
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

const header = {
  textAlign: 'center',
  padding: '40px 20px',
  backgroundColor: 'white',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  margin: '20px'
};

const headerContent = {
  maxWidth: '1200px',
  margin: '0 auto'
};

const headerStats = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  marginTop: '30px',
  flexWrap: 'wrap'
};

const statItem = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '15px 25px',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  minWidth: '100px'
};

const statNumber = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#28a745',
  marginBottom: '5px'
};

const statLabel = {
  fontSize: '0.9rem',
  color: '#666',
  fontWeight: '500'
};

const headerTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333'
};

const headerSubtitle = {
  fontSize: '1.1rem',
  color: '#666',
  margin: 0
};

const filterBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '12px',
  margin: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  flexWrap: 'wrap',
  gap: '15px'
};

const searchSection = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  maxWidth: '400px'
};

const searchInput = {
  padding: '12px 12px 12px 40px',
  fontSize: '16px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outline: 'none'
};

const filterControls = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};

const filterSelect = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  backgroundColor: 'white'
};

const quickActions = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};

const quickActionButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap'
};

const cartSidebar = {
  position: 'fixed',
  top: '100px',
  right: '20px',
  width: '350px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  zIndex: 1000,
  maxHeight: '80vh',
  overflowY: 'auto'
};

const cartHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #eee'
};

const closeButton = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#666'
};

const emptyCart = {
  textAlign: 'center',
  padding: '40px',
  color: '#666'
};

const cartItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '15px',
  borderBottom: '1px solid #eee',
  position: 'relative'
};

const cartItemImage = {
  width: '60px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: '15px'
};

const cartItemDetails = {
  flex: 1
};

const farmerName = {
  fontSize: '12px',
  color: '#666',
  margin: '2px 0'
};

const quantityControls = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginRight: '10px'
};

const removeButton = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  fontSize: '12px'
};

const cartTotal = {
  padding: '20px',
  borderTop: '1px solid #eee'
};

const checkoutButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  marginTop: '10px'
};

const categoriesSection = {
  padding: '20px'
};

const sectionTitle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '30px',
  textAlign: 'center',
  color: '#333'
};

const categoriesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const categoryCard = {
  backgroundColor: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const categoryImage = {
  width: '100%',
  height: '200px',
  objectFit: 'cover'
};

const categoryImagePlaceholder = {
  width: '100%',
  height: '200px',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#666',
  fontSize: '1.2rem'
};

const categoryContent = {
  padding: '20px'
};

const categoryTitle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333'
};

const categoryDescription = {
  color: '#666',
  marginBottom: '20px',
  lineHeight: '1.5'
};

const viewProductsButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  transition: 'all 0.3s ease'
};

const productsSection = {
  padding: '20px',
  backgroundColor: 'white',
  margin: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const productsHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const closeSectionButton = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const productsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '25px'
};

const productCard = {
  backgroundColor: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: '1px solid #eee',
  cursor: 'pointer'
};

const productImageContainer = {
  position: 'relative'
};

const imageWrapper = {
  position: 'relative',
  width: '100%',
  height: '200px',
  overflow: 'hidden'
};

const productImage = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const imageLoader = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1
};

const spinner = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderTop: '4px solid white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite'
};

const noImagePlaceholder = {
  width: '100%',
  height: '200px',
  backgroundColor: '#eee',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#666',
  fontSize: '1.2rem'
};

const hoverIndicator = {
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '5px',
  fontSize: '12px',
  fontWeight: 'bold',
  zIndex: 2
};

const wishlistButton = (isInWishlist) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: isInWishlist ? '#dc3545' : 'rgba(255,255,255,0.9)',
  color: isInWishlist ? 'white' : '#666',
  border: 'none',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  zIndex: 3
});

const productInfo = {
  padding: '20px'
};

const productTitle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333'
};

const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  marginBottom: '10px'
};

const starsContainer = {
  display: 'flex',
  gap: '2px'
};

const filledStar = {
  color: '#ffd700'
};

const emptyStar = {
  color: '#ccc'
};

const ratingText = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#28a745',
  marginLeft: '5px'
};

const reviewsText = {
  fontSize: '12px',
  color: '#666'
};

const farmerInfo = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center'
};

const farmerIcon = {
  marginRight: '5px'
};

const locationInfo = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center'
};

const locationIcon = {
  marginRight: '5px'
};

const quantityInfo = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center'
};

const quantityIcon = {
  marginRight: '5px'
};

const priceInfo = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#28a745',
  marginBottom: '15px'
};

const productActions = {
  display: 'flex',
  gap: '10px'
};

const addToCartButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  flex: 1,
  transition: 'all 0.3s ease'
};

const contactButton = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  flex: 1,
  transition: 'all 0.3s ease'
};

export default ConsumerDashboard;
