import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './Navbar.css'
// Removed unused icons: FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog, FaStore, FaHome, FaLeaf, FaSearch, FaArrowLeft, FaArrowRight
import { FaShoppingCart, FaInfoCircle, FaBoxOpen, /* FaStore, */ FaBell, FaChevronLeft, FaChevronRight, FaTools, FaLeaf, FaBars, FaTimes } from 'react-icons/fa'

// Pass cartCount and notificationCount as props
const Navbar = React.memo(({ showCart = false, showOrders = false, cartCount = 0, notifications = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  // Removed unused search-related state variables
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { t, i18n } = useTranslation();

  // Check if we're on farmer dashboard
  const isFarmerDashboard = location.pathname === '/farmer'

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Optimized navigation handlers
  const handleOrdersClick = useCallback(() => navigate('/orders'), [navigate])
  const handleCartClick = useCallback(() => navigate('/cart'), [navigate])
  const handleResourceShareClick = useCallback(() => navigate('/resource-share'), [navigate])
  // Removed ecommerce handler
  const handleAboutClick = useCallback(() => navigate('/about'), [navigate])
  const handleHomeClick = useCallback(() => navigate('/'), [navigate])
  const handleBackClick = useCallback((e) => {
    e.stopPropagation();
    navigate(-1);
  }, [navigate]);

  const handleForwardClick = useCallback((e) => {
    e.stopPropagation();
    navigate(1);
  }, [navigate]);

  const handleCropRecommendations = useCallback(() => {
    window.open('/crop-recommendations', '_blank');
  }, []);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Left - Logo and Brand */}
        <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={handleHomeClick}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button className="nav-button nav-backward" title="Go Back" onClick={handleBackClick}>
              <FaChevronLeft size={14} />
            </button>
            <button className="nav-button nav-forward" title="Go Forward" onClick={handleForwardClick}>
              <FaChevronRight size={14} />
            </button>
          </div>
          <span className="navbar-project-name">
            FARM
            <img src={require('../logo/logo3.png')} alt="Farm 2 Home Logo" style={{ height: 52, verticalAlign: 'middle' }} />
            HOME
          </span>
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-center">
          {/* Removed ecommerce button */}

          {/* Crop Recommendations - Only show on farmer dashboard */}
          {isFarmerDashboard && (
            <button className="nav-item" onClick={handleCropRecommendations}>
              <FaLeaf className="nav-icon" />
              <span className="nav-text">Crop Recommendations</span>
            </button>
          )}

          {/* Resource Share - Only show on farmer dashboard */}
          {isFarmerDashboard && (
            <button className="nav-item" onClick={handleResourceShareClick}>
              <FaTools className="nav-icon" />
              <span className="nav-text">Resource Share</span>
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
            className="about-btn" 
            onClick={handleAboutClick} 
            title="About Us"
          >
            <FaInfoCircle />
            <span className="nav-text">{t('about')}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            title="Menu"
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          {isFarmerDashboard && (
            <button className="mobile-menu-item" onClick={() => { handleCropRecommendations(); setShowMobileMenu(false); }}>
              <FaLeaf className="nav-icon" />
              <span>Crop Recommendations</span>
            </button>
          )}
          {isFarmerDashboard && (
            <button className="mobile-menu-item" onClick={() => { handleResourceShareClick(); setShowMobileMenu(false); }}>
              <FaTools className="nav-icon" />
              <span>Resource Share</span>
            </button>
          )}
          {showOrders && (
            <button className="mobile-menu-item" onClick={() => { handleOrdersClick(); setShowMobileMenu(false); }}>
              <FaBoxOpen className="nav-icon" />
              <span>{t('orders')}</span>
            </button>
          )}
          {showCart && (
            <button className="mobile-menu-item" onClick={() => { handleCartClick(); setShowMobileMenu(false); }}>
              <FaShoppingCart className="nav-icon" />
              <span>{t('cart')}</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      )}
    </div>
  )
})

export default Navbar
