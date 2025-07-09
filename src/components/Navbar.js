import { useNavigate } from 'react-router-dom'

const Navbar = ({ showEcommerce = false, showCart = false, showOrders = false }) => {
  const navigate = useNavigate()

  return (
    <nav style={navbar}>
      <div style={left}>
        <div style={projectName}>FARM 2 HOME</div>
      </div>

      <div style={center}>
        {showOrders && (
          <div style={navLink} onClick={() => navigate('/orders')}>📦 My Orders</div>
        )}
        {showCart && (
          <div style={navLink} onClick={() => navigate('/cart')}>🛒 My Cart</div>
        )}
        {showEcommerce && (
          <div style={navLink} onClick={() => navigate('/ecommerce')}>🧺 E-Commerce</div>
        )}
      </div>

      <div style={right}></div> {/* Reserved for future use if needed */}
    </nav>
  )
}

const navbar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#111',
  padding: '16px 24px',
  color: 'white',
  fontSize: '20px',
  borderBottom: '1px solid #333',
  position: 'fixed',
  width: '100%',
  top: 0,
  zIndex: 999
}

const left = {
  flex: 1
}

const center = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  flex: 2
}

const right = {
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
}

const projectName = {
  fontWeight: 'bold',
  letterSpacing: '1px',
  fontSize: '22px',
  cursor: 'pointer'
}

const navLink = {
  fontSize: '16px',
  backgroundColor: '#007bff',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'white',
  whiteSpace: 'nowrap'
}

export default Navbar
