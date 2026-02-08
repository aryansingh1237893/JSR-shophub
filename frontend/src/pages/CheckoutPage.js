import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const CheckoutPage = () => {
  return (
    <div className="checkout-page">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/js';
import { orderService, paymentService } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_demo');

// Stripe Payment Form Component
const StripePaymentForm = ({ totalAmount, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe not loaded');
      return;
    }

    setProcessing(true);
    try {
      // Create PaymentIntent on backend
      const piRes = await paymentService.initiatePayment({
        amount: totalAmount,
        currency: 'inr',
        metadata: { orderId },
      });

      const { clientSecret } = piRes.data;

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'Customer' },
        },
      });

      if (result.error) {
        toast.error(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success('✅ Payment successful!');
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Payment error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleCardPayment} className="stripe-form">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424242',
              '::placeholder': { color: '#aee' },
            },
            invalid: { color: '#fa755a' },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? 'Processing Payment...' : `Pay ₹${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shippingCost;

  const handleOrderCreation = async () => {
    if (!address) {
      toast.error('Please enter shipping address');
      return;
    }
    if (!email) {
      toast.error('Please enter email');
      return;
    }
    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        shippingAddress: address,
        billingAddress: address,
        email,
        phone,
        paymentMethod,
        items,
      };

      const res = await orderService.createOrder(orderData);
      setOrderId(res.data.order._id);
      return res.data.order._id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    navigate(`/order/${orderId}`, { replace: true });
  };

  const handleCashOnDelivery = async () => {
    const newOrderId = await handleOrderCreation();
    if (newOrderId) {
      toast.success('✅ Order placed successfully!');
      navigate(`/order/${newOrderId}`, { replace: true });
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="place-order-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>🛒 Checkout</h1>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                <div>
                  <strong>{item.title}</strong>
                  <span className="item-qty">x {item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="summary-total">
              <div className="row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Tax (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'FREE ✓' : `₹${shippingCost}`}</span>
              </div>
              <div className="row total">
                <span>💰 Total:</span>
                <span className="total-price">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form">
            {/* Customer Details */}
            <section className="checkout-section">
              <h3>📍 Delivery Details</h3>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
              <textarea
                placeholder="Full Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="address-input"
                rows="4"
              />
            </section>

            {/* Payment Method Selection */}
            <section className="checkout-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💳 Credit/Debit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>📱 UPI</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💰 Wallet</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>📦 Cash on Delivery</span>
                </label>
              </div>
            </section>

            {/* Stripe Card Payment */}
            {paymentMethod === 'card' && (
              <section className="checkout-section">
                <h3>Card Payment</h3>
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    totalAmount={total}
                    orderId={orderId}
                    onSuccess={() => handleOrderCreation().then(handlePaymentSuccess)}
                  />
                </Elements>
              </section>
            )}

            {/* UPI Payment */}
            {paymentMethod === 'upi' && (
              <section className="checkout-section">
                <h3>UPI Payment</h3>
                <input type="text" placeholder="UPI ID (e.g., name@bank)" className="form-input" />
                <button
                  className="place-order-btn"
                  onClick={() => {
                    toast.info('UPI Payment - Coming Soon');
                  }}
                >
                  Process UPI Payment
                </button>
              </section>
            )}

            {/* Wallet Payment */}
            {paymentMethod === 'wallet' && (
              <section className="checkout-section">
                <h3>Wallet Balance</h3>
                <p className="wallet-balance">Available Balance: ₹0</p>
                <button
                  className="place-order-btn"
                  disabled
                >
                  Insufficient Wallet Balance
                </button>
              </section>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === 'cod' && (
              <section className="checkout-section">
                <p className="cod-info">
                  ✓ Pay cash when your order is delivered to your address.
                </p>
                <button
                  className="place-order-btn"
                  onClick={handleCashOnDelivery}
                  disabled={loading}
                >
                  {loading ? 'Creating Order...' : `Place Order - Cash on Delivery (₹${total.toFixed(2)})`}
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
