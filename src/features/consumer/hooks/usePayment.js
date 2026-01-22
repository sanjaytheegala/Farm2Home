import { useState } from 'react';
import { initiatePayment, processCODOrder, initiateUPIPayment } from '../../../services/paymentService';

/**
 * Custom hook for payment processing
 * Supports: Razorpay, UPI, Cash on Delivery
 */
export const usePayment = () => {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Process payment based on selected method
   * @param {string} method - 'razorpay' | 'upi' | 'cod'
   * @param {object} orderDetails - Order information
   * @param {object} customerDetails - Customer information
   */
  const processPayment = async (method, orderDetails, customerDetails) => {
    setProcessing(true);
    setError(null);
    setPaymentStatus(null);

    try {
      let result;

      switch (method) {
        case 'razorpay':
          result = await initiatePayment(
            {
              ...orderDetails,
              onSuccess: (response, orderId) => {
                setPaymentStatus('success');
                setProcessing(false);
                if (orderDetails.onSuccess) {
                  orderDetails.onSuccess(response, orderId);
                }
              },
              onCancel: (orderId) => {
                setPaymentStatus('cancelled');
                setProcessing(false);
                if (orderDetails.onCancel) {
                  orderDetails.onCancel(orderId);
                }
              }
            },
            customerDetails
          );
          break;

        case 'upi':
          result = await initiateUPIPayment(orderDetails, customerDetails);
          if (result.success) {
            setPaymentStatus('initiated');
            // UPI payment verification needs to be done manually or via webhook
          }
          setProcessing(false);
          break;

        case 'cod':
          result = await processCODOrder(orderDetails, customerDetails);
          if (result.success) {
            setPaymentStatus('success');
          }
          setProcessing(false);
          break;

        default:
          throw new Error('Invalid payment method');
      }

      if (!result.success && result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      setError(err.message);
      setProcessing(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Reset payment state
   */
  const resetPayment = () => {
    setProcessing(false);
    setPaymentStatus(null);
    setError(null);
  };

  return {
    processing,
    paymentStatus,
    error,
    processPayment,
    resetPayment
  };
};
