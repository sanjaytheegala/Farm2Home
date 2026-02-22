/**
 * Payment Service - Razorpay Integration
 * 
 * Setup Instructions:
 * 1. Sign up at https://razorpay.com
 * 2. Get your Key ID and Key Secret from Dashboard
 * 3. Add to .env file:
 *    REACT_APP_RAZORPAY_KEY_ID=your_key_id
 *    REACT_APP_RAZORPAY_KEY_SECRET=your_key_secret
 * 4. Install: npm install razorpay
 * 5. Add script to public/index.html:
 *    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 */

// Razorpay Key (Test Mode - Replace with your actual key)
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create order in localStorage and get order ID
 */
export const createOrder = async (orderData) => {
  try {
    const order = {
      ...orderData,
      id: 'order_' + Date.now(),
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    return {
      success: true,
      orderId: order.id,
      order: order
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update order payment status
 */
export const updateOrderPayment = async (orderId, paymentData) => {
  try {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.id === orderId ? {
        ...order,
        paymentStatus: 'completed',
        paymentId: paymentData.razorpay_payment_id,
        paymentSignature: paymentData.razorpay_signature,
        status: 'confirmed',
        updatedAt: new Date().toISOString()
      } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return { success: true };
  } catch (error) {
    console.error('Error updating payment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initiate Razorpay payment
 */
export const initiatePayment = async (orderDetails, customerDetails) => {
  // Load Razorpay script
  const res = await loadRazorpayScript();
  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return { success: false, error: 'Script load failed' };
  }

  // Create order in localStorage first
  const orderResult = await createOrder({
    ...orderDetails,
    customer: customerDetails
  });

  if (!orderResult.success) {
    return orderResult;
  }

  const { orderId, order } = orderResult;

  // Razorpay options
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: orderDetails.amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Farm2Home',
    description: orderDetails.description || 'Purchase from Farm2Home',
    image: '/logo.png', // Your logo
    order_id: orderId, // Order ID from localStorage
    handler: async function (response) {
      await updateOrderPayment(orderId, response);
      if (orderDetails.onSuccess) {
        orderDetails.onSuccess(response, orderId);
      }
    },
    prefill: {
      name: customerDetails.name,
      email: customerDetails.email,
      contact: customerDetails.phone
    },
    notes: {
      address: customerDetails.address
    },
    theme: {
      color: '#28a745' // Farm2Home green color
    },
    modal: {
      ondismiss: function() {
        if (orderDetails.onCancel) {
          orderDetails.onCancel(orderId);
        }
      }
    }
  };

  // Open Razorpay checkout
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();

  return { success: true, orderId };
};

/**
 * Process Cash on Delivery order
 */
export const processCODOrder = async (orderDetails, customerDetails) => {
  try {
    const orderResult = await createOrder({
      ...orderDetails,
      customer: customerDetails,
      paymentMethod: 'cod',
      paymentStatus: 'pending'
    });

    if (orderResult.success) {
      return {
        success: true,
        orderId: orderResult.orderId,
        message: 'Order placed successfully! Pay on delivery.'
      };
    }
    return orderResult;
  } catch (error) {
    console.error('Error processing COD order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (userId) => {
  try {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orders = allOrders.filter(order => order.customer?.userId === userId);
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId) => {
  try {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.id === orderId ? {
        ...order,
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * UPI Payment (Alternative to Razorpay)
 * Uses UPI deep linking for direct payment apps
 */
export const initiateUPIPayment = (orderDetails, customerDetails) => {
  const { amount, description } = orderDetails;
  
  // UPI payment parameters
  const upiId = 'yourstore@upi'; // Replace with your UPI ID
  const name = 'Farm2Home';
  
  // Create UPI deep link
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
  
  // Open UPI app
  window.location.href = upiUrl;
  
  // Create order as pending
  return createOrder({
    ...orderDetails,
    customer: customerDetails,
    paymentMethod: 'upi',
    paymentStatus: 'pending'
  });
};
