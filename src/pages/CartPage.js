import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, push, set, db } from '../firebase'
import Navbar from '../components/Navbar'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(savedCart)
  }, [])

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
  }

  const placeOrder = async () => {
    const otp = generateOTP()
    const orderData = {
      items: cartItems,
      timestamp: Date.now(),
      otp
    }

    try {
      const orderRef = push(ref(db, 'orders'))
      await set(orderRef, orderData)
      console.log(`Order placed successfully! OTP for delivery: ${otp}`)
      localStorage.removeItem('cart')
      navigate('/consumer')
    } catch (error) {
      console.error('Failed to place order:', error)
    }
  }

  return (
    <div style={container}>
      <Navbar showCart={true} showOrders={true} />
      <h2 style={heading}>🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p style={emptyText}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={itemList}>
            {cartItems.map((item, index) => (
              <li key={index} style={itemStyle}>
                <strong>{item.crop}</strong> – {item.quantity} – ₹{item.price}
              </li>
            ))}
          </ul>
          <div style={centerBox}>
            <button onClick={placeOrder} style={btn}>Place Order</button>
          </div>
        </>
      )}
    </div>
  )
}

// ✅ Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f9f9f9',
  minHeight: '100vh',
  padding: '24px'
}

const heading = {
  textAlign: 'center',
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '30px'
}

const emptyText = {
  textAlign: 'center',
  fontSize: '18px',
  marginTop: '40px',
  color: '#666'
}

const itemList = {
  listStyle: 'none',
  padding: 0,
  maxWidth: '600px',
  margin: '0 auto 30px auto'
}

const itemStyle = {
  padding: '14px',
  marginBottom: '12px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  fontSize: '18px'
}

const centerBox = {
  textAlign: 'center'
}

const btn = {
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '12px 28px',
  fontSize: '16px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background 0.3s'
}

export default CartPage
