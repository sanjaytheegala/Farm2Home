import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './Navbar.css'
import { FaHome, FaUser, FaShoppingCart, FaSignOutAlt, FaLeaf, FaSearch, FaBars, FaTimes, FaLanguage, FaBoxOpen, FaStore, FaInfoCircle } from 'react-icons/fa'

const Navbar = React.memo(({ showEcommerce = false, showCart = false, showOrders = false }) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
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

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span className="navbar-project-name" onClick={handleHomeClick}>
            FARM
            <img src={require('../logo/logo3.png')} alt="Farm 2 Home Logo" style={{ height: 52, verticalAlign: 'middle' }} />
            HOME
          </span>
        </div>
        
        {/* Center - Navigation Links */}
        <div className="navbar-center" style={{ display: 'flex', justifyContent: 'center' }}>
          {showOrders && (
            <div className="nav-item" onClick={handleOrdersClick}>
              <FaBoxOpen style={{ marginRight: 4 }} /> {t('orders')}
            </div>
          )}
          {showCart && (
            <div className="nav-item" onClick={handleCartClick}>
              <FaShoppingCart style={{ marginRight: 4 }} /> {t('cart')}
            </div>
          )}
          {showEcommerce && (
            <div className="nav-item" onClick={handleEcommerceClick}>
              <FaStore style={{ marginRight: 4 }} /> {t('ecommerce')}
            </div>
          )}
        </div>
        
        {/* Right - About Us / Extra Buttons */}
        <div className="navbar-right">
          <button 
            className="nav-button" 
            onClick={handleAboutClick} 
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            title="About Us"
          >
            <FaInfoCircle /> {t('about')}
          </button>
          <select
            onChange={e => changeLanguage(e.target.value)}
            value={i18n.language}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid transparent',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer'
            }}
            title="Change Language"
          >
            <option value="en">EN</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
            <option value="ml">മലയാളം</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      </div>
    </div>
  )
})

export default Navbar
