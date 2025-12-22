import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './ConsumerDashboard.css';
import { FaShoppingCart, FaSearch, FaHeart, FaStar, FaLeaf, FaAppleAlt, FaSeedling, FaShoppingBag, FaMapMarkerAlt, FaRupeeSign, FaStore, FaPhone, FaEye, FaShieldAlt, FaFilter, FaSort, FaTruck, FaClock, FaThumbsUp, FaComments, FaChartLine, FaGift, FaBell, FaUserCircle, FaHistory, FaLocationArrow, FaPercentage, FaFire, FaMedal, FaAward, FaLightbulb, FaShippingFast, FaHandshake, FaCheck, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa';

const ConsumerDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'cart', 'orders', 'deals', 'profile'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showNavBar, setShowNavBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setShowNavBar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowNavBar(false);
      } else {
        // Scrolling up
        setShowNavBar(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price_low', 'price_high', 'rating', 'newest'
  const [showFilters, setShowFilters] = useState(false);
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
      image: '/images/fruits/Apple.jpg',
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
      image: '/images/fruits/Banana.jpg',
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
      image: '/images/vegetables/Beetroot.jpg',
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
      name: 'Sweet Mangoes',
      category: 'Fruits',
      pricePerKg: 180,
      originalPrice: 220,
      discount: 18,
      state: 'Maharashtra',
      district: 'Ratnagiri',
      village: 'Dapoli',
      seller: 'Alphonso Orchards',
      phone: '+91 9876543213',
      description: 'Premium Alphonso mangoes with rich, sweet flavor. King of fruits from Maharashtra.',
      availability: 'In Stock',
      image: '/images/fruits/Mango.jpg',
      rating: 4.9,
      totalSales: 312,
      harvestDate: '2025-09-15',
      organic: true,
      unit: 'kg',
      minOrder: 2,
      maxOrder: 30,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Organic', 'GI Tag'],
      tags: ['Premium', 'Alphonso', 'Seasonal'],
      nutritionScore: 90,
      shelfLife: '5 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 5,
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      pricePerKg: 40,
      originalPrice: 50,
      discount: 20,
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Mangalagiri',
      seller: 'Vegetable Hub',
      phone: '+91 9876543214',
      description: 'Fresh red tomatoes, perfect for cooking and salads. Juicy and flavorful.',
      availability: 'In Stock',
      image: '/images/tomato.jpg',
      rating: 4.6,
      totalSales: 421,
      harvestDate: '2025-09-23',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Fresh', 'Daily Use', 'Farm Fresh'],
      nutritionScore: 85,
      shelfLife: '7 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 6,
      name: 'Premium Cashews',
      category: 'Dry Fruits',
      pricePerKg: 680,
      originalPrice: 800,
      discount: 15,
      state: 'Kerala',
      district: 'Kollam',
      village: 'Kottarakkara',
      seller: 'Kerala Dry Fruits',
      phone: '+91 9876543215',
      description: 'Premium quality cashews from Kerala. Crunchy, fresh and perfectly roasted.',
      availability: 'In Stock',
      image: '/images/cashews.jpg',
      rating: 4.8,
      totalSales: 178,
      harvestDate: '2025-08-10',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 10,
      featured: true,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Export Quality'],
      tags: ['Premium', 'Roasted', 'Healthy Snack'],
      nutritionScore: 94,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 7,
      name: 'Fresh Green Peas',
      category: 'Vegetables',
      pricePerKg: 90,
      originalPrice: 110,
      discount: 18,
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Sanwer',
      seller: 'Fresh Veggie Mart',
      phone: '+91 9876543216',
      description: 'Fresh green peas, rich in protein and vitamins. Perfect for Indian curries.',
      availability: 'In Stock',
      image: '/images/vegetables.jpg',
      rating: 4.4,
      totalSales: 234,
      harvestDate: '2025-09-19',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 20,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Fresh', 'Protein Rich', 'Seasonal'],
      nutritionScore: 87,
      shelfLife: '5 days',
      storageTemp: '2-4°C'
    },
    {
      id: 8,
      name: 'Organic Oranges',
      category: 'Fruits',
      pricePerKg: 100,
      originalPrice: 130,
      discount: 23,
      state: 'Maharashtra',
      district: 'Nagpur',
      village: 'Katol',
      seller: 'Citrus Gardens',
      phone: '+91 9876543217',
      description: 'Juicy Nagpur oranges, packed with vitamin C. Sweet and tangy taste.',
      availability: 'In Stock',
      image: '/images/fruits/orange.jpg',
      rating: 4.7,
      totalSales: 298,
      harvestDate: '2025-09-17',
      organic: true,
      unit: 'kg',
      minOrder: 2,
      maxOrder: 40,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'GI Tag'],
      tags: ['Vitamin C', 'Juicy', 'Nagpur Special'],
      nutritionScore: 91,
      shelfLife: '12 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 9,
      name: 'Toor Dal (Arhar)',
      category: 'Pulses',
      pricePerKg: 140,
      originalPrice: 160,
      discount: 12,
      state: 'Rajasthan',
      district: 'Jodhpur',
      village: 'Phalodi',
      seller: 'Pulse Traders',
      phone: '+91 9876543218',
      description: 'Premium quality toor dal, rich in protein. Essential for Indian cooking.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.6,
      totalSales: 345,
      harvestDate: '2025-07-20',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Protein Rich', 'Dal', 'Daily Use'],
      nutritionScore: 88,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 10,
      name: 'Fresh Carrots',
      category: 'Vegetables',
      pricePerKg: 55,
      originalPrice: 65,
      discount: 15,
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Khanna',
      seller: 'Punjab Vegetables',
      phone: '+91 9876543219',
      description: 'Fresh orange carrots, crunchy and sweet. Rich in beta-carotene.',
      availability: 'In Stock',
      image: '/images/vegetables.jpg',
      rating: 4.5,
      totalSales: 267,
      harvestDate: '2025-09-21',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 30,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Fresh', 'Vitamin A', 'Healthy'],
      nutritionScore: 89,
      shelfLife: '14 days',
      storageTemp: '2-4°C'
    },
    {
      id: 11,
      name: 'Premium Almonds',
      category: 'Dry Fruits',
      pricePerKg: 720,
      originalPrice: 850,
      discount: 15,
      state: 'Kashmir',
      district: 'Srinagar',
      village: 'Budgam',
      seller: 'Kashmir Dry Fruits Co.',
      phone: '+91 9876543220',
      description: 'Premium Kashmiri almonds, rich in nutrients. Perfect for health-conscious consumers.',
      availability: 'In Stock',
      image: '/images/dryfruits/Badam.jpg',
      rating: 4.9,
      totalSales: 189,
      harvestDate: '2025-08-05',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 10,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Premium', 'Kashmiri', 'Brain Food'],
      nutritionScore: 96,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 12,
      name: 'Fresh Grapes',
      category: 'Fruits',
      pricePerKg: 140,
      originalPrice: 170,
      discount: 17,
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Ojhar',
      seller: 'Vineyard Farms',
      phone: '+91 9876543221',
      description: 'Fresh green grapes, seedless and sweet. Perfect for snacking and desserts.',
      availability: 'In Stock',
      image: '/images/fruits/green grape.jpg',
      rating: 4.7,
      totalSales: 301,
      harvestDate: '2025-09-18',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 25,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Seedless', 'Sweet', 'Fresh'],
      nutritionScore: 86,
      shelfLife: '7 days',
      storageTemp: '2-4°C'
    },
    {
      id: 13,
      name: 'Moong Dal (Green Gram)',
      category: 'Pulses',
      pricePerKg: 130,
      originalPrice: 150,
      discount: 13,
      state: 'Rajasthan',
      district: 'Bikaner',
      village: 'Nokha',
      seller: 'Rajasthan Pulses',
      phone: '+91 9876543222',
      description: 'High-quality moong dal, perfect for sprouts and traditional dishes.',
      availability: 'In Stock',
      image: '/images/Green Gram.jpg',
      rating: 4.5,
      totalSales: 278,
      harvestDate: '2025-07-15',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Protein', 'Sprouts', 'Healthy'],
      nutritionScore: 90,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 14,
      name: 'Fresh Potatoes',
      category: 'Vegetables',
      pricePerKg: 30,
      originalPrice: 40,
      discount: 25,
      state: 'Uttar Pradesh',
      district: 'Agra',
      village: 'Fatehabad',
      seller: 'Farm Direct',
      phone: '+91 9876543223',
      description: 'Fresh farm potatoes, perfect for all types of cooking. Daily essential vegetable.',
      availability: 'In Stock',
      image: '/images/vegetables/potato.jpg',
      rating: 4.3,
      totalSales: 567,
      harvestDate: '2025-09-22',
      organic: false,
      unit: 'kg',
      minOrder: 2,
      maxOrder: 100,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Daily Use', 'Versatile', 'Farm Fresh'],
      nutritionScore: 82,
      shelfLife: '30 days',
      storageTemp: 'Cool & Dark'
    },
    {
      id: 15,
      name: 'Premium Walnuts',
      category: 'Dry Fruits',
      pricePerKg: 820,
      originalPrice: 950,
      discount: 13,
      state: 'Kashmir',
      district: 'Anantnag',
      village: 'Pahalgam',
      seller: 'Kashmir Nuts',
      phone: '+91 9876543224',
      description: 'Premium Kashmiri walnuts, rich in omega-3 fatty acids. Brain-boosting superfood.',
      availability: 'In Stock',
      image: '/images/dryfruits/Waltnut.jpg',
      rating: 4.8,
      totalSales: 156,
      harvestDate: '2025-08-01',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 8,
      featured: true,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Export Quality'],
      tags: ['Premium', 'Omega-3', 'Brain Food'],
      nutritionScore: 97,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 16,
      name: 'Fresh Spinach',
      category: 'Vegetables',
      pricePerKg: 45,
      originalPrice: 55,
      discount: 18,
      state: 'Delhi',
      district: 'South Delhi',
      village: 'Mehrauli',
      seller: 'Green Leafy Farms',
      phone: '+91 9876543225',
      description: 'Fresh organic spinach leaves, rich in iron and vitamins. Perfect for healthy meals.',
      availability: 'In Stock',
      image: '/images/vegetables.jpg',
      rating: 4.6,
      totalSales: 198,
      harvestDate: '2025-09-24',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 15,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'Pesticide Free'],
      tags: ['Leafy Green', 'Iron Rich', 'Organic'],
      nutritionScore: 93,
      shelfLife: '3 days',
      storageTemp: '2-4°C'
    },
    {
      id: 17,
      name: 'Sweet Watermelon',
      category: 'Fruits',
      pricePerKg: 35,
      originalPrice: 45,
      discount: 22,
      state: 'Andhra Pradesh',
      district: 'Anantapur',
      village: 'Kanekal',
      seller: 'Melon Growers',
      phone: '+91 9876543226',
      description: 'Sweet and juicy watermelons, perfect for summer refreshment. Hydrating and delicious.',
      availability: 'In Stock',
      image: '/images/fruits/water melon.jpg',
      rating: 4.5,
      totalSales: 389,
      harvestDate: '2025-09-16',
      organic: false,
      unit: 'kg',
      minOrder: 3,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Summer Fruit', 'Hydrating', 'Sweet'],
      nutritionScore: 84,
      shelfLife: '10 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 18,
      name: 'Chana Dal (Bengal Gram)',
      category: 'Pulses',
      pricePerKg: 120,
      originalPrice: 140,
      discount: 14,
      state: 'Madhya Pradesh',
      district: 'Sehore',
      village: 'Ashta',
      seller: 'MP Pulses Co.',
      phone: '+91 9876543227',
      description: 'Premium chana dal, high in protein and fiber. Essential for Indian cuisine.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.6,
      totalSales: 312,
      harvestDate: '2025-07-25',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Protein', 'Fiber', 'Traditional'],
      nutritionScore: 89,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 19,
      name: 'Premium Raisins',
      category: 'Dry Fruits',
      pricePerKg: 380,
      originalPrice: 450,
      discount: 15,
      state: 'Maharashtra',
      district: 'Sangli',
      village: 'Tasgaon',
      seller: 'Dry Fruit Depot',
      phone: '+91 9876543228',
      description: 'Premium quality raisins, naturally sweet and healthy. Rich in antioxidants.',
      availability: 'In Stock',
      image: '/images/dry fruits.jpg',
      rating: 4.7,
      totalSales: 234,
      harvestDate: '2025-08-12',
      organic: false,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 15,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Sweet', 'Healthy Snack', 'Antioxidants'],
      nutritionScore: 85,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 20,
      name: 'Fresh Onions',
      category: 'Vegetables',
      pricePerKg: 35,
      originalPrice: 45,
      discount: 22,
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Niphad',
      seller: 'Onion Traders',
      phone: '+91 9876543229',
      description: 'Fresh red onions from Nashik, the onion capital. Essential cooking ingredient.',
      availability: 'In Stock',
      image: '/images/vegetables.jpg',
      rating: 4.4,
      totalSales: 678,
      harvestDate: '2025-09-20',
      organic: false,
      unit: 'kg',
      minOrder: 2,
      maxOrder: 100,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Daily Use', 'Essential', 'Fresh'],
      nutritionScore: 81,
      shelfLife: '60 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 21,
      name: 'Fresh Garlic',
      category: 'Vegetables',
      pricePerKg: 180,
      originalPrice: 210,
      discount: 14,
      state: 'Madhya Pradesh',
      district: 'Mandsaur',
      village: 'Malhargarh',
      seller: 'Spice Valley',
      phone: '+91 9876543230',
      description: 'Premium quality garlic, essential for Indian cooking. Rich in health benefits.',
      availability: 'In Stock',
      image: '/images/Garlic.jpg',
      rating: 4.7,
      totalSales: 289,
      harvestDate: '2025-08-25',
      organic: false,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 20,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Spice', 'Medicinal', 'Daily Use'],
      nutritionScore: 88,
      shelfLife: '90 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 22,
      name: 'Fresh Green Chillies',
      category: 'Vegetables',
      pricePerKg: 60,
      originalPrice: 75,
      discount: 20,
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Tenali',
      seller: 'Chilli Growers',
      phone: '+91 9876543231',
      description: 'Spicy green chillies from Guntur, perfect for adding heat to your dishes.',
      availability: 'In Stock',
      image: '/images/Green Chillies.jpg',
      rating: 4.5,
      totalSales: 345,
      harvestDate: '2025-09-23',
      organic: false,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 10,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Spicy', 'Fresh', 'Guntur Special'],
      nutritionScore: 86,
      shelfLife: '7 days',
      storageTemp: '2-4°C'
    },
    {
      id: 23,
      name: 'Fresh Mushrooms',
      category: 'Vegetables',
      pricePerKg: 150,
      originalPrice: 180,
      discount: 16,
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Dehlon',
      seller: 'Mushroom Cultivation',
      phone: '+91 9876543232',
      description: 'Fresh button mushrooms, protein-rich and perfect for various cuisines.',
      availability: 'In Stock',
      image: '/images/Mushroom.jpg',
      rating: 4.6,
      totalSales: 198,
      harvestDate: '2025-09-24',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 10,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'Quality Assured'],
      tags: ['Protein Rich', 'Gourmet', 'Organic'],
      nutritionScore: 91,
      shelfLife: '4 days',
      storageTemp: '2-4°C'
    },
    {
      id: 24,
      name: 'Bitter Gourd',
      category: 'Vegetables',
      pricePerKg: 55,
      originalPrice: 70,
      discount: 21,
      state: 'West Bengal',
      district: 'Kolkata',
      village: 'Baruipur',
      seller: 'Green Harvest',
      phone: '+91 9876543233',
      description: 'Fresh bitter gourd, highly nutritious and beneficial for health. Great for diabetes management.',
      availability: 'In Stock',
      image: '/images/Bitter gaurd.jpg',
      rating: 4.3,
      totalSales: 167,
      harvestDate: '2025-09-22',
      organic: false,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 15,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Nutritious', 'Medicinal', 'Traditional'],
      nutritionScore: 90,
      shelfLife: '5 days',
      storageTemp: '2-4°C'
    },
    {
      id: 25,
      name: 'Dasheen Root (Arbi)',
      category: 'Vegetables',
      pricePerKg: 48,
      originalPrice: 60,
      discount: 20,
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      village: 'Chandauli',
      seller: 'Root Vegetables Co.',
      phone: '+91 9876543234',
      description: 'Fresh dasheen root (arbi), perfect for traditional Indian recipes. Rich and starchy.',
      availability: 'In Stock',
      image: '/images/Dasheenroot.jpg',
      rating: 4.4,
      totalSales: 143,
      harvestDate: '2025-09-19',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 20,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Traditional', 'Starchy', 'Fresh'],
      nutritionScore: 83,
      shelfLife: '10 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 26,
      name: 'Fresh Strawberries',
      category: 'Fruits',
      pricePerKg: 250,
      originalPrice: 300,
      discount: 16,
      state: 'Himachal Pradesh',
      district: 'Kullu',
      village: 'Manali',
      seller: 'Hill Berry Farms',
      phone: '+91 9876543235',
      description: 'Fresh, juicy strawberries from Himalayan valleys. Sweet and aromatic.',
      availability: 'In Stock',
      image: '/images/strawberry.jpg',
      rating: 4.8,
      totalSales: 276,
      harvestDate: '2025-09-20',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 10,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Organic', 'Premium Quality'],
      tags: ['Premium', 'Sweet', 'Berries'],
      nutritionScore: 92,
      shelfLife: '3 days',
      storageTemp: '2-4°C'
    },
    {
      id: 27,
      name: 'Dragon Fruit',
      category: 'Fruits',
      pricePerKg: 200,
      originalPrice: 250,
      discount: 20,
      state: 'Karnataka',
      district: 'Bangalore',
      village: 'Hoskote',
      seller: 'Exotic Fruits',
      phone: '+91 9876543236',
      description: 'Exotic dragon fruit, rich in antioxidants. Beautiful pink flesh with unique taste.',
      availability: 'In Stock',
      image: '/images/dragon fruit.jpg',
      rating: 4.6,
      totalSales: 198,
      harvestDate: '2025-09-18',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 15,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Exotic', 'Antioxidants', 'Premium'],
      nutritionScore: 88,
      shelfLife: '7 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 28,
      name: 'Fresh Guava',
      category: 'Fruits',
      pricePerKg: 70,
      originalPrice: 90,
      discount: 22,
      state: 'Uttar Pradesh',
      district: 'Allahabad',
      village: 'Karchhana',
      seller: 'Guava Orchards',
      phone: '+91 9876543237',
      description: 'Fresh Allahabad guavas, rich in vitamin C. Crunchy and sweet.',
      availability: 'In Stock',
      image: '/images/guva.jpg',
      rating: 4.7,
      totalSales: 334,
      harvestDate: '2025-09-21',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 30,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Vitamin C', 'Fresh', 'Traditional'],
      nutritionScore: 90,
      shelfLife: '5 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 29,
      name: 'Fresh Kiwi',
      category: 'Fruits',
      pricePerKg: 280,
      originalPrice: 350,
      discount: 20,
      state: 'Himachal Pradesh',
      district: 'Shimla',
      village: 'Fagu',
      seller: 'Mountain Fruits',
      phone: '+91 9876543238',
      description: 'Fresh kiwi fruits from Himachal Pradesh. Rich in nutrients and tangy flavor.',
      availability: 'In Stock',
      image: '/images/kiwi.jpg',
      rating: 4.8,
      totalSales: 187,
      harvestDate: '2025-09-15',
      organic: true,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 10,
      featured: true,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Exotic', 'Nutrient Rich', 'Premium'],
      nutritionScore: 94,
      shelfLife: '10 days',
      storageTemp: '2-4°C'
    },
    {
      id: 30,
      name: 'Fresh Peaches',
      category: 'Fruits',
      pricePerKg: 220,
      originalPrice: 270,
      discount: 18,
      state: 'Kashmir',
      district: 'Shopian',
      village: 'Zainpora',
      seller: 'Kashmir Orchards',
      phone: '+91 9876543239',
      description: 'Juicy Kashmiri peaches, sweet and aromatic. Premium summer fruit.',
      availability: 'In Stock',
      image: '/images/Peach.jpg',
      rating: 4.7,
      totalSales: 213,
      harvestDate: '2025-09-17',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 20,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Juicy', 'Sweet', 'Summer Fruit'],
      nutritionScore: 87,
      shelfLife: '5 days',
      storageTemp: '2-4°C'
    },
    {
      id: 31,
      name: 'Pomegranate',
      category: 'Fruits',
      pricePerKg: 150,
      originalPrice: 180,
      discount: 16,
      state: 'Maharashtra',
      district: 'Solapur',
      village: 'Pandharpur',
      seller: 'Pomegranate Farms',
      phone: '+91 9876543240',
      description: 'Fresh pomegranates, rich in antioxidants. Sweet ruby red arils.',
      availability: 'In Stock',
      image: '/images/Promoganate.jpg',
      rating: 4.8,
      totalSales: 298,
      harvestDate: '2025-09-19',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 25,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured', 'Export Quality'],
      tags: ['Antioxidants', 'Healthy', 'Premium'],
      nutritionScore: 93,
      shelfLife: '15 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 32,
      name: 'Fresh Sapota (Chikoo)',
      category: 'Fruits',
      pricePerKg: 90,
      originalPrice: 110,
      discount: 18,
      state: 'Gujarat',
      district: 'Valsad',
      village: 'Dharampur',
      seller: 'Sapota Gardens',
      phone: '+91 9876543241',
      description: 'Sweet and soft sapota, naturally delicious. Rich in energy and vitamins.',
      availability: 'In Stock',
      image: '/images/sapota.jpg',
      rating: 4.6,
      totalSales: 256,
      harvestDate: '2025-09-22',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 20,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Sweet', 'Energy Rich', 'Traditional'],
      nutritionScore: 85,
      shelfLife: '5 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 33,
      name: 'Custard Apple',
      category: 'Fruits',
      pricePerKg: 130,
      originalPrice: 160,
      discount: 18,
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Baramati',
      seller: 'Fruit Orchards',
      phone: '+91 9876543242',
      description: 'Fresh custard apples, creamy and sweet. Seasonal delicacy.',
      availability: 'In Stock',
      image: '/images/Custard apple.jpg',
      rating: 4.7,
      totalSales: 189,
      harvestDate: '2025-09-16',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 15,
      featured: false,
      trending: true,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Seasonal', 'Creamy', 'Sweet'],
      nutritionScore: 86,
      shelfLife: '3 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 34,
      name: 'Black Currants',
      category: 'Fruits',
      pricePerKg: 320,
      originalPrice: 400,
      discount: 20,
      state: 'Himachal Pradesh',
      district: 'Kinnaur',
      village: 'Kalpa',
      seller: 'Berry Farms',
      phone: '+91 9876543243',
      description: 'Premium black currants, rich in vitamin C and antioxidants. Tart and nutritious.',
      availability: 'In Stock',
      image: '/images/Black Currant Blue Berries.jpg',
      rating: 4.8,
      totalSales: 145,
      harvestDate: '2025-09-14',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 5,
      featured: true,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Premium Quality'],
      tags: ['Berries', 'Antioxidants', 'Premium'],
      nutritionScore: 96,
      shelfLife: '5 days',
      storageTemp: '2-4°C'
    },
    {
      id: 35,
      name: 'Black Berries',
      category: 'Fruits',
      pricePerKg: 280,
      originalPrice: 350,
      discount: 20,
      state: 'Kashmir',
      district: 'Srinagar',
      village: 'Gulmarg',
      seller: 'Mountain Berries',
      phone: '+91 9876543244',
      description: 'Fresh blackberries from Kashmir valleys. Sweet, juicy and packed with nutrients.',
      availability: 'In Stock',
      image: '/images/Black Berries.jpg',
      rating: 4.7,
      totalSales: 167,
      harvestDate: '2025-09-18',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 5,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Berries', 'Organic', 'Nutrient Dense'],
      nutritionScore: 95,
      shelfLife: '4 days',
      storageTemp: '2-4°C'
    },
    {
      id: 36,
      name: 'Gooseberries (Amla)',
      category: 'Fruits',
      pricePerKg: 110,
      originalPrice: 140,
      discount: 21,
      state: 'Uttar Pradesh',
      district: 'Pratapgarh',
      village: 'Kunda',
      seller: 'Amla Growers',
      phone: '+91 9876543245',
      description: 'Fresh Indian gooseberries (amla), highest source of vitamin C. Immunity booster.',
      availability: 'In Stock',
      image: '/images/goosberries(Amla).jpg',
      rating: 4.6,
      totalSales: 223,
      harvestDate: '2025-09-20',
      organic: false,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 20,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured', 'Medicinal Grade'],
      tags: ['Vitamin C', 'Immunity', 'Ayurvedic'],
      nutritionScore: 98,
      shelfLife: '10 days',
      storageTemp: 'Room Temperature'
    },
    {
      id: 37,
      name: 'Raspberries',
      category: 'Fruits',
      pricePerKg: 380,
      originalPrice: 450,
      discount: 15,
      state: 'Himachal Pradesh',
      district: 'Shimla',
      village: 'Mashobra',
      seller: 'Premium Berries',
      phone: '+91 9876543246',
      description: 'Fresh raspberries from Himalayan region. Delicate, sweet and highly nutritious.',
      availability: 'In Stock',
      image: '/images/Raspberries.jpg',
      rating: 4.9,
      totalSales: 134,
      harvestDate: '2025-09-19',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 3,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Export Quality'],
      tags: ['Premium', 'Delicate', 'Antioxidants'],
      nutritionScore: 97,
      shelfLife: '2 days',
      storageTemp: '2-4°C'
    },
    {
      id: 38,
      name: 'Water Apple (Rose Apple)',
      category: 'Fruits',
      pricePerKg: 95,
      originalPrice: 120,
      discount: 20,
      state: 'Kerala',
      district: 'Wayanad',
      village: 'Kalpetta',
      seller: 'Tropical Fruits',
      phone: '+91 9876543247',
      description: 'Fresh water apples, crispy and mildly sweet. Refreshing tropical fruit.',
      availability: 'In Stock',
      image: '/images/water apple.jpg',
      rating: 4.5,
      totalSales: 178,
      harvestDate: '2025-09-21',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 15,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Tropical', 'Refreshing', 'Crispy'],
      nutritionScore: 84,
      shelfLife: '5 days',
      storageTemp: '2-4°C'
    },
    {
      id: 39,
      name: 'Premium Pistachios',
      category: 'Dry Fruits',
      pricePerKg: 1200,
      originalPrice: 1400,
      discount: 14,
      state: 'Kashmir',
      district: 'Srinagar',
      village: 'Budgam',
      seller: 'Kashmir Nuts Premium',
      phone: '+91 9876543248',
      description: 'Premium Kashmiri pistachios, rich and flavorful. Perfect healthy snack.',
      availability: 'In Stock',
      image: '/images/pista.jpg',
      rating: 4.9,
      totalSales: 167,
      harvestDate: '2025-08-08',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 5,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Export Quality'],
      tags: ['Premium', 'Kashmiri', 'Protein Rich'],
      nutritionScore: 96,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 40,
      name: 'Premium Peanuts',
      category: 'Dry Fruits',
      pricePerKg: 180,
      originalPrice: 220,
      discount: 18,
      state: 'Gujarat',
      district: 'Junagadh',
      village: 'Keshod',
      seller: 'Groundnut Traders',
      phone: '+91 9876543249',
      description: 'Premium quality peanuts from Gujarat. Crunchy and protein-rich.',
      availability: 'In Stock',
      image: '/images/Peanuts.jpg',
      rating: 4.6,
      totalSales: 456,
      harvestDate: '2025-08-15',
      organic: false,
      unit: 'kg',
      minOrder: 0.5,
      maxOrder: 30,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Protein', 'Affordable', 'Crunchy'],
      nutritionScore: 89,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 41,
      name: 'Chestnuts',
      category: 'Dry Fruits',
      pricePerKg: 650,
      originalPrice: 780,
      discount: 16,
      state: 'Himachal Pradesh',
      district: 'Kullu',
      village: 'Manali',
      seller: 'Hill Nuts',
      phone: '+91 9876543250',
      description: 'Fresh chestnuts from Himalayan region. Sweet and nutritious.',
      availability: 'In Stock',
      image: '/images/chestnuts.jpg',
      rating: 4.7,
      totalSales: 123,
      harvestDate: '2025-08-20',
      organic: false,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 8,
      featured: false,
      trending: false,
      fastDelivery: false,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Himalayan', 'Sweet', 'Nutritious'],
      nutritionScore: 87,
      shelfLife: '90 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 42,
      name: 'Hazelnuts',
      category: 'Dry Fruits',
      pricePerKg: 890,
      originalPrice: 1050,
      discount: 15,
      state: 'Kashmir',
      district: 'Anantnag',
      village: 'Pahalgam',
      seller: 'Premium Nuts Co.',
      phone: '+91 9876543251',
      description: 'Premium hazelnuts, rich in healthy fats and vitamins. Excellent for baking.',
      availability: 'In Stock',
      image: '/images/hazel nuts.jpg',
      rating: 4.8,
      totalSales: 145,
      harvestDate: '2025-08-12',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 6,
      featured: true,
      trending: false,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Premium Grade'],
      tags: ['Premium', 'Healthy Fats', 'Baking'],
      nutritionScore: 94,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 43,
      name: 'Macadamia Nuts',
      category: 'Dry Fruits',
      pricePerKg: 1600,
      originalPrice: 1900,
      discount: 15,
      state: 'Karnataka',
      district: 'Coorg',
      village: 'Madikeri',
      seller: 'Exotic Nuts',
      phone: '+91 9876543252',
      description: 'Premium macadamia nuts, buttery and rich. Luxury healthy snack.',
      availability: 'In Stock',
      image: '/images/macadamia.jpg',
      rating: 4.9,
      totalSales: 98,
      harvestDate: '2025-08-05',
      organic: true,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 3,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Organic', 'Premium Quality'],
      tags: ['Luxury', 'Buttery', 'Premium'],
      nutritionScore: 95,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 44,
      name: 'Lotus Seeds (Makhana)',
      category: 'Dry Fruits',
      pricePerKg: 450,
      originalPrice: 550,
      discount: 18,
      state: 'Bihar',
      district: 'Darbhanga',
      village: 'Madhubani',
      seller: 'Makhana Traders',
      phone: '+91 9876543253',
      description: 'Premium lotus seeds (makhana), perfect for fasting and healthy snacking.',
      availability: 'In Stock',
      image: '/images/lotus seed.jpg',
      rating: 4.7,
      totalSales: 289,
      harvestDate: '2025-07-30',
      organic: false,
      unit: 'kg',
      minOrder: 0.25,
      maxOrder: 15,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Fasting', 'Low Calorie', 'Crunchy'],
      nutritionScore: 88,
      shelfLife: '180 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 45,
      name: 'Urad Dal (Black Gram)',
      category: 'Pulses',
      pricePerKg: 135,
      originalPrice: 155,
      discount: 12,
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      village: 'Hoshangabad',
      seller: 'Dal Merchants',
      phone: '+91 9876543254',
      description: 'Premium urad dal, essential for South Indian cuisine. Rich in protein.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.6,
      totalSales: 378,
      harvestDate: '2025-07-22',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Protein', 'South Indian', 'Essential'],
      nutritionScore: 90,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 46,
      name: 'Masoor Dal (Red Lentils)',
      category: 'Pulses',
      pricePerKg: 110,
      originalPrice: 130,
      discount: 15,
      state: 'Uttar Pradesh',
      district: 'Kanpur',
      village: 'Unnao',
      seller: 'Lentil Traders',
      phone: '+91 9876543255',
      description: 'High-quality masoor dal, quick cooking and nutritious. Perfect for daily meals.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.5,
      totalSales: 423,
      harvestDate: '2025-07-18',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Quick Cook', 'Protein', 'Daily Use'],
      nutritionScore: 87,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 47,
      name: 'Rajma (Kidney Beans)',
      category: 'Pulses',
      pricePerKg: 160,
      originalPrice: 185,
      discount: 13,
      state: 'Jammu and Kashmir',
      district: 'Jammu',
      village: 'Akhnoor',
      seller: 'Himalayan Pulses',
      phone: '+91 9876543256',
      description: 'Premium Kashmiri rajma, large and flavorful. Perfect for rajma chawal.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.8,
      totalSales: 312,
      harvestDate: '2025-07-20',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 40,
      featured: true,
      trending: true,
      fastDelivery: false,
      freeShipping: true,
      certifications: ['Quality Assured', 'Premium Grade'],
      tags: ['Kashmiri', 'Large Size', 'Flavorful'],
      nutritionScore: 91,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 48,
      name: 'Kabuli Chana (White Chickpeas)',
      category: 'Pulses',
      pricePerKg: 145,
      originalPrice: 165,
      discount: 12,
      state: 'Rajasthan',
      district: 'Jaipur',
      village: 'Chomu',
      seller: 'Chickpea Traders',
      phone: '+91 9876543257',
      description: 'Premium kabuli chana, large size chickpeas. Perfect for chole and salads.',
      availability: 'In Stock',
      image: '/images/Black Gram.jpg',
      rating: 4.6,
      totalSales: 356,
      harvestDate: '2025-07-25',
      organic: false,
      unit: 'kg',
      minOrder: 1,
      maxOrder: 50,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Protein Rich', 'Versatile', 'Large Size'],
      nutritionScore: 89,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 49,
      name: 'Premium Rice',
      category: 'Pulses',
      pricePerKg: 85,
      originalPrice: 100,
      discount: 15,
      state: 'Andhra Pradesh',
      district: 'West Godavari',
      village: 'Bhimavaram',
      seller: 'Rice Mills',
      phone: '+91 9876543258',
      description: 'Premium quality rice, aromatic and perfect for daily cooking. Long grain variety.',
      availability: 'In Stock',
      image: '/images/rice.jpg',
      rating: 4.7,
      totalSales: 678,
      harvestDate: '2025-06-15',
      organic: false,
      unit: 'kg',
      minOrder: 5,
      maxOrder: 100,
      featured: true,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['Long Grain', 'Aromatic', 'Daily Use'],
      nutritionScore: 84,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 50,
      name: 'Premium Wheat',
      category: 'Pulses',
      pricePerKg: 45,
      originalPrice: 55,
      discount: 18,
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Raikot',
      seller: 'Wheat Growers',
      phone: '+91 9876543259',
      description: 'Premium quality wheat grains, perfect for making fresh atta. High protein content.',
      availability: 'In Stock',
      image: '/images/wheat.jpg',
      rating: 4.6,
      totalSales: 789,
      harvestDate: '2025-05-20',
      organic: false,
      unit: 'kg',
      minOrder: 10,
      maxOrder: 150,
      featured: false,
      trending: true,
      fastDelivery: true,
      freeShipping: true,
      certifications: ['Quality Assured', 'FSSAI'],
      tags: ['High Protein', 'Fresh', 'Daily Use'],
      nutritionScore: 86,
      shelfLife: '365 days',
      storageTemp: 'Cool & Dry'
    },
    {
      id: 51,
      name: 'Fresh Maize (Corn)',
      category: 'Pulses',
      pricePerKg: 38,
      originalPrice: 48,
      discount: 20,
      state: 'Karnataka',
      district: 'Davangere',
      village: 'Harihara',
      seller: 'Grain Merchants',
      phone: '+91 9876543260',
      description: 'Fresh maize grains, sweet and nutritious. Perfect for various dishes.',
      availability: 'In Stock',
      image: '/images/maize.jpg',
      rating: 4.5,
      totalSales: 567,
      harvestDate: '2025-08-10',
      organic: false,
      unit: 'kg',
      minOrder: 5,
      maxOrder: 100,
      featured: false,
      trending: false,
      fastDelivery: true,
      freeShipping: false,
      certifications: ['Quality Assured'],
      tags: ['Sweet', 'Versatile', 'Nutritious'],
      nutritionScore: 83,
      shelfLife: '180 days',
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
      
      const matchesState = selectedStates.length === 0 || selectedStates.includes(product.state);
      
      const matchesOrganic = !organicOnly || product.organic;
      
      return matchesSearch && matchesCategory && matchesState && matchesOrganic;
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

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.pricePerKg * item.quantity), 0);
  };

  const getCartSubtotal = () => {
    return getCartTotal();
  };

  const getDeliveryCharge = () => {
    return getCartTotal() >= 500 ? 0 : 40;
  };

  const getGrandTotal = () => {
    return getCartSubtotal() + getDeliveryCharge();
  };

  return (
    <div className="consumer-dashboard">
      <Navbar 
        showCart={false}
        cartCount={getTotalCartItems()} 
        isConsumerDashboard={true}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearchClick={() => setShowSearchModal(!showSearchModal)}
      />
      
      {/* Search Modal */}
      {showSearchModal && (
        <div style={styles.searchModal} onClick={() => setShowSearchModal(false)}>
          <div style={styles.searchModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.searchModalHeader}>
              <FaSearch style={{ marginRight: '10px', color: '#28a745' }} />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchModalInput}
                autoFocus
              />
              <button onClick={() => setShowSearchModal(false)} style={styles.closeSearchBtn}>✕</button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', marginTop: '80px' }}>
        {/* Tab Content */}
        {activeTab === 'browse' && (
          <div style={styles.browseContainer}>
            {/* Mobile Filter Button */}
            {isMobile && (
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={styles.mobileFilterBtn}
              >
                <FaFilter style={{ marginRight: '8px' }} />
                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            )}

            {/* Left Sidebar - Filters */}
            {(!isMobile || showMobileFilters) && (
              <div style={isMobile ? styles.mobileFilterSidebar : styles.filterSidebar}>
              <h3 style={styles.sidebarTitle}>
                <FaFilter style={{ marginRight: '8px' }} />
                Filters
              </h3>
              
              {/* Category Filter */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterLabel}>Category</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={styles.filterSelect}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterLabel}>
                  <FaSort style={{ marginRight: '8px' }} />
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="featured">Featured</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Organic Only */}
              <div style={styles.filterSection}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <FaLeaf style={{ color: '#28a745', marginLeft: '8px', marginRight: '5px' }} />
                  Organic Only
                </label>
              </div>

              {/* Quick Stats */}
              <div style={styles.statsCard}>
                <h4 style={styles.statsTitle}>Quick Stats</h4>
                <div style={styles.statRow}>
                  <FaStore style={{ color: '#28a745' }} />
                  <span>500+ Farmers</span>
                </div>
                <div style={styles.statRow}>
                  <FaTruck style={{ color: '#007bff' }} />
                  <span>Fast Delivery</span>
                </div>
                <div style={styles.statRow}>
                  <FaShieldAlt style={{ color: '#ffc107' }} />
                  <span>Quality Assured</span>
                </div>
              </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="products-grid" style={{ flex: 1 }}>
              {filteredProducts.map(product => {
                const cartItem = cartItems.find(item => item.id === product.id);
                const isInCart = !!cartItem;
                
                // Calculate market price (30% higher than farmer price for simulated offer)
                const marketPrice = Math.round(product.pricePerKg * 1.3);
                const discountPercent = product.discount || Math.floor(Math.random() * 40) + 20; // Random 20-60% if not set
                
                return (
                  <div 
                    key={product.id} 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {/* Main Card Container - Top Part (White with Rounded Top-Left Corner) */}
                    <div 
                      className="main-card-container"
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '24px 0 0 0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      {/* Discount Badge - Top Right */}
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        zIndex: 10,
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                        letterSpacing: '0.3px'
                      }}>
                        {discountPercent}% Off
                      </div>

                      {/* Image Area - Centered */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px 16px 16px',
                        minHeight: '120px',
                        position: 'relative',
                        backgroundColor: 'transparent'
                      }}>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              maxWidth: '100px',
                              maxHeight: '100px',
                              objectFit: 'contain',
                              display: 'block',
                              margin: '0 auto'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(90deg, #d1d5db 25%, #e5e7eb 50%, #d1d5db 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite'
                          }}></div>
                        )}
                      </div>
                      
                      {/* Info Section - Centered Text */}
                      <div style={{
                        padding: '8px 12px 12px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {/* Crop Name */}
                        <h3 style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0',
                          lineHeight: '1.3',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          letterSpacing: '-0.01em'
                        }}>
                          {product.name}
                        </h3>
                        
                        {/* Quantity/Weight */}
                        <div style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          fontWeight: '400',
                          letterSpacing: '0.02em'
                        }}>
                          {product.unit}
                        </div>
                        
                        {/* Price Section - Simulated Offer */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          marginTop: '4px',
                          padding: '4px 0'
                        }}>
                          {/* Fake Market Price (Strikethrough) */}
                          <span style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            textDecoration: 'line-through',
                            fontWeight: '400'
                          }}>
                            ₹{marketPrice}
                          </span>
                          
                          {/* Actual Farmer Price (Bold Black) */}
                          <span style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#111827',
                            letterSpacing: '-0.02em'
                          }}>
                            ₹{product.pricePerKg}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Add Button - Bottom Part (Gradient Green with Rounded Bottom-Right Corner) */}
                    {!isInCart ? (
                      <button 
                        onClick={() => addToCart(product)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          borderRadius: '0 0 20px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 -1px 6px rgba(16, 185, 129, 0.15)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 -4px 16px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 -2px 12px rgba(16, 185, 129, 0.2)';
                        }}
                      >
                        Add
                      </button>
                    ) : (
                      <div style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '0 0 20px 0',
                        boxShadow: '0 -1px 6px rgba(16, 185, 129, 0.15)'
                      }}>
                        <button 
                          onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid white',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '700',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                          <FaMinus />
                        </button>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '700'
                        }}>
                          {cartItem.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid white',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '700',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
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
                
                {/* Enhanced Cart Summary with Breakdown */}
                <div style={styles.cartSummary}>
                  <div style={styles.billBreakdown}>
                    <div style={styles.billRow}>
                      <span style={styles.billLabel}>Subtotal ({getTotalCartItems()} items)</span>
                      <span style={styles.billValue}>₹{getCartSubtotal().toFixed(2)}</span>
                    </div>
                    <div style={styles.billRow}>
                      <span style={styles.billLabel}>Delivery Charges</span>
                      <span style={styles.billValue}>
                        {getDeliveryCharge() === 0 ? (
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>FREE</span>
                        ) : (
                          `₹${getDeliveryCharge()}`
                        )}
                      </span>
                    </div>
                    {getCartTotal() < 500 && (
                      <div style={styles.freeDeliveryNote}>
                        <FaTruck style={{ marginRight: '5px', color: '#28a745' }} />
                        Add ₹{(500 - getCartTotal()).toFixed(2)} more for FREE delivery!
                      </div>
                    )}
                    <div style={styles.billDivider}></div>
                    <div style={{...styles.billRow, ...styles.grandTotalRow}}>
                      <span style={styles.billLabel}>Grand Total</span>
                      <span style={styles.billValue}>₹{getGrandTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <button style={styles.checkoutButton}>
                    <FaShoppingBag style={{ marginRight: '8px' }} />
                    Proceed to Checkout (₹{getGrandTotal().toFixed(2)})
                  </button>
                  <button 
                    onClick={clearCart}
                    style={styles.clearCartButton}
                  >
                    Clear Cart
                  </button>
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

        {activeTab === 'profile' && (
          <div style={styles.profileSection}>
            <h2 style={styles.sectionTitle}>My Profile</h2>
            <div style={styles.profileCard}>
              <div style={styles.profileAvatar}>
                <FaUserCircle size={100} color="#28a745" />
              </div>
              <div style={styles.profileInfo}>
                <h3>{userProfile.name}</h3>
                <p><FaLocationArrow style={{ marginRight: '8px' }} />{userProfile.location}</p>
              </div>
              <div style={styles.profileStatsGrid}>
                <div style={styles.statBox}>
                  <FaShoppingBag size={30} color="#28a745" />
                  <h4>{userProfile.orders}</h4>
                  <p>Total Orders</p>
                </div>
                <div style={styles.statBox}>
                  <FaRupeeSign size={30} color="#ffc107" />
                  <h4>₹{userProfile.savings}</h4>
                  <p>Total Savings</p>
                </div>
                <div style={styles.statBox}>
                  <FaHeart size={30} color="#e74c3c" />
                  <h4>{favorites.length}</h4>
                  <p>Favorites</p>
                </div>
                <div style={styles.statBox}>
                  <FaMedal size={30} color="#007bff" />
                  <h4>Gold</h4>
                  <p>Member Status</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles object
const styles = {
  browseContainer: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
    marginLeft: '235px',
    marginRight: '20px',
    maxWidth: 'calc(100vw - 255px)',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      marginLeft: '0',
      marginRight: '0',
      maxWidth: '100%'
    }
  },
  filterSidebar: {
    width: '200px',
    flexShrink: 0,
    backgroundColor: '#d4f4dd',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'fixed',
    top: '90px',
    left: '20px',
    height: 'calc(100vh - 110px)',
    overflowY: 'auto',
    zIndex: 1000
  },
  mobileFilterSidebar: {
    width: '100%',
    backgroundColor: '#d4f4dd',
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  mobileFilterBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center'
  },
  filterGroup: {
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
  },
  filterLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  filterSelect: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '12px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '10px',
    padding: '10px',
    marginTop: '12px',
    border: '1px solid rgba(0, 0, 0, 0.06)'
  },
  statsTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 0',
    fontSize: '11px',
    color: '#666'
  },
  navMenuBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px 20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    zIndex: 999,
    flexWrap: 'wrap',
    transition: 'transform 0.3s ease, opacity 0.3s ease'
  },
  searchModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '100px'
  },
  searchModalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
  },
  searchModalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  searchModalInput: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  closeSearchBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '5px 10px'
  },
  navMenuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '25px',
    background: '#f8f9fa',
    color: '#333',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  activeNavItem: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
  },
  cartBadge: {
    marginLeft: '5px',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  billBreakdown: {
    marginBottom: '20px'
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    fontSize: '16px'
  },
  billLabel: {
    color: '#666',
    fontWeight: '500'
  },
  billValue: {
    color: '#333',
    fontWeight: '600'
  },
  grandTotalRow: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  billDivider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #28a745, transparent)',
    margin: '15px 0'
  },
  freeDeliveryNote: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    marginTop: '10px',
    fontSize: '14px',
    color: '#2e7d32',
    fontWeight: '500'
  },
  clearCartButton: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e74c3c',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.3s ease'
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  profileCard: {
    textAlign: 'center'
  },
  profileAvatar: {
    marginBottom: '20px'
  },
  profileInfo: {
    marginBottom: '30px'
  },
  profileStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginTop: '30px'
  },
  statBox: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
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