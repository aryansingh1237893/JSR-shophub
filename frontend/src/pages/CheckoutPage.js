import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!address) {
      alert('Please select or enter address');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        shippingAddress: address,
        billingAddress: address,
        paymentMethod,
      };
      const res = await orderService.createOrder(orderData);
      navigate(`/order/${res.data.order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Items</h2>
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                <span>{item.title} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
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
                <span>Free</span>
              </div>
              <div className="row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form">
            {/* Shipping Address */}
            <section className="checkout-section">
              <h3>Shipping Address</h3>
              <textarea
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="address-input"
              />
            </section>

            {/* Payment Method */}
            <section className="checkout-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Wallet</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </section>

            {/* Payment Details */}
            {paymentMethod === 'card' && (
              <section className="checkout-section">
                <h3>Card Details</h3>
                <input type="text" placeholder="Card Number" className="form-input" />
                <div className="form-row">
                  <input type="text" placeholder="MM/YY" className="form-input" />
                  <input type="text" placeholder="CVV" className="form-input" />
                </div>
              </section>
            )}

            {paymentMethod === 'upi' && (
              <section className="checkout-section">
                <h3>UPI Details</h3>
                <input type="text" placeholder="UPI ID" className="form-input" />
              </section>
            )}

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order (₹${total.toFixed(2)})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
