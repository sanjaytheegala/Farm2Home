import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './Navbar.css'

const Navbar = ({ showEcommerce = false, showCart = false, showOrders = false }) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Left - Project Name and Logo */}
        <div className="navbar-left" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="navbar-project-name">Farm 2 Home</span>
        </div>
        {/* Center - Navigation Links */}
        <div className="navbar-center">
          {showOrders && (
            <div className="nav-item" onClick={() => navigate('/orders')}>📦 {t('orders')}</div>
          )}
          {showCart && (
            <div className="nav-item" onClick={() => navigate('/cart')}>🛒 {t('cart')}</div>
          )}
          {showEcommerce && (
            <div className="nav-item" onClick={() => navigate('/ecommerce')}>🧺 {t('ecommerce')}</div>
          )}
        </div>
        {/* Right - About Us / Extra Buttons */}
        <div className="navbar-right">
          <button className="nav-button" onClick={() => navigate('/about')}>
            {t('about')}
          </button>
          <select onChange={e => changeLanguage(e.target.value)} value={i18n.language} style={{ marginLeft: 12 }}>
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Navbar
