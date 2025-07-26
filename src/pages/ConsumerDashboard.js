import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next';

const ConsumerDashboard = () => {
  const dryFruits = [
    { crop: 'Badam', quantity: '20kg', price: 8000, image: '/images/badam.jpg' },
    { crop: 'Cashews', quantity: '20kg', price: 9000, image: '/images/cashews.jpg' },
    { crop: 'Pista', quantity: '20kg', price: 8500, image: '/images/pista.jpg' },
    { crop: 'Walnut', quantity: '20kg', price: 9500, image: '/images/waltnuts.jpg' },
    { crop: 'Peanut', quantity: '50kg', price: 1200, image: '/images/peanut.jpg' }
  ];

  const [showDryFruits, setShowDryFruits] = useState(false);

  const fruits = [
    { crop: 'Apple', quantity: '40kg', price: 2500, image: '/images/apple.jpg' },
    { crop: 'Banana', quantity: '100kg', price: 900, image: '/images/banana.jpg' },
    { crop: 'Mango', quantity: '30kg', price: 2000, image: '/images/Mango.jpg' },
    { crop: 'Grapes', quantity: '50kg', price: 1800, image: '/images/grapes.jpg' },
    { crop: 'Papaya', quantity: '40kg', price: 1200, image: '/images/papaya.jpg' },
    { crop: 'Avocado', quantity: '20kg', price: 3000, image: '/images/avacado.jpg' },
    { crop: 'Sapota', quantity: '35kg', price: 1100, image: '/images/sapota.jpg' },
    { crop: 'Guava', quantity: '50kg', price: 900, image: '/images/guva.jpg' },
    { crop: 'Cherries', quantity: '25kg', price: 3500, image: '/images/cherries.jpg' },
    { crop: 'Custard Apple', quantity: '30kg', price: 2000, image: '/images/custard apple.jpg' },
    { crop: 'Pomegranate', quantity: '40kg', price: 2200, image: '/images/Pomegranate.jpg' },
    { crop: 'Dragon Fruit', quantity: '20kg', price: 4000, image: '/images/dragon fruit.jpg' },
    { crop: 'Strawberry', quantity: '30kg', price: 3200, image: '/images/strawberry.jpg' },
    { crop: 'Pineapple', quantity: '25kg', price: 1800, image: '/images/pine apple.jpg' },
    { crop: 'Orange', quantity: '60kg', price: 1500, image: '/images/orange.jpg' },
    { crop: 'Kiwi', quantity: '15kg', price: 5000, image: '/images/kiwi.jpg' }
  ];

  const [showFruits, setShowFruits] = useState(false);

  const vegetables = [
    { crop: 'Wheat', quantity: '100kg', price: 1200, image: '/images/wheat.jpg' },
    { crop: 'Rice', quantity: '80kg', price: 1000, image: '/images/rice.jpg' },
    { crop: 'Tomato', quantity: '50kg', price: 500, image: '/images/tomato.jpg' },
    { crop: 'Onion', quantity: '60kg', price: 700, image: '/images/onion.jpg' },
    { crop: 'Potato', quantity: '90kg', price: 800, image: '/images/potato.jpg' },
    { crop: 'Maize', quantity: '120kg', price: 1100, image: '/images/maize.jpg' },
    { crop: 'Cabbage', quantity: '70kg', price: 600, image: '/images/cabbage.jpg' },
    { crop: 'Carrot', quantity: '80kg', price: 750, image: '/images/carrot.jpg' },
    { crop: 'Brinjal', quantity: '60kg', price: 700, image: '/images/brinjal.jpg' }
  ];

  const [showVegetables, setShowVegetables] = useState(false);

  const [items, setItems] = useState([
    { crop: 'Fruits', quantity: '', price: '', image: '/images/fruits.jpg', isFruits: true },
    { crop: 'Dry Fruits', quantity: '', price: '', image: '/images/dry fruits.jpg', isDryFruits: true },
    { crop: 'Vegetables', quantity: '', price: '', image: '/images/vegetables.jpg', isVegetables: true }
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
          item.isFruits ? (
            <div key={idx} style={card} onClick={() => setShowFruits(!showFruits)}>
              <img src={item.image} alt={item.crop} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
              <h3>{item.crop}</h3>
              <p style={{ color: '#888', fontSize: 14 }}>(Click to view all)</p>
            </div>
          ) : item.isDryFruits ? (
            <div key={idx} style={card} onClick={() => setShowDryFruits(!showDryFruits)}>
              <img src={item.image} alt={item.crop} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
              <h3>{item.crop}</h3>
              <p style={{ color: '#888', fontSize: 14 }}>(Click to view all)</p>
            </div>
          ) : item.isVegetables ? (
            <div key={idx} style={card} onClick={() => setShowVegetables(!showVegetables)}>
              <img src={item.image} alt={item.crop} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
              <h3>{item.crop}</h3>
              <p style={{ color: '#888', fontSize: 14 }}>(Click to view all)</p>
            </div>
          ) : null
        ))}
        {showFruits && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: 20 }}>
            {fruits.map((item, idx) => (
              <div key={idx} style={card}>
                <img src={item.image} alt={item.crop} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                <h3>{item.crop}</h3>
                <p>{t('quantity')}: {item.quantity}</p>
                <p>{t('price')}: ₹{item.price}</p>
                <button onClick={() => handleAddToCart(item)} style={btn}>{t('add_to_cart')}</button>
              </div>
            ))}
            <button onClick={() => setShowFruits(false)} style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>Close</button>
          </div>
        )}
        {showDryFruits && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: 20 }}>
            {dryFruits.map((item, idx) => (
              <div key={idx} style={card}>
                <img src={item.image} alt={item.crop} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                <h3>{item.crop}</h3>
                <p>{t('quantity')}: {item.quantity}</p>
                <p>{t('price')}: ₹{item.price}</p>
                <button onClick={() => handleAddToCart(item)} style={btn}>{t('add_to_cart')}</button>
              </div>
            ))}
            <button onClick={() => setShowDryFruits(false)} style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>Close</button>
          </div>
        )}
        {showVegetables && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: 20 }}>
            {vegetables.map((item, idx) => (
              <div key={idx} style={card}>
                <img src={item.image} alt={item.crop} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                <h3>{item.crop}</h3>
                <p>{t('quantity')}: {item.quantity}</p>
                <p>{t('price')}: ₹{item.price}</p>
                <button onClick={() => handleAddToCart(item)} style={btn}>{t('add_to_cart')}</button>
              </div>
            ))}
            <button onClick={() => setShowVegetables(false)} style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>Close</button>
          </div>
        )}
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
  textAlign: 'center',
  cursor: 'pointer' // Added cursor pointer for dry fruits card
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
