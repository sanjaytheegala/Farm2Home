import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next';

const ConsumerDashboard = () => {
  const [items, setItems] = useState([
    { crop: 'Wheat', quantity: '100kg', price: 1200 },
    { crop: 'Rice', quantity: '80kg', price: 1000 },
    { crop: 'Tomato', quantity: '50kg', price: 500 },
    { crop: 'Onion', quantity: '60kg', price: 700 }
  ])

  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('none')
  const { t } = useTranslation();

  const handleAddToCart = (item) => {
    setCart([...cart, item])
  }

  const filteredItems = items
    .filter(item => item.crop.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortType === 'low') return a.price - b.price
      if (sortType === 'high') return b.price - a.price
      return 0
    })

  return (
    <div style={container}>
      <Navbar showCart={true} showOrders={true} />
      <h2 style={heading}>{t('consumer_dashboard')}</h2>

      <div style={filterBar}>
        <input
          type="text"
          placeholder={t('search_crop')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={input}
        />
        <select onChange={(e) => setSortType(e.target.value)} style={select}>
          <option value="none">{t('sort_by_price')}</option>
          <option value="low">{t('low_to_high')}</option>
          <option value="high">{t('high_to_low')}</option>
        </select>
      </div>

      <div style={list}>
        {filteredItems.map((item, idx) => (
          <div key={idx} style={card}>
            <h3>{item.crop}</h3>
            <p>{t('quantity')}: {item.quantity}</p>
            <p>{t('price')}: ₹{item.price}</p>
            <button onClick={() => handleAddToCart(item)} style={btn}>{t('add_to_cart')}</button>
          </div>
        ))}
      </div>

      <button style={buyBtn}>{t('buy_now')}</button>
    </div>
  )
}

// ✅ Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#fafafa',
  minHeight: '100vh',
  padding: '20px'
}

const heading = {
  textAlign: 'center',
  fontSize: '32px',
  fontWeight: 'bold',
  marginBottom: '30px'
}

const filterBar = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '30px'
}

const input = {
  padding: '10px',
  fontSize: '16px',
  width: '200px',
  borderRadius: '5px',
  border: '1px solid #ccc'
}

const select = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc'
}

const list = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center'
}

const card = {
  backgroundColor: '#fff',
  padding: '20px',
  width: '220px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  textAlign: 'center'
}

const btn = {
  marginTop: '10px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
}

const buyBtn = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '14px 28px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer'
}

export default ConsumerDashboard
