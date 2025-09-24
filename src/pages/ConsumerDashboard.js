import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaShoppingCart, FaSearch, FaHeart, FaStar, FaLeaf, FaAppleAlt, FaSeedling, FaShoppingBag, FaMapMarkerAlt, FaRupeeSign, FaStore, FaPhone, FaEye, FaShieldAlt, FaFilter, FaSort, FaTruck, FaClock, FaThumbsUp, FaComments, FaChartLine, FaGift, FaBell, FaUserCircle, FaHistory, FaLocationArrow, FaPercentage, FaFire, FaMedal, FaAward, FaLightbulb, FaShippingFast, FaHandshake } from 'react-icons/fa';

const ConsumerDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'cart', 'orders', 'deals'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price_low', 'price_high', 'rating', 'newest'
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [quickOrderMode, setQuickOrderMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [userProfile, setUserProfile] = useState({
    name: 'Sanjay Theegala',
    location: 'Hyderabad, Telangana',
    orders: 12,
    savings: 2450
  });
  const [recentOrders, setRecentOrders] = useState([
    { id: 1, item: 'Fresh Red Apples', date: '2025-09-20', status: 'Delivered' },
    { id: 2, item: 'Organic Bananas', date: '2025-09-18', status: 'In Transit' },
    { id: 3, item: 'Mixed Dry Fruits', date: '2025-09-15', status: 'Delivered' }
  ]);

  // Special deals and offers
  const [specialDeals] = useState([
    {
      id: 'deal1',
      title: 'Fresh Fruit Combo',
      discount: 25,
      originalPrice: 400,
      dealPrice: 300,
      items: ['Apples', 'Bananas', 'Pomegranate'],
      validUntil: '2025-09-30',
      image: '/images/fruits.jpg'
    },
    {
      id: 'deal2',
      title: 'Organic Vegetables Pack',
      discount: 20,
      originalPrice: 250,
      dealPrice: 200,
      items: ['Beetroot', 'Tomatoes', 'Green Chillies'],
      validUntil: '2025-09-28',
      image: '/images/vegetables.jpg'
    },
    {
      id: 'deal3',
      title: 'Premium Dry Fruits Mix',
      discount: 15,
      originalPrice: 1000,
      dealPrice: 850,
      items: ['Almonds', 'Cashews', 'Walnuts'],
      validUntil: '2025-10-05',
      image: '/images/dry fruits.jpg'
    }
  ]);

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price updates, stock changes, etc.
      if (Math.random() > 0.9) {
        console.log('Market update: Fresh stock arrived!');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Sample products data - in real app this would come from backend
  const [products] = useState([
    {
      id: 1,
      name: 'Fresh Red Apples',
      category: 'Fruits',
      pricePerKg: 120,
      originalPrice: 150,
      discount: 20,
      state: 'Himachal Pradesh',
      district: 'Shimla',
      village: 'Kotgarh',
      seller: 'Rajesh Orchard',
      phone: '+91 9876543210',
      description: 'Fresh, crispy red apples directly from Himachal orchards. Sweet and juicy with excellent taste.',
      availability: 'In Stock',
      image: '/images/Apple.jpg',
      rating: 4.8,
      totalSales: 247,
      harvestDate: '2025-09-20',
      organic: true,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Organic', 'FDA Approved'],
      tags: ['Organic', 'Fresh', 'Premium Quality'],
      nutritionScore: 95,
      shelfLife: '15 days',
      storageTemp: '4-8°C'
    },
    {
      id: 2,
      name: 'Organic Bananas',
      category: 'Fruits',
      pricePerKg: 80,
      originalPrice: 90,
      discount: 11,
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      village: 'Kumbakonam',
      seller: 'Murugan Farms',
      phone: '+91 9876543211',
      description: 'Premium quality organic bananas, naturally ripened and pesticide-free.',
      availability: 'In Stock',
      image: '/images/Banana.jpg',
      rating: 4.7,
      totalSales: 189,
      harvestDate: '2025-09-22',
      organic: true,
      unit: 'dozen',
      minOrder: 1,
      maxOrder: 20,
      featured: true,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'Fair Trade'],
      tags: ['Organic', 'Naturally Ripened', 'Pesticide Free'],
      nutritionScore: 88,
      shelfLife: '7 days',
      storageTemp: 'Room Temperature'
    },
    // Additional products...
    {
      id: 3,
      name: 'Fresh Beetroot',
      category: 'Vegetables',
      pricePerKg: 60,
      originalPrice: 70,
      discount: 14,
      state: 'Karnataka',
      district: 'Bangalore',
      village: 'Doddaballapur',
      seller: 'Green Valley Farms',
      phone: '+91 9876543212',
      description: 'Fresh beetroot, rich in nutrients and perfect for salads and juices.',
      availability: 'In Stock',
      image: '/images/Beetroot.jpg',
      rating: 4.5,
      totalSales: 156,
      harvestDate: '2025-09-21',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 25,
      featured: false,
      trending: true,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Fresh', 'Nutrient Rich', 'Farm Fresh'],
      nutritionScore: 92,
      shelfLife: '10 days',
      storageTemp: '2-4°C'
    }
  ]);

  const categories = ['all', 'Fruits', 'Vegetables', 'Dry Fruits', 'Pulses'];
  const states = ['Himachal Pradesh', 'Tamil Nadu', 'Karnataka', 'Kashmir', 'Rajasthan', 'Andhra Pradesh', 'Kerala', 'Maharashtra', 'Madhya Pradesh', 'Delhi'];

  // Enhanced filtering and sorting
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesPrice = product.pricePerKg >= priceRange[0] && product.pricePerKg <= priceRange[1];
      
      const matchesState = selectedStates.length === 0 || selectedStates.includes(product.state);
      
      const matchesOrganic = !organicOnly || product.organic;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesState && matchesOrganic;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.pricePerKg - b.pricePerKg;
        case 'price_high':
          return b.pricePerKg - a.pricePerKg;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.harvestDate) - new Date(a.harvestDate);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
      }
    });

  // Cart management functions
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to get icon based on product category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Fruits':
        return <FaAppleAlt size={40} color="#ff6b35" />;
      case 'Vegetables':
        return <FaLeaf size={40} color="#28a745" />;
      case 'Dry Fruits':
        return <FaSeedling size={40} color="#8b4513" />;
      case 'Pulses':
        return <FaSeedling size={40} color="#ffc107" />;
      default:
        return <FaShoppingBag size={40} color="#666" />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', marginTop: '100px' }}>
        {/* Enhanced Header Section with User Profile */}
        <div style={styles.headerSection}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>
              <FaShoppingCart style={{ marginRight: '15px', color: '#28a745' }} />
              Fresh Market
            </h1>
            <p style={styles.pageSubtitle}>Farm-to-table fresh produce marketplace</p>
            <div style={styles.marketStats}>
              <div style={styles.statItem}>
                <FaStore style={{ color: '#28a745' }} />
                <span>500+ Farmers</span>
              </div>
              <div style={styles.statItem}>
                <FaTruck style={{ color: '#007bff' }} />
                <span>Fast Delivery</span>
              </div>
              <div style={styles.statItem}>
                <FaShieldAlt style={{ color: '#ffc107' }} />
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userProfileCard}>
              <div style={styles.profileHeader}>
                <FaUserCircle size={50} color="#28a745" />
                <div>
                  <h3 style={{ margin: 0, color: 'white' }}>{userProfile.name}</h3>
                  <p style={{ margin: '5px 0', color: '#e0e0e0', fontSize: '14px' }}>
                    <FaLocationArrow style={{ marginRight: '5px' }} />
                    {userProfile.location}
                  </p>
                </div>
                <div style={styles.notificationBadge}>
                  <FaBell size={20} />
                  {notifications > 0 && <span style={styles.notificationCount}>{notifications}</span>}
                </div>
              </div>
              <div style={styles.profileStats}>
                <div style={styles.profileStat}>
                  <span style={styles.statLabel}>Total Orders</span>
                  <span style={styles.statValue}>{userProfile.orders}</span>
                </div>
                <div style={styles.profileStat}>
                  <span style={styles.statLabel}>Total Savings</span>
                  <span style={styles.statValue}>₹{userProfile.savings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div style={styles.tabContainer}>
          <button 
            onClick={() => setActiveTab('browse')}
            style={{...styles.tabButton, ...(activeTab === 'browse' ? styles.activeTabButton : {})}}
          >
            <FaSearch style={{ marginRight: '8px' }} />
            Browse Products
          </button>
          <button 
            onClick={() => setActiveTab('deals')}
            style={{...styles.tabButton, ...(activeTab === 'deals' ? styles.activeTabButton : {})}}
          >
            <FaGift style={{ marginRight: '8px' }} />
            Special Deals
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            style={{...styles.tabButton, ...(activeTab === 'cart' ? styles.activeTabButton : {})}}
          >
            <FaShoppingCart style={{ marginRight: '8px' }} />
            Cart ({getTotalCartItems()})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{...styles.tabButton, ...(activeTab === 'orders' ? styles.activeTabButton : {})}}
          >
            <FaHistory style={{ marginRight: '8px' }} />
            My Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <div>
            {/* Search and Filter Section */}
            <div style={styles.filterSection}>
              <div style={styles.searchContainer}>
                <FaSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.categorySelect}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            <div style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  style={{
                    ...styles.productCard,
                    transform: hoveredCard === product.id ? 'translateY(-5px)' : 'translateY(0)',
                    boxShadow: hoveredCard === product.id ? '0 15px 30px rgba(0,0,0,0.15)' : '0 8px 25px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={styles.productImageContainer}>
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={styles.productImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{...styles.productImagePlaceholder, display: product.image ? 'none' : 'flex'}}>
                      {getCategoryIcon(product.category)}
                    </div>
                  </div>
                  
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <div style={styles.priceSection}>
                      <span style={styles.currentPrice}>₹{product.pricePerKg}/{product.unit}</span>
                      {product.discount > 0 && (
                        <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                      )}
                    </div>
                    <p style={styles.productDescription}>{product.description}</p>
                    
                    <div style={styles.productMeta}>
                      <span style={styles.productCategory}>{product.category}</span>
                      <div style={styles.ratingContainer}>
                        <FaStar style={{ color: '#ffc107', fontSize: '14px' }} />
                        <span style={styles.ratingText}>{product.rating}</span>
                      </div>
                    </div>
                    
                    <div style={styles.productActions}>
                      <button 
                        style={styles.addToCartButton}
                        onClick={() => addToCart(product)}
                      >
                        <FaShoppingCart style={{ marginRight: '8px' }} />
                        Add to Cart
                      </button>
                      <button 
                        style={{
                          ...styles.favoriteButton,
                          backgroundColor: favorites.includes(product.id) ? '#e74c3c' : '#f8f9fa',
                          color: favorites.includes(product.id) ? 'white' : '#666'
                        }}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div style={styles.cartSection}>
            <h2 style={styles.sectionTitle}>Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
              <div style={styles.emptyCart}>
                <FaShoppingCart size={60} color="#ccc" />
                <h3>Your cart is empty</h3>
                <p>Start shopping to add items to your cart</p>
                <button 
                  onClick={() => setActiveTab('browse')}
                  style={styles.continueShoppingButton}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                {cartItems.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <img src={item.image} alt={item.name} style={styles.cartItemImage} />
                    <div style={styles.cartItemDetails}>
                      <h4>{item.name}</h4>
                      <p>₹{item.pricePerKg}/{item.unit}</p>
                    </div>
                    <div style={styles.quantityControls}>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                      >
                        -
                      </button>
                      <span style={styles.quantity}>{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                    <div style={styles.itemTotal}>
                      ₹{(item.pricePerKg * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div style={styles.cartSummary}>
                  <h3>Total: ₹{cartItems.reduce((total, item) => total + (item.pricePerKg * item.quantity), 0).toFixed(2)}</h3>
                  <button style={styles.checkoutButton}>Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={styles.ordersSection}>
            <h2 style={styles.sectionTitle}>My Orders</h2>
            {recentOrders.map(order => (
              <div key={order.id} style={styles.orderCard}>
                <div>
                  <h4>Order #{order.id}</h4>
                  <p>{order.item}</p>
                  <p>Date: {order.date}</p>
                </div>
                <div style={{
                  ...styles.orderStatus,
                  backgroundColor: order.status === 'Delivered' ? '#28a745' : '#007bff'
                }}>
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deals' && (
          <div style={styles.dealsSection}>
            <h2 style={styles.sectionTitle}>Special Deals</h2>
            <div style={styles.dealsGrid}>
              {specialDeals.map(deal => (
                <div key={deal.id} style={styles.dealCard}>
                  <div style={styles.dealBadge}>{deal.discount}% OFF</div>
                  <img src={deal.image} alt={deal.title} style={styles.dealImage} />
                  <div style={styles.dealInfo}>
                    <h3>{deal.title}</h3>
                    <p>Includes: {deal.items.join(', ')}</p>
                    <div style={styles.dealPricing}>
                      <span style={styles.originalPrice}>₹{deal.originalPrice}</span>
                      <span style={styles.dealPrice}>₹{deal.dealPrice}</span>
                    </div>
                    <button style={styles.grabDealButton}>Grab Deal</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles object
const styles = {
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    marginBottom: '40px',
    color: 'white',
    flexWrap: 'wrap',
    gap: '20px'
  },
  headerLeft: {
    flex: 1,
    minWidth: '300px'
  },
  headerRight: {
    flex: 1,
    maxWidth: '400px',
    minWidth: '300px'
  },
  pageTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  pageSubtitle: {
    fontSize: '1.3rem',
    margin: 0,
    opacity: 0.9,
    fontWeight: '300'
  },
  marketStats: {
    display: 'flex',
    gap: '30px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  userProfileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  notificationBadge: {
    position: 'relative',
    cursor: 'pointer'
  },
  notificationCount: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  profileStats: {
    display: 'flex',
    gap: '20px'
  },
  profileStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '12px',
    color: '#e0e0e0',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white'
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '8px',
    marginBottom: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    gap: '5px'
  },
  tabButton: {
    flex: 1,
    padding: '16px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#666'
  },
  activeTabButton: {
    backgroundColor: '#28a745',
    color: 'white',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
  },
  filterSection: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  searchContainer: {
    position: 'relative',
    flex: 1
  },
  searchIcon: {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
    fontSize: '16px'
  },
  searchInput: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none'
  },
  categorySelect: {
    padding: '16px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
    outline: 'none',
    minWidth: '200px'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  productImageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  productImagePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666'
  },
  productInfo: {
    padding: '20px'
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '0 0 10px 0'
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  currentPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  originalPrice: {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through'
  },
  productDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.4'
  },
  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  productCategory: {
    fontSize: '12px',
    color: '#28a745',
    backgroundColor: '#e8f5e8',
    padding: '4px 8px',
    borderRadius: '8px'
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  ratingText: {
    fontSize: '14px',
    fontWeight: '600'
  },
  productActions: {
    display: 'flex',
    gap: '10px'
  },
  addToCartButton: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteButton: {
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cartSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center'
  },
  emptyCart: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  continueShoppingButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '15px'
  },
  cartItemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  cartItemDetails: {
    flex: 1
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  quantity: {
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center'
  },
  itemTotal: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#28a745',
    minWidth: '80px'
  },
  removeButton: {
    padding: '8px 12px',
    border: '1px solid #e74c3c',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '12px'
  },
  cartSummary: {
    textAlign: 'right',
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px'
  },
  checkoutButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '15px'
  },
  ordersSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  orderCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '15px'
  },
  orderStatus: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  dealsSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  dealsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  dealBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 10
  },
  dealImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  dealInfo: {
    padding: '20px'
  },
  dealPricing: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  dealPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  grabDealButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default ConsumerDashboard;