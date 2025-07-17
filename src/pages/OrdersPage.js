import React from 'react'
import Navbar from '../components/Navbar'

const OrdersPage = () => {
  const dummyOrders = [
    { id: 1, crop: 'Wheat', quantity: '50kg', price: 600 },
    { id: 2, crop: 'Rice', quantity: '30kg', price: 400 }
  ]

  return (
    <div style={container}>
      <Navbar showCart={true} showOrders={true} />
      <h2 style={heading}>My Orders</h2>
      <div style={orderList}>
        {dummyOrders.map(order => (
          <div key={order.id} style={orderCard}>
            <h3>{order.crop}</h3>
            <p>Quantity: {order.quantity}</p>
            <p>Paid: ₹{order.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const container = {
  paddingTop: '100px',
  backgroundColor: '#f2f2f2',
  minHeight: '100vh',
  padding: '20px'
}

const heading = {
  textAlign: 'center',
  fontSize: '32px',
  fontWeight: 'bold',
  marginBottom: '30px'
}

const orderList = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center'
}

const orderCard = {
  backgroundColor: '#fff',
  padding: '20px',
  width: '220px',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  textAlign: 'center'
}

export default OrdersPage
