import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentService, orderService } from '../services/api';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const cartState = useSelector((state) => state.cart) || {};
  const localCart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || 'null') : null;

  const items = (cartState && cartState.items) || (localCart && localCart.items) || [];
  const total = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0) || 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      return;
    }

    try {
      setLoading(true);

      // Create PaymentIntent on server
      const res = await paymentService.initiatePayment({ amount: total });
      const clientSecret = res.data.clientSecret;

      // Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (confirm.error) {
        setError(confirm.error.message);
        setLoading(false);
        return;
      }

      if (confirm.paymentIntent && confirm.paymentIntent.status === 'succeeded') {
        setSuccess('Payment successful!');
        // Optionally create order
        try {
          await orderService.createOrder({});
        } catch (e) {
          // ignore order creation errors here; backend should finalize on webhook
          console.warn('Order creation warning:', e.message || e);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      <p>Total: ₹{total.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        <div className="card-element">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" className="btn" disabled={!stripe || loading}>
          {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
