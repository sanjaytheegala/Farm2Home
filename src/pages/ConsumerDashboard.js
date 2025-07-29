import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next';
import { FaSearch, FaFilter, FaShoppingCart, FaHeart, FaStar, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa'

const ConsumerDashboard = () => {
  const dryFruits = [
    { crop: 'Badam', quantity: '20kg', price: 8000, image: '/images/badam.jpg', rating: 4.5, reviews: 12, farmer: 'Rajesh Kumar', location: 'Hyderabad' },
    { crop: 'Cashews', quantity: '20kg', price: 9000, image: '/images/cashews.jpg', rating: 4.3, reviews: 8, farmer: 'Suresh Patel', location: 'Mumbai' },
    { crop: 'Pista', quantity: '20kg', price: 8500, image: '/images/pista.jpg', rating: 4.7, reviews: 15, farmer: 'Amit Singh', location: 'Delhi' },
    { crop: 'Walnut', quantity: '20kg', price: 9500, image: '/images/waltnuts.jpg', rating: 4.2, reviews: 6, farmer: 'Kumar Reddy', location: 'Bangalore' },
    { crop: 'Peanut', quantity: '50kg', price: 1200, image: '/images/peanut.jpg', rating: 4.0, reviews: 20, farmer: 'Lakshmi Devi', location: 'Chennai' }
  ];

  const [showDryFruits, setShowDryFruits] = useState(false);

  const fruits = [
    { crop: 'Apple', quantity: '40kg', price: 2500, image: '/images/apple.jpg', rating: 4.6, reviews: 25, farmer: 'Fruit Farm Co.', location: 'Shimla' },
    { crop: 'Banana', quantity: '100kg', price: 900, image: '/images/banana.jpg', rating: 4.1, reviews: 30, farmer: 'Organic Bananas', location: 'Kerala' },
    { crop: 'Mango', quantity: '30kg', price: 2000, image: '/images/Mango.jpg', rating: 4.8, reviews: 18, farmer: 'Mango Paradise', location: 'Maharashtra' },
    { crop: 'Grapes', quantity: '50kg', price: 1800, image: '/images/grapes.jpg', rating: 4.4, reviews: 12, farmer: 'Vineyard Fresh', location: 'Nashik' },
    { crop: 'Papaya', quantity: '40kg', price: 1200, image: '/images/papaya.jpg', rating: 4.0, reviews: 8, farmer: 'Tropical Fruits', location: 'Karnataka' },
    { crop: 'Avocado', quantity: '20kg', price: 3000, image: '/images/avacado.jpg', rating: 4.9, reviews: 5, farmer: 'Premium Fruits', location: 'Himachal' },
    { crop: 'Sapota', quantity: '35kg', price: 1100, image: '/images/sapota.jpg', rating: 4.2, reviews: 10, farmer: 'Sweet Fruits', location: 'Tamil Nadu' },
    { crop: 'Guava', quantity: '50kg', price: 900, image: '/images/guva.jpg', rating: 4.3, reviews: 15, farmer: 'Guava Garden', location: 'Uttar Pradesh' },
    { crop: 'Cherries', quantity: '25kg', price: 3500, image: '/images/cherries.jpg', rating: 4.7, reviews: 7, farmer: 'Cherry Blossom', location: 'Jammu' },
    { crop: 'Custard Apple', quantity: '30kg', price: 2000, image: '/images/custard apple.jpg', rating: 4.1, reviews: 9, farmer: 'Custard Farm', location: 'Madhya Pradesh' },
    { crop: 'Pomegranate', quantity: '40kg', price: 2200, image: '/images/Pomegranate.jpg', rating: 4.5, reviews: 14, farmer: 'Pomegranate Plus', location: 'Maharashtra' },
    { crop: 'Dragon Fruit', quantity: '20kg', price: 4000, image: '/images/dragon fruit.jpg', rating: 4.8, reviews: 3, farmer: 'Exotic Fruits', location: 'Goa' },
    { crop: 'Strawberry', quantity: '30kg', price: 3200, image: '/images/strawberry.jpg', rating: 4.6, reviews: 11, farmer: 'Berry Farm', location: 'Punjab' },
    { crop: 'Pineapple', quantity: '25kg', price: 1800, image: '/images/pine apple.jpg', rating: 4.2, reviews: 13, farmer: 'Pineapple Paradise', location: 'Kerala' },
    { crop: 'Orange', quantity: '60kg', price: 1500, image: '/images/orange.jpg', rating: 4.4, reviews: 22, farmer: 'Citrus Farm', location: 'Nagpur' },
    { crop: 'Kiwi', quantity: '15kg', price: 5000, image: '/images/kiwi.jpg', rating: 4.9, reviews: 4, farmer: 'Kiwi Kingdom', location: 'Himachal' }
  ];

  const [showFruits, setShowFruits] = useState(false);

  const vegetables = [
    { crop: 'Wheat', quantity: '100kg', price: 1200, image: '/images/wheat.jpg', rating: 4.3, reviews: 16, farmer: 'Wheat Farm', location: 'Punjab' },
    { crop: 'Rice', quantity: '80kg', price: 1000, image: '/images/rice.jpg', rating: 4.1, reviews: 19, farmer: 'Rice Bowl', location: 'West Bengal' },
    { crop: 'Tomato', quantity: '50kg', price: 500, image: '/images/tomato.jpg', rating: 4.4, reviews: 28, farmer: 'Tomato Garden', location: 'Maharashtra' },
    { crop: 'Onion', quantity: '60kg', price: 700, image: '/images/onion.jpg', rating: 4.0, reviews: 25, farmer: 'Onion Farm', location: 'Maharashtra' },
    { crop: 'Potato', quantity: '90kg', price: 800, image: '/images/potato.jpg', rating: 4.2, reviews: 20, farmer: 'Potato Plus', location: 'Uttar Pradesh' },
    { crop: 'Maize', quantity: '120kg', price: 1100, image: '/images/maize.jpg', rating: 4.1, reviews: 12, farmer: 'Maize Farm', location: 'Karnataka' },
    { crop: 'Cabbage', quantity: '70kg', price: 600, image: '/images/cabbage.jpg', rating: 4.3, reviews: 15, farmer: 'Cabbage Garden', location: 'Himachal' },
    { crop: 'Carrot', quantity: '80kg', price: 750, image: '/images/carrot.jpg', rating: 4.5, reviews: 18, farmer: 'Carrot Farm', location: 'Haryana' },
    { crop: 'Brinjal', quantity: '60kg', price: 700, image: '/images/brinjal.jpg', rating: 4.2, reviews: 14, farmer: 'Brinjal Garden', location: 'Tamil Nadu' }
  ];

  const [showVegetables, setShowVegetables] = useState(false);

  const [items, setItems] = useState([
    { crop: 'Fruits', quantity: '', price: '', image: '/images/fruits.jpg', isFruits: true, description: 'Fresh and organic fruits from local farmers' },
    { crop: 'Dry Fruits', quantity: '', price: '', image: '/images/dry fruits.jpg', isDryFruits: true, description: 'Premium quality dry fruits and nuts' },
    { crop: 'Vegetables', quantity: '', price: '', image: '/images/vegetables.jpg', isVegetables: true, description: 'Fresh vegetables and grains' }
  ])

  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('none')
  const [priceRange, setPriceRange] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCart, setShowCart] = useState(false)
  const { t } = useTranslation();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.crop === item.crop && cartItem.farmer === item.farmer)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.crop === item.crop && cartItem.farmer === item.farmer
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const handleRemoveFromCart = (itemToRemove) => {
    setCart(cart.filter(item => 
      !(item.crop === itemToRemove.crop && item.farmer === itemToRemove.farmer)
    ))
  }

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(item)
    } else {
      setCart(cart.map(cartItem => 
        cartItem.crop === item.crop && cartItem.farmer === item.farmer
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ))
    }
  }

  const toggleWishlist = (item) => {
    const isInWishlist = wishlist.find(wishItem => 
      wishItem.crop === item.crop && wishItem.farmer === item.farmer
    )
    if (isInWishlist) {
      setWishlist(wishlist.filter(wishItem => 
        !(wishItem.crop === item.crop && wishItem.farmer === item.farmer)
      ))
    } else {
      setWishlist([...wishlist, item])
    }
  }

  const getFilteredProducts = (productList) => {
    return productList
      .filter(item => {
        const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.farmer.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPrice = priceRange === 'all' || 
                           (priceRange === 'low' && item.price <= 1000) ||
                           (priceRange === 'medium' && item.price > 1000 && item.price <= 3000) ||
                           (priceRange === 'high' && item.price > 3000)
        return matchesSearch && matchesPrice
      })
      .sort((a, b) => {
        if (sortType === 'low') return a.price - b.price
        if (sortType === 'high') return b.price - a.price
        if (sortType === 'rating') return b.rating - a.rating
        return 0
      })
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <div style={container}>
      <Navbar showCart={true} showOrders={true} />
      
      {/* Enhanced Header */}
      <div style={header}>
        <h1 style={headerTitle}>{t('consumer_dashboard') || 'Fresh Produce Market'}</h1>
        <p style={headerSubtitle}>Connect directly with farmers for fresh, quality produce</p>
      </div>

      {/* Enhanced Filter Bar */}
      <div style={filterBar}>
        <div style={searchSection}>
          <FaSearch style={searchIcon} />
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

        <div style={cartButton} onClick={() => setShowCart(!showCart)}>
          <FaShoppingCart style={{ marginRight: '8px' }} />
          Cart ({cart.length})
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
                  <img src={item.image} alt={item.crop} style={cartItemImage} />
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
              <img src={item.image} alt={item.crop} style={categoryImage} />
              <div style={categoryContent}>
                <h3 style={categoryTitle}>{item.crop}</h3>
                <p style={categoryDescription}>{item.description}</p>
                <button 
                  onClick={() => {
                    if (item.isFruits) setShowFruits(!showFruits)
                    else if (item.isDryFruits) setShowDryFruits(!showDryFruits)
                    else if (item.isVegetables) setShowVegetables(!showVegetables)
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
            {getFilteredProducts(fruits).map((item, idx) => (
              <div key={idx} style={productCard}>
                <div style={productImageContainer}>
                  <img src={item.image} alt={item.crop} style={productImage} />
                  <button 
                    onClick={() => toggleWishlist(item)} 
                    style={wishlistButton(wishlist.find(wishItem => 
                      wishItem.crop === item.crop && wishItem.farmer === item.farmer
                    ))}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div style={productInfo}>
                  <h3 style={productTitle}>{item.crop}</h3>
                  <div style={ratingContainer}>
                    <FaStar style={starIcon} />
                    <span>{item.rating}</span>
                    <span style={reviewsText}>({item.reviews} reviews)</span>
                  </div>
                  <p style={farmerInfo}>
                    <FaMapMarkerAlt style={{ marginRight: '4px' }} />
                    {item.farmer}, {item.location}
                  </p>
                  <p style={quantityInfo}>Quantity: {item.quantity}</p>
                  <p style={priceInfo}>₹{item.price.toLocaleString()}</p>
                  <div style={productActions}>
                    <button onClick={() => handleAddToCart(item)} style={addToCartButton}>
                      <FaShoppingCart style={{ marginRight: '4px' }} />
                      Add to Cart
                    </button>
                    <button style={contactButton}>
                      <FaWhatsapp style={{ marginRight: '4px' }} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
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
            {getFilteredProducts(dryFruits).map((item, idx) => (
              <div key={idx} style={productCard}>
                <div style={productImageContainer}>
                  <img src={item.image} alt={item.crop} style={productImage} />
                  <button 
                    onClick={() => toggleWishlist(item)} 
                    style={wishlistButton(wishlist.find(wishItem => 
                      wishItem.crop === item.crop && wishItem.farmer === item.farmer
                    ))}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div style={productInfo}>
                  <h3 style={productTitle}>{item.crop}</h3>
                  <div style={ratingContainer}>
                    <FaStar style={starIcon} />
                    <span>{item.rating}</span>
                    <span style={reviewsText}>({item.reviews} reviews)</span>
                  </div>
                  <p style={farmerInfo}>
                    <FaMapMarkerAlt style={{ marginRight: '4px' }} />
                    {item.farmer}, {item.location}
                  </p>
                  <p style={quantityInfo}>Quantity: {item.quantity}</p>
                  <p style={priceInfo}>₹{item.price.toLocaleString()}</p>
                  <div style={productActions}>
                    <button onClick={() => handleAddToCart(item)} style={addToCartButton}>
                      <FaShoppingCart style={{ marginRight: '4px' }} />
                      Add to Cart
                    </button>
                    <button style={contactButton}>
                      <FaWhatsapp style={{ marginRight: '4px' }} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
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
            {getFilteredProducts(vegetables).map((item, idx) => (
              <div key={idx} style={productCard}>
                <div style={productImageContainer}>
                  <img src={item.image} alt={item.crop} style={productImage} />
                  <button 
                    onClick={() => toggleWishlist(item)} 
                    style={wishlistButton(wishlist.find(wishItem => 
                      wishItem.crop === item.crop && wishItem.farmer === item.farmer
                    ))}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div style={productInfo}>
                  <h3 style={productTitle}>{item.crop}</h3>
                  <div style={ratingContainer}>
                    <FaStar style={starIcon} />
                    <span>{item.rating}</span>
                    <span style={reviewsText}>({item.reviews} reviews)</span>
                  </div>
                  <p style={farmerInfo}>
                    <FaMapMarkerAlt style={{ marginRight: '4px' }} />
                    {item.farmer}, {item.location}
                  </p>
                  <p style={quantityInfo}>Quantity: {item.quantity}</p>
                  <p style={priceInfo}>₹{item.price.toLocaleString()}</p>
                  <div style={productActions}>
                    <button onClick={() => handleAddToCart(item)} style={addToCartButton}>
                      <FaShoppingCart style={{ marginRight: '4px' }} />
                      Add to Cart
                    </button>
                    <button style={contactButton}>
                      <FaWhatsapp style={{ marginRight: '4px' }} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh'
}

const header = {
  textAlign: 'center',
  padding: '40px 20px',
  backgroundColor: 'white',
  marginBottom: '20px'
}

const headerTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333'
}

const headerSubtitle = {
  fontSize: '1.1rem',
  color: '#666',
  margin: 0
}

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
}

const searchSection = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  maxWidth: '400px'
}

const searchIcon = {
  position: 'absolute',
  left: '12px',
  color: '#666',
  fontSize: '16px'
}

const searchInput = {
  padding: '12px 12px 12px 40px',
  fontSize: '16px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outline: 'none'
}

const filterControls = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
}

const filterSelect = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  backgroundColor: 'white'
}

const cartButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s'
}

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
}

const cartHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #eee'
}

const closeButton = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#666'
}

const emptyCart = {
  textAlign: 'center',
  padding: '40px',
  color: '#666'
}

const cartItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '15px',
  borderBottom: '1px solid #eee',
  position: 'relative'
}

const cartItemImage = {
  width: '60px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: '15px'
}

const cartItemDetails = {
  flex: 1
}

const farmerName = {
  fontSize: '12px',
  color: '#666',
  margin: '2px 0'
}

const quantityControls = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginRight: '10px'
}

const removeButton = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  fontSize: '12px'
}

const cartTotal = {
  padding: '20px',
  borderTop: '1px solid #eee'
}

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
}

const categoriesSection = {
  padding: '20px'
}

const sectionTitle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '30px',
  textAlign: 'center',
  color: '#333'
}

const categoriesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto'
}

const categoryCard = {
  backgroundColor: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s',
  cursor: 'pointer'
}

const categoryImage = {
  width: '100%',
  height: '200px',
  objectFit: 'cover'
}

const categoryContent = {
  padding: '20px'
}

const categoryTitle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333'
}

const categoryDescription = {
  color: '#666',
  marginBottom: '20px',
  lineHeight: '1.5'
}

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
  transition: 'all 0.3s'
}

const productsSection = {
  padding: '20px',
  backgroundColor: 'white',
  margin: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
}

const productsHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
}

const closeSectionButton = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
}

const productsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '25px'
}

const productCard = {
  backgroundColor: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s',
  border: '1px solid #eee'
}

const productImageContainer = {
  position: 'relative'
}

const productImage = {
  width: '100%',
  height: '200px',
  objectFit: 'cover'
}

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
  fontSize: '14px'
})

const productInfo = {
  padding: '20px'
}

const productTitle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#333'
}

const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  marginBottom: '10px'
}

const starIcon = {
  color: '#ffc107',
  fontSize: '14px'
}

const reviewsText = {
  fontSize: '12px',
  color: '#666'
}

const farmerInfo = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center'
}

const quantityInfo = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px'
}

const priceInfo = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#28a745',
  marginBottom: '15px'
}

const productActions = {
  display: 'flex',
  gap: '10px'
}

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
  flex: 1
}

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
  flex: 1
}

export default ConsumerDashboard
