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
    },
    {
      id: 4,
      name: 'Premium Almonds (Badam)',
      category: 'Dry Fruits',
      pricePerKg: 800,
      originalPrice: 900,
      discount: 11,
      state: 'Kashmir',
      district: 'Srinagar',
      village: 'Pampore',
      seller: 'Kashmir Dry Fruits Co.',
      phone: '+91 9876543213',
      description: 'Premium quality Kashmiri almonds, naturally processed and rich in nutrients.',
      availability: 'In Stock',
      image: '/images/Badam.jpg',
      rating: 4.9,
      totalSales: 98,
      harvestDate: '2025-08-15',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 10,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Premium', 'Kashmir Special', 'Rich in Protein'],
      nutritionScore: 98,
      shelfLife: '12 months',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 5,
      name: 'Black Gram (Urad Dal)',
      category: 'Pulses',
      pricePerKg: 140,
      originalPrice: 160,
      discount: 12,
      state: 'Rajasthan',
      district: 'Jodhpur',
      village: 'Phalodi',
      seller: 'Rajasthan Pulses',
      phone: '+91 9876543214',
      description: 'High-quality black gram, perfect for making dal and traditional recipes.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.6,
      totalSales: 134,
      harvestDate: '2025-07-10',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 100,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Quality Assured'],
      tags: ['High Protein', 'Traditional', 'Quality Assured'],
      nutritionScore: 85,
      shelfLife: '18 months',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 6,
      name: 'Green Chillies',
      category: 'Vegetables',
      pricePerKg: 45,
      originalPrice: 50,
      discount: 10,
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Repalle',
      seller: 'Spice Farmers Union',
      phone: '+91 9876543215',
      description: 'Fresh green chillies from Guntur, known for their perfect spice level.',
      availability: 'In Stock',
      image: '/images/Green Chillies.jpg',
      rating: 4.4,
      totalSales: 278,
      harvestDate: '2025-09-23',
      organic: false,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 20,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Farm Fresh'],
      tags: ['Spicy', 'Fresh', 'Guntur Special'],
      nutritionScore: 78,
      shelfLife: '5 days',
      storageTemp: '2-4°C'
    },
    {
      id: 7,
      name: 'Cashew Nuts',
      category: 'Dry Fruits',
      pricePerKg: 750,
      originalPrice: 850,
      discount: 12,
      state: 'Kerala',
      district: 'Kollam',
      village: 'Anchal',
      seller: 'Kerala Cashew Co-op',
      phone: '+91 9876543216',
      description: 'Premium cashew nuts from Kerala, naturally processed and perfectly roasted.',
      availability: 'In Stock',
      image: '/images/cashews.jpg',
      rating: 4.8,
      totalSales: 167,
      harvestDate: '2025-08-20',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 15,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Organic', 'Export Quality'],
      tags: ['Premium', 'Roasted', 'Kerala Special'],
      nutritionScore: 94,
      shelfLife: '10 months',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 8,
      name: 'Sweet Pomegranate',
      category: 'Fruits',
      pricePerKg: 180,
      originalPrice: 200,
      discount: 10,
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Baramati',
      seller: 'Fruit Valley Farms',
      phone: '+91 9876543217',
      description: 'Sweet and juicy pomegranates, rich in antioxidants and natural vitamins.',
      availability: 'In Stock',
      image: '/images/Promoganate.jpg',
      rating: 4.7,
      totalSales: 145,
      harvestDate: '2025-09-18',
      organic: true,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 30,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Antioxidant Rich', 'Sweet', 'Vitamin Rich'],
      nutritionScore: 96,
      shelfLife: '20 days',
      storageTemp: '4-8°C'
    },
    {
      id: 9,
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      pricePerKg: 35,
      originalPrice: 40,
      discount: 12,
      state: 'Karnataka',
      district: 'Kolar',
      village: 'Mulbagal',
      seller: 'Tomato Growers Co-op',
      phone: '+91 9876543218',
      description: 'Fresh, ripe tomatoes perfect for cooking and salads. Farm fresh quality.',
      availability: 'In Stock',
      image: '/images/tomato.jpg',
      rating: 4.3,
      totalSales: 456,
      harvestDate: '2025-09-24',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Farm Fresh'],
      tags: ['Fresh', 'Ripe', 'Cooking Essential'],
      nutritionScore: 82,
      shelfLife: '8 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 10,
      name: 'Green Gram (Moong Dal)',
      category: 'Pulses',
      pricePerKg: 120,
      originalPrice: 135,
      discount: 11,
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Mhow',
      seller: 'Central India Pulses',
      phone: '+91 9876543219',
      description: 'High-quality green gram, excellent source of protein and perfect for dal preparations.',
      availability: 'In Stock',
      image: '/images/Green Gram.jpg',
      rating: 4.5,
      totalSales: 198,
      harvestDate: '2025-07-25',
      organic: true,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 100,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Quality Assured'],
      tags: ['High Protein', 'Organic', 'Easy to Cook'],
      nutritionScore: 89,
      shelfLife: '16 months',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 11,
      name: 'Fresh Strawberries',
      category: 'Fruits',
      pricePerKg: 320,
      originalPrice: 380,
      discount: 16,
      state: 'Himachal Pradesh',
      district: 'Shimla',
      village: 'Narkanda',
      seller: 'Hill Station Berries',
      phone: '+91 9876543220',
      description: 'Premium fresh strawberries from hill stations, sweet and aromatic.',
      availability: 'Limited Stock',
      image: '/images/strawberry.jpg',
      rating: 4.9,
      totalSales: 87,
      harvestDate: '2025-09-22',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 5,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Premium', 'Sweet', 'Aromatic'],
      nutritionScore: 91,
      shelfLife: '3 days',
      storageTemp: '2-4°C'
    },
    {
      id: 12,
      name: 'Mixed Dry Fruits',
      category: 'Dry Fruits',
      pricePerKg: 650,
      originalPrice: 750,
      discount: 13,
      state: 'Delhi',
      district: 'New Delhi',
      village: 'Khari Baoli',
      seller: 'Premium Dry Fruits',
      phone: '+91 9876543221',
      description: 'Premium mix of almonds, cashews, raisins, and walnuts. Perfect for healthy snacking.',
      availability: 'In Stock',
      image: '/images/dry fruits.jpg',
      rating: 4.6,
      totalSales: 234,
      harvestDate: '2025-08-30',
      organic: false,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 20,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Premium Quality'],
      tags: ['Mixed Variety', 'Healthy Snack', 'Premium Quality'],
      nutritionScore: 93,
      shelfLife: '8 months',
      storageTemp: 'Cool & Dry'
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

  // Quick order functions
  const quickAddToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  // Cart management functions
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', marginTop: '100px' }}>
        {/* Enhanced Header Section with User Profile */}
        <div style={enhancedHeaderSection}>
          <div style={headerLeft}>
            <h1 style={pageTitle}>
              <FaShoppingCart style={{ marginRight: '15px', color: '#28a745' }} />
              Fresh Market
            </h1>
            <p style={pageSubtitle}>Farm-to-table fresh produce marketplace</p>
            <div style={marketStats}>
              <div style={statItem}>
                <FaStore style={{ color: '#28a745' }} />
                <span>500+ Farmers</span>
              </div>
              <div style={statItem}>
                <FaTruck style={{ color: '#007bff' }} />
                <span>Fast Delivery</span>
              </div>
              <div style={statItem}>
                <FaShieldAlt style={{ color: '#ffc107' }} />
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
          
          <div style={headerRight}>
            <div style={userProfileCard}>
              <div style={profileHeader}>
                <FaUserCircle size={50} color="#28a745" />
                <div>
                  <h3 style={{ margin: 0, color: 'white' }}>{userProfile.name}</h3>
                  <p style={{ margin: '5px 0', color: '#e0e0e0', fontSize: '14px' }}>
                    <FaLocationArrow style={{ marginRight: '5px' }} />
                    {userProfile.location}
                  </p>
                </div>
                <div style={notificationBadge}>
                  <FaBell size={20} />
                  {notifications > 0 && <span style={notificationCount}>{notifications}</span>}
                </div>
              </div>
              <div style={profileStats}>
                <div style={profileStat}>
                  <span style={statLabel}>Total Orders</span>
                  <span style={statValue}>{userProfile.orders}</span>
                </div>
                <div style={profileStat}>
                  <span style={statLabel}>Total Savings</span>
                  <span style={statValue}>₹{userProfile.savings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div style={enhancedTabContainer}>
          <button 
            onClick={() => setActiveTab('browse')}
            style={{...tabButton, ...(activeTab === 'browse' ? activeTabButton : {})}}
          >
            <FaSearch style={{ marginRight: '8px' }} />
            Browse Products
          </button>
          <button 
            onClick={() => setActiveTab('deals')}
            style={{...tabButton, ...(activeTab === 'deals' ? activeTabButton : {})}}
          >
            <FaGift style={{ marginRight: '8px' }} />
            Special Deals
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            style={{...tabButton, ...(activeTab === 'cart' ? activeTabButton : {})}}
          >
            <FaShoppingCart style={{ marginRight: '8px' }} />
            Cart ({getTotalCartItems()})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{...tabButton, ...(activeTab === 'orders' ? activeTabButton : {})}}
          >
            <FaHistory style={{ marginRight: '8px' }} />
            My Orders
          </button>
        </div>

        {/* Special Deals Tab */}
        {activeTab === 'deals' && (
          <div style={dealsSection}>
            <div style={dealsSectionHeader}>
              <h2 style={sectionTitle}>
                <FaFire style={{ marginRight: '10px', color: '#e74c3c' }} />
                Hot Deals & Offers
              </h2>
              <p style={{ color: '#666', textAlign: 'center', margin: '10px 0 30px' }}>
                Limited time offers on fresh produce bundles
              </p>
            </div>
            
            <div style={dealsGrid}>
              {specialDeals.map(deal => (
                <div key={deal.id} style={dealCard}>
                  <div style={dealBadge}>
                    <FaPercentage style={{ marginRight: '5px' }} />
                    {deal.discount}% OFF
                  </div>
                  
                  <div style={dealImageContainer}>
                    <img src={deal.image} alt={deal.title} style={dealImage} />
                  </div>
                  
                  <div style={dealInfo}>
                    <h3 style={dealTitle}>{deal.title}</h3>
                    <div style={dealItems}>
                      <span>Includes: {deal.items.join(', ')}</span>
                    </div>
                    
                    <div style={dealPricing}>
                      <span style={originalPriceStrike}>₹{deal.originalPrice}</span>
                      <span style={dealPrice}>₹{deal.dealPrice}</span>
                      <span style={savingsAmount}>Save ₹{deal.originalPrice - deal.dealPrice}</span>
                    </div>
                    
                    <div style={dealValidity}>
                      <FaClock style={{ marginRight: '5px', color: '#e74c3c' }} />
                      Valid until {new Date(deal.validUntil).toLocaleDateString()}
                    </div>
                    
                    <button style={dealButton}>
                      <FaGift style={{ marginRight: '8px' }} />
                      Grab Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'browse' ? (
          <div>
            {/* Enhanced Search and Filter Section */}
            <div style={enhancedFilterSection}>
              <div style={topFilters}>
                <div style={searchContainer}>
                  <FaSearch style={searchIcon} />
                  <input
                    type="text"
                    placeholder="Search products, sellers, locations, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInput}
                  />
                </div>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  style={{...filterToggleButton, backgroundColor: showFilters ? '#28a745' : 'white'}}
                >
                  <FaFilter style={{ marginRight: '8px', color: showFilters ? 'white' : '#666' }} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              <div style={quickFilters}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={categorySelect}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={categorySelect}
                >
                  <option value="featured">Featured First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>

                <label style={checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    style={checkboxInput}
                  />
                  <FaLeaf style={{ marginLeft: '5px', color: '#28a745' }} />
                  Organic Only
                </label>

                <label style={checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={quickOrderMode}
                    onChange={(e) => setQuickOrderMode(e.target.checked)}
                    style={checkboxInput}
                  />
                  <FaShippingFast style={{ marginLeft: '5px', color: '#007bff' }} />
                  Quick Order Mode
                </label>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div style={advancedFilters}>
                  <div style={filterGroup}>
                    <label style={filterLabel}>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      style={rangeSlider}
                    />
                  </div>
                  
                  <div style={filterGroup}>
                    <label style={filterLabel}>Select States:</label>
                    <div style={stateCheckboxes}>
                      {states.map(state => (
                        <label key={state} style={stateCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={selectedStates.includes(state)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStates([...selectedStates, state]);
                              } else {
                                setSelectedStates(selectedStates.filter(s => s !== state));
                              }
                            }}
                            style={checkboxInput}
                          />
                          {state}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div style={resultsSummary}>
              <span style={resultsText}>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              {selectedCategory !== 'all' && (
                <span style={activeFilter}>Category: {selectedCategory}</span>
              )}
              {organicOnly && (
                <span style={activeFilter}>
                  <FaLeaf style={{ marginRight: '5px' }} />
                  Organic Only
                </span>
              )}
              {selectedStates.length > 0 && (
                <span style={activeFilter}>States: {selectedStates.length} selected</span>
              )}
            </div>

            {/* Enhanced Products Grid */}
            <div style={productsGrid}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  style={{
                    ...enhancedProductCard, 
                    ...(product.featured ? featuredCard : {}),
                    transform: hoveredCard === product.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: hoveredCard === product.id ? '0 20px 40px rgba(0,0,0,0.15)' : (product.featured ? '0 8px 25px rgba(255, 215, 0, 0.2)' : '0 8px 25px rgba(0,0,0,0.1)')
                  }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Multiple Badges */}
                  <div style={badgeContainer}>
                    {product.featured && (
                      <div style={featuredBadge}>
                        <FaStar style={{ marginRight: '5px' }} />
                        Featured
                      </div>
                    )}
                    {product.trending && (
                      <div style={trendingBadge}>
                        <FaFire style={{ marginRight: '5px' }} />
                        Trending
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div style={discountBadge}>
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  
                  <div style={enhancedProductImageContainer}>
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={productImage}
                        onError={(e) => {
                          console.log('Image failed to load:', product.image);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{...productImagePlaceholder, display: product.image ? 'none' : 'flex'}}>
                      {getCategoryIcon(product.category)}
                      <div style={{ marginTop: '10px', textAlign: 'center', color: '#666' }}>
                        <small>{product.name}</small>
                      </div>
                    </div>
                    
                    {/* Enhanced Status Badges */}
                    <div style={statusBadges}>
                      <div style={{...availabilityBadge, 
                        backgroundColor: product.availability === 'In Stock' ? '#28a745' : 
                                       product.availability === 'Limited Stock' ? '#ffc107' : '#dc3545'
                      }}>
                        {product.availability}
                      </div>
                      
                      {product.organic && (
                        <div style={organicBadge}>
                          <FaLeaf style={{ marginRight: '3px' }} />
                          Organic
                        </div>
                      )}
                      
                      {product.fastDelivery && (
                        <div style={fastDeliveryBadge}>
                          <FaTruck style={{ marginRight: '3px' }} />
                          Fast
                        </div>
                      )}
                      
                      {product.freeShipping && (
                        <div style={freeShippingBadge}>
                          <FaShippingFast style={{ marginRight: '3px' }} />
                          Free Ship
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Image overlay with actions */}
                    <div style={{
                      ...imageOverlay,
                      opacity: hoveredCard === product.id ? 1 : 0
                    }}>
                      <button 
                        style={{
                          ...overlayButton,
                          backgroundColor: favorites.includes(product.id) ? '#e74c3c' : 'rgba(255, 255, 255, 0.9)',
                          color: favorites.includes(product.id) ? 'white' : '#333'
                        }}
                        onClick={() => toggleFavorite(product.id)}
                        title="Add to Favorites"
                      >
                        <FaHeart />
                      </button>
                      <button style={overlayButton} title="Quick View">
                        <FaEye />
                      </button>
                      {quickOrderMode && (
                        <button 
                          style={{...overlayButton, backgroundColor: '#28a745', color: 'white'}}
                          onClick={() => quickAddToCart(product, 1)}
                          title="Quick Add"
                        >
                          <FaShoppingCart />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div style={enhancedProductInfo}>
                    <div style={productHeader}>
                      <h3 style={productName}>{product.name}</h3>
                      <div style={ratingContainer}>
                        <FaStar style={{ color: '#ffc107', fontSize: '14px' }} />
                        <span style={ratingText}>{product.rating}</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Pricing */}
                    <div style={pricingSection}>
                      <div style={mainPrice}>
                        <span style={currentPrice}>₹{product.pricePerKg}/{product.unit}</span>
                        {product.discount > 0 && (
                          <span style={originalPriceStrike}>₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <div style={savingsText}>
                          You save ₹{product.originalPrice - product.pricePerKg}!
                        </div>
                      )}
                    </div>
                    
                    <div style={productMeta}>
                      <span style={productCategory}>{product.category}</span>
                      <span style={harvestBadge}>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                      <div style={nutritionScore}>
                        <FaAward style={{ marginRight: '3px', color: '#ffc107' }} />
                        Nutrition: {product.nutritionScore}/100
                      </div>
                    </div>
                    
                    <p style={productDescription}>{product.description}</p>
                    
                    {/* Enhanced Tags */}
                    <div style={tagsContainer}>
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} style={tagBadge}>{tag}</span>
                      ))}
                      {product.certifications.map((cert, index) => (
                        <span key={`cert-${index}`} style={certificationBadge}>
                          <FaMedal style={{ marginRight: '3px' }} />
                          {cert}
                        </span>
                      ))}
                    </div>
                    
                    {/* Enhanced Product Details */}
                    <div style={productDetails}>
                      <div style={detailGrid}>
                        <div style={detailItem}>
                          <FaMapMarkerAlt style={detailIcon} />
                          <span>{product.village}, {product.district}</span>
                        </div>
                        <div style={detailItem}>
                          <FaStore style={detailIcon} />
                          <span>{product.seller}</span>
                        </div>
                        <div style={detailItem}>
                          <FaShoppingBag style={detailIcon} />
                          <span>{product.totalSales} sold</span>
                        </div>
                        <div style={detailItem}>
                          <FaClock style={detailIcon} />
                          <span>Shelf: {product.shelfLife}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div style={enhancedProductActions}>
                      {quickOrderMode ? (
                        <div style={quickOrderActions}>
                          <button 
                            onClick={() => quickAddToCart(product, 0.5)}
                            style={quickOrderButton}
                            disabled={product.availability === 'Out of Stock'}
                          >
                            +0.5
                          </button>
                          <button 
                            onClick={() => quickAddToCart(product, 1)}
                            style={quickOrderButton}
                            disabled={product.availability === 'Out of Stock'}
                          >
                            +1
                          </button>
                          <button 
                            onClick={() => quickAddToCart(product, 2)}
                            style={quickOrderButton}
                            disabled={product.availability === 'Out of Stock'}
                          >
                            +2
                          </button>
                        </div>
                      ) : (
                        <div style={normalActions}>
                          <button 
                            style={{...primaryActionButton, 
                              backgroundColor: product.availability === 'In Stock' ? '#28a745' : 
                                              product.availability === 'Limited Stock' ? '#ffc107' : '#6c757d',
                              cursor: product.availability !== 'Out of Stock' ? 'pointer' : 'not-allowed'
                            }}
                            disabled={product.availability === 'Out of Stock'}
                            onClick={() => addToCart(product)}
                          >
                            {product.availability === 'Out of Stock' ? (
                              <>
                                <FaShieldAlt style={{ marginRight: '8px' }} />
                                Out of Stock
                              </>
                            ) : (
                              <>
                                <FaShoppingCart style={{ marginRight: '8px' }} />
                                Add to Cart
                              </>
                            )}
                          </button>
                          <button style={secondaryActionButton}>
                            <FaPhone style={{ marginRight: '8px' }} />
                            Contact
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'cart' ? (
          <div style={enhancedCartSection}>
            <div style={cartHeader}>
              <h2 style={sectionTitle}>
                <FaShoppingCart style={{ marginRight: '10px' }} />
                Shopping Cart
              </h2>
              {cartItems.length > 0 && (
                <button onClick={clearCart} style={clearCartButton}>
                  Clear Cart
                </button>
              )}
            </div>
            
            {cartItems.length === 0 ? (
              <div style={emptyCartContainer}>
                <FaShoppingCart size={80} color="#ccc" />
                <h3>Your cart is empty</h3>
                <p>Start shopping to add items to your cart</p>
                <button 
                  onClick={() => setActiveTab('browse')}
                  style={primaryActionButton}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div style={cartContent}>
                <div style={cartItemsList}>
                  {cartItems.map(item => (
                    <div key={item.id} style={enhancedCartItem}>
                      <img src={item.image} alt={item.name} style={cartItemImage} />
                      <div style={cartItemDetails}>
                        <h4 style={cartItemName}>{item.name}</h4>
                        <p style={cartItemPrice}>₹{item.pricePerKg}/{item.unit}</p>
                        <p style={cartItemSeller}>by {item.seller}</p>
                        <div style={cartItemMeta}>
                          {item.organic && (
                            <span style={cartItemBadge}>
                              <FaLeaf style={{ marginRight: '3px' }} />
                              Organic
                            </span>
                          )}
                          {item.fastDelivery && (
                            <span style={cartItemBadge}>
                              <FaTruck style={{ marginRight: '3px' }} />
                              Fast Delivery
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={cartItemActions}>
                        <div style={quantityControls}>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            style={quantityButton}
                          >
                            -
                          </button>
                          <span style={quantityDisplay}>{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            style={quantityButton}
                          >
                            +
                          </button>
                        </div>
                        <div style={itemTotal}>₹{(item.pricePerKg * item.quantity).toFixed(2)}</div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={removeButton}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={cartSummaryCard}>
                  <h3 style={summaryTitle}>Order Summary</h3>
                  <div style={summaryDetails}>
                    <div style={summaryRow}>
                      <span>Subtotal:</span>
                      <span>₹{cartItems.reduce((total, item) => total + (item.pricePerKg * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div style={summaryRow}>
                      <span>Delivery:</span>
                      <span>₹50</span>
                    </div>
                    <div style={summaryRow}>
                      <span>Discount:</span>
                      <span style={{ color: '#28a745' }}>-₹25</span>
                    </div>
                    <div style={summaryRowTotal}>
                      <span>Total:</span>
                      <span>₹{(cartItems.reduce((total, item) => total + (item.pricePerKg * item.quantity), 0) + 50 - 25).toFixed(2)}</span>
                    </div>
                  </div>
                  <div style={checkoutActions}>
                    <button style={continueShoppingButton} onClick={() => setActiveTab('browse')}>
                      Continue Shopping
                    </button>
                    <button style={checkoutButton}>
                      <FaHandshake style={{ marginRight: '8px' }} />
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Orders Tab
          <div style={ordersSection}>
            <h2 style={sectionTitle}>
              <FaHistory style={{ marginRight: '10px' }} />
              My Orders
            </h2>
            
            <div style={ordersList}>
              {recentOrders.map(order => (
                <div key={order.id} style={orderCard}>
                  <div style={orderHeader}>
                    <div>
                      <h4 style={orderItemName}>Order #{order.id}</h4>
                      <p style={orderDate}>{order.date}</p>
                    </div>
                    <div style={{
                      ...orderStatus,
                      backgroundColor: order.status === 'Delivered' ? '#28a745' : 
                                     order.status === 'In Transit' ? '#007bff' : '#ffc107'
                    }}>
                      {order.status}
                    </div>
                  </div>
                  <div style={orderDetails}>
                    <p style={orderItem}>{order.item}</p>
                    <div style={orderActions}>
                      <button style={viewOrderButton}>View Details</button>
                      {order.status === 'Delivered' && (
                        <button style={reorderButton}>
                          <FaShoppingCart style={{ marginRight: '5px' }} />
                          Reorder
                        </button>
                      )}
                    </div>
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

// Enhanced Styles
const enhancedHeaderSection = {
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
};

const headerLeft = {
  flex: 1,
  minWidth: '300px'
};

const headerRight = {
  flex: 1,
  maxWidth: '400px',
  minWidth: '300px'
};

const marketStats = {
  display: 'flex',
  gap: '30px',
  marginTop: '20px',
  flexWrap: 'wrap'
};

const statItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500'
};

const userProfileCard = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '20px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
};

const profileHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '15px'
};

const notificationBadge = {
  position: 'relative',
  cursor: 'pointer'
};

const notificationCount = {
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
};

const profileStats = {
  display: 'flex',
  gap: '20px'
};

const profileStat = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const statLabel = {
  fontSize: '12px',
  color: '#e0e0e0',
  marginBottom: '5px'
};

const statValue = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: 'white'
};

const enhancedTabContainer = {
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '8px',
  marginBottom: '40px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
  flexWrap: 'wrap',
  gap: '5px'
};

const enhancedFilterSection = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '25px',
  marginBottom: '30px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #f0f0f0'
};

const topFilters = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const filterToggleButton = {
  padding: '12px 24px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  minWidth: '150px',
  justifyContent: 'center'
};

const quickFilters = {
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingBottom: '20px',
  borderBottom: '1px solid #f0f0f0'
};

const checkboxLabel = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '8px',
  transition: 'background-color 0.3s ease'
};

const checkboxInput = {
  marginRight: '8px',
  cursor: 'pointer'
};

const advancedFilters = {
  marginTop: '20px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid #e9ecef'
};

const filterGroup = {
  marginBottom: '20px'
};

const filterLabel = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '10px'
};

const rangeSlider = {
  width: '100%',
  height: '6px',
  borderRadius: '3px',
  background: '#ddd',
  outline: 'none',
  cursor: 'pointer'
};

const stateCheckboxes = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '10px'
};

const stateCheckboxLabel = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  padding: '5px',
  cursor: 'pointer'
};

const resultsSummary = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '25px',
  flexWrap: 'wrap'
};

const resultsText = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#333'
};

const activeFilter = {
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center'
};

const enhancedProductCard = {
  backgroundColor: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'pointer',
  border: '1px solid #f0f0f0',
  position: 'relative',
  height: 'fit-content',
  minHeight: '700px'
};

const badgeContainer = {
  position: 'absolute',
  top: '15px',
  left: '15px',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const trendingBadge = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)'
};

const discountBadge = {
  backgroundColor: '#ff6b35',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
};

const enhancedProductImageContainer = {
  position: 'relative',
  height: '220px',
  overflow: 'hidden',
  background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
  borderRadius: '12px 12px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statusBadges = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  right: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '5px'
};

const fastDeliveryBadge = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center'
};

const freeShippingBadge = {
  backgroundColor: '#17a2b8',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center'
};

const enhancedProductInfo = {
  padding: '25px'
};

const pricingSection = {
  marginBottom: '15px'
};

const mainPrice = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '5px'
};

const currentPrice = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#28a745'
};

const originalPriceStrike = {
  fontSize: '14px',
  color: '#999',
  textDecoration: 'line-through'
};

const savingsText = {
  fontSize: '12px',
  color: '#e74c3c',
  fontWeight: '600'
};

const nutritionScore = {
  fontSize: '12px',
  color: '#ffc107',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center'
};

const certificationBadge = {
  fontSize: '11px',
  color: '#28a745',
  backgroundColor: '#e8f5e8',
  padding: '3px 8px',
  borderRadius: '8px',
  fontWeight: '500',
  border: '1px solid #c3e6cb',
  display: 'flex',
  alignItems: 'center'
};

const detailGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px'
};

const detailItem = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  color: '#555'
};

const enhancedProductActions = {
  marginTop: '20px'
};

const quickOrderActions = {
  display: 'flex',
  gap: '8px'
};

const quickOrderButton = {
  flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#28a745',
  color: 'white'
};

const normalActions = {
  display: 'flex',
  gap: '12px'
};

// Deals Section Styles
const dealsSection = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  marginTop: '20px'
};

const dealsSectionHeader = {
  textAlign: 'center',
  marginBottom: '40px'
};

const dealsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '30px'
};

const dealCard = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  border: '2px solid #e74c3c',
  position: 'relative',
  transition: 'transform 0.3s ease'
};

const dealBadge = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '8px 15px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center'
};

const dealImageContainer = {
  height: '200px',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa'
};

const dealImage = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const dealInfo = {
  padding: '25px'
};

const dealTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const dealItems = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px'
};

const dealPricing = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px'
};

const dealPrice = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#28a745'
};

const savingsAmount = {
  fontSize: '14px',
  color: '#e74c3c',
  fontWeight: '600'
};

const dealValidity = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  color: '#e74c3c',
  marginBottom: '20px'
};

const dealButton = {
  width: '100%',
  padding: '14px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#e74c3c',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// Enhanced Cart Styles
const enhancedCartSection = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  marginTop: '20px'
};

const cartHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '2px solid #f0f0f0'
};

const clearCartButton = {
  padding: '10px 20px',
  border: '2px solid #e74c3c',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  color: '#e74c3c',
  transition: 'all 0.3s ease'
};

const cartContent = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '40px'
};

const cartItemsList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const enhancedCartItem = {
  display: 'flex',
  gap: '20px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '16px',
  border: '1px solid #e9ecef',
  alignItems: 'center'
};

const cartItemName = {
  margin: '0 0 5px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50'
};

const cartItemPrice = {
  margin: '0 0 5px 0',
  fontSize: '14px',
  color: '#28a745',
  fontWeight: '600'
};

const cartItemSeller = {
  margin: '0 0 10px 0',
  fontSize: '12px',
  color: '#666'
};

const cartItemMeta = {
  display: 'flex',
  gap: '8px'
};

const cartItemBadge = {
  fontSize: '10px',
  padding: '2px 6px',
  borderRadius: '8px',
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  display: 'flex',
  alignItems: 'center'
};

const cartItemActions = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '10px'
};

const quantityControls = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '5px'
};

const quantityButton = {
  width: '30px',
  height: '30px',
  border: '1px solid #ddd',
  borderRadius: '50%',
  backgroundColor: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
};

const quantityDisplay = {
  padding: '0 15px',
  fontSize: '16px',
  fontWeight: '600'
};

const itemTotal = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#28a745'
};

const removeButton = {
  padding: '6px 12px',
  border: '1px solid #e74c3c',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  color: '#e74c3c',
  cursor: 'pointer',
  fontSize: '12px',
  transition: 'all 0.3s ease'
};

const cartSummaryCard = {
  backgroundColor: '#f8f9fa',
  borderRadius: '16px',
  padding: '25px',
  height: 'fit-content',
  position: 'sticky',
  top: '20px'
};

const summaryTitle = {
  margin: '0 0 20px 0',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#2c3e50'
};

const summaryDetails = {
  marginBottom: '25px'
};

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
  fontSize: '14px',
  color: '#666'
};

const summaryRowTotal = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '2px solid #ddd',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50'
};

const checkoutActions = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const continueShoppingButton = {
  padding: '12px',
  border: '2px solid #007bff',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  color: '#007bff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

const checkoutButton = {
  padding: '14px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#28a745',
  color: 'white',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// Orders Section Styles
const ordersSection = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  marginTop: '20px'
};

const ordersList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const orderCard = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid #e9ecef'
};

const orderHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '15px'
};

const orderItemName = {
  margin: '0 0 5px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50'
};

const orderDate = {
  margin: 0,
  fontSize: '12px',
  color: '#666'
};

const orderStatus = {
  padding: '6px 12px',
  borderRadius: '20px',
  color: 'white',
  fontSize: '12px',
  fontWeight: '600'
};

const orderDetails = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const orderItem = {
  margin: 0,
  fontSize: '14px',
  color: '#666'
};

const orderActions = {
  display: 'flex',
  gap: '10px'
};

const viewOrderButton = {
  padding: '8px 16px',
  border: '1px solid #007bff',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  color: '#007bff',
  cursor: 'pointer',
  fontSize: '12px',
  transition: 'all 0.3s ease'
};

const reorderButton = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#28a745',
  color: 'white',
  cursor: 'pointer',
  fontSize: '12px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center'
};

// Additional styles for marketplace components
const pageTitle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
};

const pageSubtitle = {
  fontSize: '1.3rem',
  margin: 0,
  opacity: 0.9,
  fontWeight: '300'
};

const tabButton = {
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
};

const activeTabButton = {
  backgroundColor: '#28a745',
  color: 'white',
  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
};

const searchContainer = {
  position: 'relative',
  flex: 1,
  minWidth: '320px'
};

const searchIcon = {
  position: 'absolute',
  left: '18px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#666',
  fontSize: '16px'
};

const searchInput = {
  width: '100%',
  padding: '16px 16px 16px 50px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '16px',
  outline: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const categorySelect = {
  padding: '16px 20px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '16px',
  backgroundColor: 'white',
  outline: 'none',
  minWidth: '200px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const productsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const productCard = {
  backgroundColor: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'pointer',
  border: '1px solid #f0f0f0',
  position: 'relative',
  height: 'fit-content',
  minHeight: '650px'
};

const featuredCard = {
  border: '2px solid #ffd700',
  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.2)'
};

const featuredBadge = {
  position: 'absolute',
  top: '15px',
  left: '15px',
  backgroundColor: '#ffd700',
  color: '#333',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
};

const productImageContainer = {
  position: 'relative',
  height: '220px',
  overflow: 'hidden',
  background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
  borderRadius: '12px 12px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const productImage = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center',
  transition: 'transform 0.5s ease',
  backgroundColor: '#f8f9fa'
};

const productImagePlaceholder = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: '#f8f9fa',
  color: '#666'
};

const imageOverlay = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  display: 'flex',
  gap: '8px',
  opacity: 0,
  transition: 'opacity 0.3s ease'
};

const overlayButton = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: '#333',
  backdropFilter: 'blur(10px)'
};

const availabilityBadge = {
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  padding: '6px 16px',
  borderRadius: '25px',
  color: 'white',
  fontSize: '12px',
  fontWeight: '600',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

const organicBadge = {
  position: 'absolute',
  bottom: '15px',
  left: '15px',
  backgroundColor: '#28a745',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
};

const productInfo = {
  padding: '25px'
};

const productHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
};

const productName = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: 0,
  lineHeight: '1.3'
};

const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: '#f8f9fa',
  padding: '4px 8px',
  borderRadius: '12px'
};

const ratingText = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333'
};

const productMeta = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  flexWrap: 'wrap',
  gap: '8px'
};

const productCategory = {
  fontSize: '14px',
  color: '#28a745',
  fontWeight: '600',
  backgroundColor: '#e8f5e8',
  padding: '4px 12px',
  borderRadius: '12px'
};

const harvestBadge = {
  fontSize: '12px',
  color: '#666',
  backgroundColor: '#f0f0f0',
  padding: '4px 8px',
  borderRadius: '8px',
  fontWeight: '500'
};

const productDescription = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px',
  lineHeight: '1.5'
};

const tagsContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '20px'
};

const tagBadge = {
  fontSize: '11px',
  color: '#007bff',
  backgroundColor: '#e3f2fd',
  padding: '3px 8px',
  borderRadius: '8px',
  fontWeight: '500',
  border: '1px solid #bbdefb'
};

const productDetails = {
  marginBottom: '25px'
};

const detailRow = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  fontSize: '14px',
  color: '#555'
};

const detailIcon = {
  marginRight: '10px',
  color: '#28a745',
  minWidth: '16px',
  fontSize: '14px'
};

const productActions = {
  display: 'flex',
  gap: '12px'
};

const primaryActionButton = {
  flex: 2,
  padding: '14px 20px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const secondaryActionButton = {
  flex: 1,
  padding: '14px 16px',
  border: '2px solid #007bff',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: '#007bff',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cartSection = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '40px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  marginTop: '20px'
};

const sectionTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '30px',
  textAlign: 'center'
};

const emptyCartContainer = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#666'
};

const cartItemsContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const cartItem = {
  display: 'flex',
  gap: '20px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px'
};

const cartItemImage = {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '8px'
};

const cartItemDetails = {
  flex: 1
};

export default ConsumerDashboard;

const cartItemDetails = {
  flex: 1
  height: '80px',
  objectFit: 'cover',
  borderRadius: '8px'
};

export default ConsumerDashboard;