import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './Navbar.css'
import {  FaBoxOpen, FaShoppingCart, FaStore, FaInfoCircle, FaGlobe, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Navbar = ({ showEcommerce = false, showCart = false, showOrders = false }) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      // Change color when scrolled more than 20px
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <span className="navbar-project-name" onClick={() => navigate('/')}>
            FARM
            <img src={require('../logo/logo3.png')} alt="Farm 2 Home Logo" style={{ height: 52, verticalAlign: 'middle' }} />
            HOME
          </span>
        </div>
        
        {/* Center - Navigation Links */}
        <div className="navbar-center" style={{ display: 'flex', justifyContent: 'center' }}>
          {showOrders && (
            <div className="nav-item" onClick={() => navigate('/orders')}>
              <FaBoxOpen style={{ marginRight: 4 }} /> {t('orders')}
            </div>
          )}
          {showCart && (
            <div className="nav-item" onClick={() => navigate('/cart')}>
              <FaShoppingCart style={{ marginRight: 4 }} /> {t('cart')}
            </div>
          )}
          {showEcommerce && (
            <div className="nav-item" onClick={() => navigate('/ecommerce')}>
              <FaStore style={{ marginRight: 4 }} /> {t('ecommerce')}
            </div>
          )}
        </div>
        
        {/* Right - About Us / Extra Buttons */}
        <div className="navbar-right">
          <button 
            className="nav-button" 
            onClick={() => navigate('/about')} 
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            title="About Us"
          >
            <FaInfoCircle /> {t('about')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
            <FaGlobe style={{ marginRight: 4 }} />
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
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
              <option value="ml">മലയാളം</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
