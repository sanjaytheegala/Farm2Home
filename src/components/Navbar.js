import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './Navbar.css'
import { FaHome, FaBoxOpen, FaShoppingCart, FaStore, FaInfoCircle, FaGlobe, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
      <div className="navbar-content" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {/* Far Left - Navigation Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginRight: 16 }}>
          <FaArrowLeft style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => window.history.back()} />
          <FaArrowRight style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => window.history.forward()} />
        </div>
        {/* Left - Project Name and Logo */}
        <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <FaHome style={{ fontSize: 24 }} onClick={() => navigate('/')} />
          <span className="navbar-project-name" onClick={() => navigate('/')}>Farm 2 Home</span>
        </div>
        {/* Center - Navigation Links */}
        <div className="navbar-center" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {showOrders && (
            <div className="nav-item" onClick={() => navigate('/orders')}><FaBoxOpen style={{ marginRight: 4 }} /> {t('orders')}</div>
          )}
          {showCart && (
            <div className="nav-item" onClick={() => navigate('/cart')}><FaShoppingCart style={{ marginRight: 4 }} /> {t('cart')}</div>
          )}
          {showEcommerce && (
            <div className="nav-item" onClick={() => navigate('/ecommerce')}><FaStore style={{ marginRight: 4 }} /> {t('ecommerce')}</div>
          )}
        </div>
        {/* Right - About Us / Extra Buttons */}
        <div className="navbar-right">
          <button className="nav-button" onClick={() => navigate('/about')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaInfoCircle /> {t('about')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
            <FaGlobe style={{ marginRight: 4 }} />
            <select onChange={e => changeLanguage(e.target.value)} value={i18n.language} style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #ccc' }}>
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
