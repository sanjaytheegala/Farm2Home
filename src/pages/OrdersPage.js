import React, { useState, useEffect } from 'react'
import { db, collection, getDocs, query, orderBy } from '../firebase'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhone, FaCalendar } from 'react-icons/fa'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const fetchedOrders = []
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() })
      })
      
      setOrders(fetchedOrders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { icon: <FaClock />, color: '#ffc107', text: t('pending') || 'Pending' }
      case 'confirmed':
        return { icon: <FaCheckCircle />, color: '#28a745', text: t('confirmed') || 'Confirmed' }
      case 'shipped':
        return { icon: <FaTruck />, color: '#17a2b8', text: t('shipped') || 'Shipped' }
      case 'delivered':
        return { icon: <FaCheckCircle />, color: '#28a745', text: t('delivered') || 'Delivered' }
      default:
        return { icon: <FaClock />, color: '#999', text: status }
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const OrderCard = ({ order }) => {
    const statusInfo = getStatusInfo(order.status)
    
    return (
      <div style={orderCard} onClick={() => setSelectedOrder(order)}>
        <div style={orderHeader}>
          <div>
            <h3 style={orderId}>{t('order') || 'Order'} #{order.orderId}</h3>
            <p style={orderDate}>
              <FaCalendar /> {formatDate(order.timestamp)} at {formatTime(order.timestamp)}
            </p>
          </div>
          <div style={{...statusBadge, backgroundColor: statusInfo.color + '20', color: statusInfo.color}}>
            {statusInfo.icon} {statusInfo.text}
          </div>
        </div>

        <div style={orderItems}>
          {order.items && order.items.slice(0, 2).map((item, idx) => (
            <div key={idx} style={itemRow}>
              <span>{item.crop} ({item.quantity} kg)</span>
              <span>₹{(parseFloat(item.price) * parseInt(item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          {order.items && order.items.length > 2 && (
            <p style={moreItems}>+{order.items.length - 2} {t('more_items') || 'more items'}</p>
          )}
        </div>

        <div style={orderFooter}>
          <div>
            <strong>{t('total') || 'Total'}: ₹{order.totalAmount?.toFixed(2) || 0}</strong>
          </div>
          <button style={viewDetailsBtn}>
            {t('view_details') || 'View Details'}
          </button>
        </div>
      </div>
    )
  }

  const OrderDetails = ({ order }) => {
    return (
      <div style={detailsModal} onClick={() => setSelectedOrder(null)}>
        <div style={detailsContent} onClick={(e) => e.stopPropagation()}>
          <button style={closeBtn} onClick={() => setSelectedOrder(null)}>×</button>
          
          <h2 style={detailsHeading}>
            {t('order_details') || 'Order Details'}
          </h2>

          <div style={detailsSection}>
            <h3>{t('order_status') || 'Order Status'}</h3>
            <div style={trackingSteps}>
              <div style={trackingStep(true)}>
                <div style={trackingIcon(true)}><FaCheckCircle /></div>
                <div>
                  <p style={trackingLabel}>{t('order_placed') || 'Order Placed'}</p>
                  <p style={trackingTime}>{formatDate(order.timestamp)}</p>
                </div>
              </div>
              
              <div style={trackingLine(order.status !== 'pending')} />
              
              <div style={trackingStep(order.status !== 'pending')}>
                <div style={trackingIcon(order.status !== 'pending')}><FaCheckCircle /></div>
                <div>
                  <p style={trackingLabel}>{t('confirmed') || 'Confirmed'}</p>
                  <p style={trackingTime}>{order.status !== 'pending' ? formatDate(order.timestamp) : '-'}</p>
                </div>
              </div>
              
              <div style={trackingLine(['shipped', 'delivered'].includes(order.status))} />
              
              <div style={trackingStep(['shipped', 'delivered'].includes(order.status))}>
                <div style={trackingIcon(['shipped', 'delivered'].includes(order.status))}><FaTruck /></div>
                <div>
                  <p style={trackingLabel}>{t('shipped') || 'Shipped'}</p>
                  <p style={trackingTime}>{['shipped', 'delivered'].includes(order.status) ? formatDate(order.timestamp) : '-'}</p>
                </div>
              </div>
              
              <div style={trackingLine(order.status === 'delivered')} />
              
              <div style={trackingStep(order.status === 'delivered')}>
                <div style={trackingIcon(order.status === 'delivered')}><FaCheckCircle /></div>
                <div>
                  <p style={trackingLabel}>{t('delivered') || 'Delivered'}</p>
                  <p style={trackingTime}>{order.status === 'delivered' ? formatDate(order.timestamp) : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={detailsSection}>
            <h3>{t('items') || 'Items'} ({order.items?.length || 0})</h3>
            {order.items?.map((item, idx) => (
              <div key={idx} style={detailItem}>
                <div>
                  <p style={itemName}>{item.crop}</p>
                  <p style={itemQty}>{item.quantity} kg × ₹{item.price}</p>
                </div>
                <p style={itemTotal}>₹{(parseFloat(item.price) * parseInt(item.quantity || 1)).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div style={detailsSection}>
            <h3><FaMapMarkerAlt /> {t('delivery_address') || 'Delivery Address'}</h3>
            {order.deliveryAddress && (
              <div style={addressBox}>
                <p><strong>{order.deliveryAddress.fullName}</strong></p>
                <p><FaPhone /> {order.deliveryAddress.phone}</p>
                <p>{order.deliveryAddress.addressLine}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
              </div>
            )}
          </div>

          <div style={detailsSection}>
            <h3>{t('payment_summary') || 'Payment Summary'}</h3>
            <div style={summaryBox}>
              <div style={summaryRow}>
                <span>{t('subtotal') || 'Subtotal'}:</span>
                <span>₹{((order.totalAmount || 0) - (order.deliveryCharge || 0)).toFixed(2)}</span>
              </div>
              <div style={summaryRow}>
                <span>{t('delivery') || 'Delivery Charge'}:</span>
                <span>₹{order.deliveryCharge?.toFixed(2) || 0}</span>
              </div>
              <div style={{...summaryRow, ...summaryTotal}}>
                <strong>{t('total') || 'Total'}:</strong>
                <strong>₹{order.totalAmount?.toFixed(2) || 0}</strong>
              </div>
              <div style={paymentMethodBox}>
                <span>{t('payment_method') || 'Payment Method'}:</span>
                <span style={paymentBadge}>{order.paymentMethod?.toUpperCase() || 'COD'}</span>
              </div>
            </div>
          </div>

          {order.otp && (
            <div style={otpBox}>
              <p><strong>{t('delivery_otp') || 'Delivery OTP'}:</strong> {order.otp}</p>
              <p style={otpNote}>{t('share_otp') || 'Share this OTP with delivery person'}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={container}>
      <Navbar />
      <div style={contentWrapper}>
        <h2 style={heading}>
          <FaBox /> {t('orders') || 'My Orders'}
        </h2>
        
        {loading ? (
          <div style={loadingBox}>
            <p>{t('loading') || 'Loading orders...'}</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={emptyBox}>
            <FaBox size={64} color="#ddd" />
            <p style={emptyText}>{t('no_orders') || 'No orders yet'}</p>
            <p>{t('order_something') || 'Start shopping to see your orders here'}</p>
          </div>
        ) : (
          <div style={orderList}>
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </div>
  )
}

const container = {
  paddingTop: '80px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh'
}

const contentWrapper = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
}

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  marginBottom: '30px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#333'
}

const loadingBox = {
  textAlign: 'center',
  padding: '60px',
  backgroundColor: 'white',
  borderRadius: '12px'
}

const emptyBox = {
  textAlign: 'center',
  padding: '60px',
  backgroundColor: 'white',
  borderRadius: '12px'
}

const emptyText = {
  fontSize: '20px',
  color: '#666',
  margin: '20px 0 8px'
}

const orderList = {
  display: 'grid',
  gap: '20px'
}

const orderCard = {
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
}

const orderHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #eee'
}

const orderId = {
  margin: '0 0 8px 0',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333'
}

const orderDate = {
  margin: 0,
  fontSize: '14px',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
}

const statusBadge = {
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
}

const orderItems = {
  marginBottom: '16px'
}

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  fontSize: '14px'
}

const moreItems = {
  fontSize: '12px',
  color: '#666',
  fontStyle: 'italic',
  margin: '4px 0 0'
}

const orderFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '16px',
  borderTop: '1px solid #eee'
}

const viewDetailsBtn = {
  padding: '8px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
}

const detailsModal = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
  overflowY: 'auto'
}

const detailsContent = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '30px',
  maxWidth: '700px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative'
}

const closeBtn = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'none',
  border: 'none',
  fontSize: '32px',
  cursor: 'pointer',
  color: '#999',
  lineHeight: '1'
}

const detailsHeading = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '24px',
  color: '#333'
}

const detailsSection = {
  marginBottom: '24px',
  paddingBottom: '24px',
  borderBottom: '1px solid #eee'
}

const trackingSteps = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0'
}

const trackingStep = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  opacity: active ? 1 : 0.4
})

const trackingIcon = (active) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: active ? '#28a745' : '#ddd',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px'
})

const trackingLine = (active) => ({
  width: '2px',
  height: '30px',
  backgroundColor: active ? '#28a745' : '#ddd',
  marginLeft: '19px'
})

const trackingLabel = {
  margin: '0 0 4px 0',
  fontSize: '16px',
  fontWeight: 'bold'
}

const trackingTime = {
  margin: 0,
  fontSize: '12px',
  color: '#666'
}

const detailItem = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid #f5f5f5'
}

const itemName = {
  margin: '0 0 4px 0',
  fontSize: '16px',
  fontWeight: 'bold'
}

const itemQty = {
  margin: 0,
  fontSize: '14px',
  color: '#666'
}

const itemTotal = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#28a745'
}

const addressBox = {
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '8px',
  lineHeight: '1.8'
}

const summaryBox = {
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '8px'
}

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0'
}

const summaryTotal = {
  fontSize: '18px',
  paddingTop: '12px',
  marginTop: '8px',
  borderTop: '2px solid #ddd'
}

const paymentMethodBox = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid #eee'
}

const paymentBadge = {
  padding: '4px 12px',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold'
}

const otpBox = {
  backgroundColor: '#fff3cd',
  border: '2px solid #ffc107',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center'
}

const otpNote = {
  margin: '8px 0 0',
  fontSize: '12px',
  color: '#856404'
}

export default OrdersPage
