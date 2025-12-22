import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, addDoc, auth } from '../firebase'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaCheckCircle, FaCreditCard, FaWallet, FaUniversity } from 'react-icons/fa'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart', 'address', 'payment', 'confirmation'
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod', 'upi', 'card', 'netbanking'
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(savedCart)
  }, [])

  const updateQuantity = (index, change) => {
    const updatedCart = [...cartItems]
    const newQuantity = (parseInt(updatedCart[index].quantity) || 1) + change
    if (newQuantity > 0) {
      updatedCart[index].quantity = newQuantity.toString()
      setCartItems(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  }

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0
      const quantity = parseInt(item.quantity) || 1
      return total + (price * quantity)
    }, 0)
  }

  const calculateDeliveryCharge = () => {
    const total = calculateTotal()
    return total > 500 ? 0 : 40
  }

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateDeliveryCharge()
  }

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
  }

  const generateOrderId = () => {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000)
  }

  const proceedToAddress = () => {
    if (cartItems.length === 0) {
      alert(t('cart_empty') || 'Your cart is empty!')
      return
    }
    setCheckoutStep('address')
  }

  const proceedToPayment = () => {
    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.addressLine || 
        !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      alert(t('fill_address') || 'Please fill all address fields')
      return
    }
    if (deliveryAddress.phone.length !== 10) {
      alert(t('valid_phone') || 'Please enter a valid 10-digit phone number')
      return
    }
    setCheckoutStep('payment')
  }

  const placeOrder = async () => {
    setLoading(true)
    const otp = generateOTP()
    const newOrderId = generateOrderId()
    
    const orderData = {
      orderId: newOrderId,
      userId: auth.currentUser?.uid || 'guest',
      items: cartItems,
      deliveryAddress,
      paymentMethod,
      totalAmount: calculateGrandTotal(),
      deliveryCharge: calculateDeliveryCharge(),
      otp,
      status: 'pending',
      createdAt: new Date(),
      timestamp: Date.now(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    }

    try {
      await addDoc(collection(db, 'orders'), orderData)
      setOrderId(newOrderId)
      setCheckoutStep('confirmation')
      localStorage.removeItem('cart')
      setLoading(false)
      
      // Simulate payment processing
      setTimeout(() => {
        console.log(`Order ${newOrderId} placed successfully! OTP: ${otp}`)
      }, 1000)
    } catch (error) {
      console.error('Failed to place order:', error)
      alert(t('order_failed') || 'Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  // Cart View
  const renderCart = () => (
    <div style={cartContainer}>
      <h2 style={heading}>
        <FaShoppingCart /> {t('cart') || 'My Cart'} ({cartItems.length})
      </h2>

      {cartItems.length === 0 ? (
        <div style={emptyCart}>
          <FaShoppingCart size={64} color="#ddd" />
          <p style={emptyText}>{t('cart_empty') || 'Your cart is empty'}</p>
          <button onClick={() => navigate('/consumer')} style={continueBtn}>
            {t('continue_shopping') || 'Continue Shopping'}
          </button>
        </div>
      ) : (
        <div style={cartContent}>
          <div style={itemsSection}>
            {cartItems.map((item, index) => (
              <div key={index} style={cartItem}>
                <div style={itemDetails}>
                  <h3 style={itemName}>{item.crop}</h3>
                  <p style={itemPrice}>₹{item.price} / kg</p>
                </div>
                <div style={quantityControls}>
                  <button onClick={() => updateQuantity(index, -1)} style={qtyBtn}>
                    <FaMinus />
                  </button>
                  <span style={qtyDisplay}>{item.quantity || 1} kg</span>
                  <button onClick={() => updateQuantity(index, 1)} style={qtyBtn}>
                    <FaPlus />
                  </button>
                </div>
                <div style={itemTotal}>
                  <p style={totalPrice}>₹{(parseFloat(item.price) * (parseInt(item.quantity) || 1)).toFixed(2)}</p>
                  <button onClick={() => removeItem(index)} style={removeBtn}>
                    <FaTrash /> {t('remove') || 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={summarySection}>
            <h3 style={summaryHeading}>{t('order_summary') || 'Order Summary'}</h3>
            <div style={summaryRow}>
              <span>{t('subtotal') || 'Subtotal'}:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div style={summaryRow}>
              <span>{t('delivery') || 'Delivery Charge'}:</span>
              <span>{calculateDeliveryCharge() === 0 ? t('free') || 'FREE' : `₹${calculateDeliveryCharge()}`}</span>
            </div>
            {calculateDeliveryCharge() > 0 && (
              <p style={deliveryNote}>{t('free_delivery_note') || 'Free delivery on orders above ₹500'}</p>
            )}
            <div style={summaryTotal}>
              <strong>{t('total') || 'Total'}:</strong>
              <strong>₹{calculateGrandTotal().toFixed(2)}</strong>
            </div>
            <button onClick={proceedToAddress} style={checkoutBtn}>
              {t('proceed_checkout') || 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // Address View
  const renderAddress = () => (
    <div style={addressContainer}>
      <h2 style={heading}>{t('delivery_address') || 'Delivery Address'}</h2>
      <div style={formContainer}>
        <div style={formRow}>
          <input
            type="text"
            placeholder={t('full_name') || 'Full Name'}
            value={deliveryAddress.fullName}
            onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
            style={input}
          />
          <input
            type="tel"
            placeholder={t('phone') || 'Phone Number'}
            value={deliveryAddress.phone}
            onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
            style={input}
            maxLength="10"
          />
        </div>
        <input
          type="text"
          placeholder={t('address_line') || 'Address Line (House No., Street)'}
          value={deliveryAddress.addressLine}
          onChange={(e) => setDeliveryAddress({...deliveryAddress, addressLine: e.target.value})}
          style={inputFull}
        />
        <div style={formRow}>
          <input
            type="text"
            placeholder={t('city') || 'City'}
            value={deliveryAddress.city}
            onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
            style={input}
          />
          <input
            type="text"
            placeholder={t('state') || 'State'}
            value={deliveryAddress.state}
            onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
            style={input}
          />
        </div>
        <input
          type="text"
          placeholder={t('pincode') || 'Pincode'}
          value={deliveryAddress.pincode}
          onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
          style={input}
          maxLength="6"
        />
        <div style={btnGroup}>
          <button onClick={() => setCheckoutStep('cart')} style={backBtn}>
            {t('back') || 'Back'}
          </button>
          <button onClick={proceedToPayment} style={continueBtn}>
            {t('continue') || 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )

  // Payment View
  const renderPayment = () => (
    <div style={paymentContainer}>
      <h2 style={heading}>{t('payment_method') || 'Select Payment Method'}</h2>
      <div style={paymentOptions}>
        <div 
          style={paymentMethod === 'cod' ? activePaymentOption : paymentOption}
          onClick={() => setPaymentMethod('cod')}
        >
          <FaWallet size={32} />
          <h3>{t('cash_on_delivery') || 'Cash on Delivery'}</h3>
          <p>{t('pay_cash') || 'Pay when you receive'}</p>
        </div>
        <div 
          style={paymentMethod === 'upi' ? activePaymentOption : paymentOption}
          onClick={() => setPaymentMethod('upi')}
        >
          <FaWallet size={32} />
          <h3>{t('upi') || 'UPI'}</h3>
          <p>{t('gpay_phonepe') || 'GPay, PhonePe, Paytm'}</p>
        </div>
        <div 
          style={paymentMethod === 'card' ? activePaymentOption : paymentOption}
          onClick={() => setPaymentMethod('card')}
        >
          <FaCreditCard size={32} />
          <h3>{t('credit_debit_card') || 'Credit/Debit Card'}</h3>
          <p>{t('visa_mastercard') || 'Visa, Mastercard, Rupay'}</p>
        </div>
        <div 
          style={paymentMethod === 'netbanking' ? activePaymentOption : paymentOption}
          onClick={() => setPaymentMethod('netbanking')}
        >
          <FaUniversity size={32} />
          <h3>{t('net_banking') || 'Net Banking'}</h3>
          <p>{t('all_banks') || 'All major banks'}</p>
        </div>
      </div>

      <div style={orderSummaryBox}>
        <h3>{t('order_summary') || 'Order Summary'}</h3>
        <div style={summaryRow}>
          <span>{t('items') || 'Items'} ({cartItems.length}):</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div style={summaryRow}>
          <span>{t('delivery') || 'Delivery'}:</span>
          <span>{calculateDeliveryCharge() === 0 ? t('free') || 'FREE' : `₹${calculateDeliveryCharge()}`}</span>
        </div>
        <div style={summaryTotal}>
          <strong>{t('total_amount') || 'Total Amount'}:</strong>
          <strong>₹{calculateGrandTotal().toFixed(2)}</strong>
        </div>
      </div>

      <div style={btnGroup}>
        <button onClick={() => setCheckoutStep('address')} style={backBtn}>
          {t('back') || 'Back'}
        </button>
        <button onClick={placeOrder} style={placeOrderBtn} disabled={loading}>
          {loading ? (t('processing') || 'Processing...') : (t('place_order') || 'Place Order')}
        </button>
      </div>
    </div>
  )

  // Confirmation View
  const renderConfirmation = () => (
    <div style={confirmationContainer}>
      <div style={successIcon}>
        <FaCheckCircle size={80} color="#28a745" />
      </div>
      <h2 style={successHeading}>{t('order_placed') || 'Order Placed Successfully!'}</h2>
      <p style={orderIdText}>{t('order_id') || 'Order ID'}: <strong>{orderId}</strong></p>
      <div style={confirmationBox}>
        <p><strong>{t('payment_method') || 'Payment Method'}:</strong> {paymentMethod.toUpperCase()}</p>
        <p><strong>{t('total_amount') || 'Total Amount'}:</strong> ₹{calculateGrandTotal().toFixed(2)}</p>
        <p><strong>{t('delivery_to') || 'Delivering to'}:</strong> {deliveryAddress.fullName}</p>
        <p>{deliveryAddress.addressLine}, {deliveryAddress.city}</p>
        <p>{deliveryAddress.state} - {deliveryAddress.pincode}</p>
        <p style={estimatedText}>{t('estimated_delivery') || 'Estimated Delivery'}: 3-5 {t('days') || 'days'}</p>
      </div>
      <div style={btnGroup}>
        <button onClick={() => navigate('/orders')} style={viewOrdersBtn}>
          {t('view_orders') || 'View My Orders'}
        </button>
        <button onClick={() => navigate('/consumer')} style={continueBtn}>
          {t('continue_shopping') || 'Continue Shopping'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={container}>
      <Navbar />
      <div style={progressBar}>
        <div style={checkoutStep === 'cart' ? activeStep : step}>
          <div style={stepNumber}>1</div>
          <span>{t('cart') || 'Cart'}</span>
        </div>
        <div style={stepLine(checkoutStep !== 'cart')} />
        <div style={['address', 'payment', 'confirmation'].includes(checkoutStep) ? activeStep : step}>
          <div style={stepNumber}>2</div>
          <span>{t('address') || 'Address'}</span>
        </div>
        <div style={stepLine(['payment', 'confirmation'].includes(checkoutStep))} />
        <div style={['payment', 'confirmation'].includes(checkoutStep) ? activeStep : step}>
          <div style={stepNumber}>3</div>
          <span>{t('payment') || 'Payment'}</span>
        </div>
        <div style={stepLine(checkoutStep === 'confirmation')} />
        <div style={checkoutStep === 'confirmation' ? activeStep : step}>
          <div style={stepNumber}>4</div>
          <span>{t('confirmation') || 'Done'}</span>
        </div>
      </div>

      {checkoutStep === 'cart' && renderCart()}
      {checkoutStep === 'address' && renderAddress()}
      {checkoutStep === 'payment' && renderPayment()}
      {checkoutStep === 'confirmation' && renderConfirmation()}
    </div>
  )
}

// ✅ Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  padding: '24px'
}

const progressBar = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '800px',
  margin: '0 auto 40px',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}

const step = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#999',
  fontSize: '14px'
}

const activeStep = {
  ...step,
  color: '#28a745',
  fontWeight: 'bold'
}

const stepNumber = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'currentColor',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  fontSize: '18px',
  fontWeight: 'bold'
}

const stepLine = (active) => ({
  width: '80px',
  height: '2px',
  backgroundColor: active ? '#28a745' : '#ddd',
  margin: '0 10px'
})

const heading = {
  textAlign: 'center',
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '30px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px'
}

const cartContainer = {
  maxWidth: '1200px',
  margin: '0 auto'
}

const emptyCart = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: 'white',
  borderRadius: '12px'
}

const emptyText = {
  fontSize: '18px',
  color: '#666',
  margin: '20px 0'
}

const cartContent = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '20px'
}

const itemsSection = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}

const cartItem = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}

const itemDetails = {
  flex: 1
}

const itemName = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333'
}

const itemPrice = {
  margin: '4px 0 0',
  color: '#666'
}

const quantityControls = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
}

const qtyBtn = {
  width: '32px',
  height: '32px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px'
}

const qtyDisplay = {
  fontSize: '16px',
  fontWeight: 'bold',
  minWidth: '60px',
  textAlign: 'center'
}

const itemTotal = {
  textAlign: 'right'
}

const totalPrice = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#28a745',
  margin: '0 0 8px 0'
}

const removeBtn = {
  color: '#dc3545',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
}

const summarySection = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  height: 'fit-content',
  position: 'sticky',
  top: '120px'
}

const summaryHeading = {
  margin: '0 0 20px 0',
  fontSize: '20px'
}

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '12px 0',
  fontSize: '16px'
}

const deliveryNote = {
  fontSize: '12px',
  color: '#28a745',
  margin: '4px 0'
}

const summaryTotal = {
  ...summaryRow,
  fontSize: '20px',
  paddingTop: '16px',
  borderTop: '2px solid #eee',
  marginTop: '16px'
}

const checkoutBtn = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '20px'
}

const addressContainer = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px'
}

const formContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}

const formRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
}

const input = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px'
}

const inputFull = {
  ...input,
  width: '100%'
}

const btnGroup = {
  display: 'flex',
  gap: '16px',
  marginTop: '20px'
}

const backBtn = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#f0f0f0',
  color: '#333',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const continueBtn = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const paymentContainer = {
  maxWidth: '800px',
  margin: '0 auto'
}

const paymentOptions = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px'
}

const paymentOption = {
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  border: '2px solid #eee',
  transition: 'all 0.3s'
}

const activePaymentOption = {
  ...paymentOption,
  border: '2px solid #28a745',
  backgroundColor: '#f0fff4'
}

const orderSummaryBox = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '20px'
}

const placeOrderBtn = {
  ...continueBtn,
  backgroundColor: '#28a745'
}

const confirmationContainer = {
  maxWidth: '600px',
  margin: '0 auto',
  textAlign: 'center',
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '12px'
}

const successIcon = {
  marginBottom: '20px'
}

const successHeading = {
  color: '#28a745',
  fontSize: '28px',
  marginBottom: '20px'
}

const orderIdText = {
  fontSize: '18px',
  marginBottom: '30px',
  color: '#666'
}

const confirmationBox = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
  textAlign: 'left'
}

const estimatedText = {
  color: '#28a745',
  fontWeight: 'bold',
  marginTop: '12px'
}

const viewOrdersBtn = {
  ...continueBtn,
  backgroundColor: '#007bff'
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
