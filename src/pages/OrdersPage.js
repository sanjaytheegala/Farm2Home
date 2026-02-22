import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import Navbar from '../components/Navbar'
import { logger } from '../utils/logger'
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhone, FaCalendar, FaRupeeSign, FaArrowLeft, FaShoppingBag } from 'react-icons/fa'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        setOrders([])
        setLoading(false)
        return
      }

      const q = query(
        collection(db, 'orders'),
        where('customerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Normalise Firestore Timestamp → JS Date
        createdAtMs: doc.data().createdAt?.toMillis?.() || Date.now(),
      }))
      setOrders(fetchedOrders)
      setLoading(false)
    } catch (error) {
      logger.error('Error fetching orders:', error)
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

  const formatDate = (ms) => {
    if (!ms) return ''
    return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTime = (ms) => {
    if (!ms) return ''
    return new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const OrderCard = ({ order }) => {
    const statusInfo = getStatusInfo(order.status)

    return (
      <div
        style={{ ...orderCard, borderLeft: `5px solid ${statusInfo.color}` }}
        onClick={() => setSelectedOrder(order)}
      >
        <div style={orderHeader}>
          <div>
            <h3 style={orderId}>{t('order') || 'Order'} #{order.id.slice(0, 8).toUpperCase()}</h3>
            <p style={orderDate}>
              <FaCalendar /> {formatDate(order.createdAtMs)} at {formatTime(order.createdAtMs)}
            </p>
          </div>
          <div style={{ ...statusBadge, backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
            {statusInfo.icon} {statusInfo.text}
          </div>
        </div>

        <div style={orderItems}>
          <div style={itemRow}>
            <span>{order.cropName || 'Product'} × {order.quantity} {order.unit || 'kg'}</span>
            <span>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        <div style={orderFooter}>
          <strong>Total: ₹{parseFloat(order.totalPrice || order.totalAmount || 0).toFixed(2)}</strong>
          <button style={viewDetailsBtn}>View Details</button>
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
            Order Details
          </h2>

          {/* 4-Step Tracking Timeline */}
          <div style={detailsSection}>
            <h3 style={{ marginBottom: 20, color: '#333' }}>Order Status</h3>
            <style>{`
              @keyframes pulse-dot {
                0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.5); }
                50% { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
              }
            `}</style>
            <div style={trackingSteps}>

              {/* Step 1 — Pending (always active, always first) */}
              {(() => {
                const isCurrent = order.status === 'pending';
                return (
                  <>
                    <div style={trackingStep(true)}>
                      <div style={{
                        ...trackingIcon(true),
                        backgroundColor: isCurrent ? '#f59e0b' : '#16a34a',
                        animation: isCurrent ? 'pulse-dot 1.6s ease-in-out infinite' : 'none',
                      }}>
                        <FaClock />
                      </div>
                      <div>
                        <p style={trackingLabel}>
                          Pending
                          {isCurrent && (
                            <span style={{ marginLeft: 8, fontSize: 12, color: '#f59e0b', fontWeight: 700, background: '#fef3c7', padding: '2px 8px', borderRadius: 50 }}>
                              Current
                            </span>
                          )}
                        </p>
                        <p style={trackingTime}>{formatDate(order.createdAtMs)} at {formatTime(order.createdAtMs)}</p>
                      </div>
                    </div>
                    <div style={trackingLine(order.status !== 'pending')} />
                  </>
                );
              })()}

              {/* Step 2 — Admin Confirmed */}
              {(() => {
                const isActive = ['confirmed', 'shipped', 'delivered'].includes(order.status);
                const isCurrent = order.status === 'confirmed';
                return (
                  <>
                    <div style={trackingStep(isActive)}>
                      <div style={{
                        ...trackingIcon(isActive),
                        animation: isCurrent ? 'pulse-dot 1.6s ease-in-out infinite' : 'none',
                      }}>
                        <FaCheckCircle />
                      </div>
                      <div>
                        <p style={trackingLabel}>
                          Admin Confirmed
                          {isCurrent && (
                            <span style={{ marginLeft: 8, fontSize: 12, color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: 50 }}>
                              Current
                            </span>
                          )}
                        </p>
                        <p style={trackingTime}>{isActive ? formatDate(order.createdAtMs) : 'Awaiting confirmation'}</p>
                      </div>
                    </div>
                    <div style={trackingLine(['shipped', 'delivered'].includes(order.status))} />
                  </>
                );
              })()}

              {/* Step 3 — Shipped */}
              {(() => {
                const isActive = ['shipped', 'delivered'].includes(order.status);
                const isCurrent = order.status === 'shipped';
                return (
                  <>
                    <div style={trackingStep(isActive)}>
                      <div style={{
                        ...trackingIcon(isActive),
                        animation: isCurrent ? 'pulse-dot 1.6s ease-in-out infinite' : 'none',
                      }}>
                        <FaTruck />
                      </div>
                      <div>
                        <p style={trackingLabel}>
                          Shipped
                          {isCurrent && (
                            <span style={{ marginLeft: 8, fontSize: 12, color: '#0891b2', fontWeight: 700, background: '#cffafe', padding: '2px 8px', borderRadius: 50 }}>
                              Current
                            </span>
                          )}
                        </p>
                        <p style={trackingTime}>{isActive ? formatDate(order.createdAtMs) : 'Not yet shipped'}</p>
                      </div>
                    </div>
                    <div style={trackingLine(order.status === 'delivered')} />
                  </>
                );
              })()}

              {/* Step 4 — Delivered */}
              {(() => {
                const isActive = order.status === 'delivered';
                const isCurrent = isActive;
                return (
                  <div style={trackingStep(isActive)}>
                    <div style={{ ...trackingIcon(isActive) }}>
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p style={trackingLabel}>
                        Delivered
                        {isCurrent && (
                          <span style={{ marginLeft: 8, fontSize: 12, color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: 50 }}>
                            Current
                          </span>
                        )}
                      </p>
                      <p style={trackingTime}>{isActive ? formatDate(order.createdAtMs) : 'Pending delivery'}</p>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          <div style={detailsSection}>
            <h3>Item</h3>
            <div style={detailItem}>
              <div>
                <p style={itemName}>{order.cropName || 'Product'}</p>
                <p style={itemQty}>{order.quantity} {order.unit || 'kg'}</p>
              </div>
              <p style={itemTotal}>₹{parseFloat(order.totalPrice || order.totalAmount || 0).toFixed(2)}</p>
            </div>
          </div>

          <div style={detailsSection}>
            <h3><FaMapMarkerAlt /> Delivery Address</h3>
            {order.shippingAddress && (
              <div style={addressBox}>
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p><FaPhone /> {order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.area || order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
              </div>
            )}
          </div>

          <div style={detailsSection}>
            <h3>Payment Summary</h3>
            <div style={summaryBox}>
              <div style={{ ...summaryRow, ...summaryTotal }}>
                <strong>Total:</strong>
                <strong>₹{parseFloat(order.totalPrice || order.totalAmount || 0).toFixed(2)}</strong>
              </div>
              <div style={paymentMethodBox}>
                <span>Payment Method:</span>
                <span style={paymentBadge}>COD</span>
              </div>
            </div>
          </div>
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
            <div style={{ width: 40, height: 40, border: '4px solid #d1fae5', borderTop: '4px solid #16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#6b7280' }}>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={emptyBox}>
            <FaShoppingBag size={64} color="#d1fae5" />
            <p style={emptyText}>No orders yet</p>
            <p style={{ color: '#9ca3af', fontSize: 15, marginBottom: 24 }}>Browse products and place your first order!</p>
            <button
              onClick={() => navigate('/consumer')}
              style={{ padding: '12px 28px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}
            >
              <FaArrowLeft /> Go Shopping
            </button>
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
