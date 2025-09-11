import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './Navbar.css'
// Removed unused icons: FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog
import { FaHome, FaShoppingCart, FaLeaf, FaSearch, FaInfoCircle, FaBoxOpen, FaStore, FaBell } from 'react-icons/fa'

// Pass cartCount and notificationCount as props
const Navbar = React.memo(({ showEcommerce = false, showCart = false, showOrders = false, cartCount = 0, notifications = [] }) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const { t, i18n } = useTranslation();

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Optimized navigation handlers
  const handleHomeClick = useCallback(() => navigate('/'), [navigate])
  const handleOrdersClick = useCallback(() => navigate('/orders'), [navigate])
  const handleCartClick = useCallback(() => navigate('/cart'), [navigate])
  const handleEcommerceClick = useCallback(() => navigate('/ecommerce'), [navigate])
  const handleAboutClick = useCallback(() => navigate('/about'), [navigate])


  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to ecommerce with search query
      navigate(`/ecommerce?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }, [searchQuery, navigate])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev) // Use functional update for state based on previous state
    if (isSearchOpen) {
      setSearchQuery('')
    }
  }, [isSearchOpen])

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        
        {/* Left - Logo and Brand */}
       <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span className="navbar-project-name" onClick={handleHomeClick}>
            FARM
            <img src={require('../logo/logo3.png')} alt="Farm 2 Home Logo" style={{ height: 52, verticalAlign: 'middle' }} />
            HOME
          </span>
        </div>
        
        {/* Center - Navigation Links */}
        <div className="navbar-center">
          <button className="nav-item" onClick={handleHomeClick}>
            <FaHome className="nav-icon" />
            <span className="nav-text">{t('home')}</span>
          </button>
          
          {showEcommerce && (
            <button className="nav-item" onClick={handleEcommerceClick}>
              <FaStore className="nav-icon" />
              <span className="nav-text">{t('ecommerce')}</span>
            </button>
          )}
          

          
          {showOrders && (
            <button className="nav-item" onClick={handleOrdersClick}>
              <FaBoxOpen className="nav-icon" />
              <span className="nav-text">{t('orders')}</span>
            </button>
          )}
          
          {showCart && (
            <button className="nav-item cart-item" onClick={handleCartClick}>
              <FaShoppingCart className="nav-icon" />
              <span className="nav-text">{t('cart')}</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
        
        {/* Right - Search, Notifications, Language, About */}
        <div className="navbar-right">
          {/* Search removed from homepage */}

          {/* Notifications */}
          <div className="notification-container">
            <button 
              className="nav-button notification-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <FaBell />
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div className="notification-item" key={index}>
                      {/* Assuming notif object has icon, text, and time */}
                      <span className="notification-icon">{notif.icon}</span>
                      <div className="notification-content">
                        <p>{notif.text}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-item">
                    <p>No new notifications.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="language-container">
            <select
              onChange={e => changeLanguage(e.target.value)}
              value={i18n.language}
              className="language-select"
              title="Change Language"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="te">🇮🇳 తెలుగు</option>
              <option value="ta">🇮🇳 தமிழ்</option>
              <option value="ml">🇮🇳 മലയാളം</option>
              <option value="mr">🇮🇳 मराठी</option>
              <option value="kn">🇮🇳 ಕನ್ನಡ</option>
            </select>
          </div>

          {/* About Button */}
          <button 
            className="nav-button about-btn" 
            onClick={handleAboutClick} 
            title="About Us"
          >
            <FaInfoCircle />
            <span className="nav-text">{t('about')}</span>
          </button>
        </div>
      </div>
    </div>
  )
})

export default Navbar
