import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ showEcommerce = false, showCart = false, showOrders = false }) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Left - Project Name */}
        <div className="navbar-left" onClick={() => navigate('/')}>
          FARM 2 HOME
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-center">
          {showOrders && (
            <div className="nav-item" onClick={() => navigate('/orders')}>📦 My Orders</div>
          )}
          {showCart && (
            <div className="nav-item" onClick={() => navigate('/cart')}>🛒 My Cart</div>
          )}
          {showEcommerce && (
            <div className="nav-item" onClick={() => navigate('/ecommerce')}>🧺 E-Commerce</div>
          )}
        </div>

        {/* Right - About Us / Extra Buttons */}
        <div className="navbar-right">
          <button className="nav-button" onClick={() => navigate('/about')}>
            About Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
