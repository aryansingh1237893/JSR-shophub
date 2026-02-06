const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

// Initiate Stripe payment
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    const userId = req.userId;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId,
        userId,
        paymentMethod,
      },
      description: `Payment for order ${orderId}`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Stripe payment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    const userId = req.userId;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'completed',
          status: 'confirmed',
          paymentMethod: 'stripe',
          transactionId: paymentIntentId,
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process UPI payment
exports.processUPIPayment = async (req, res) => {
  try {
    const { orderId, upiId, amount } = req.body;

    // Create UPI payment intent with Stripe
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'cardless_emi',
      upi: {
        account_holder_name: req.body.name,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      payment_method: paymentMethod.id,
      metadata: {
        orderId,
        paymentType: 'upi',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment methods for user
exports.getUserPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('paymentMethods');
    res.json({ paymentMethods: user.paymentMethods || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save payment method
exports.savePaymentMethod = async (req, res) => {
  try {
    const { cardToken, paymentType } = req.body;

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: cardToken },
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          paymentMethods: {
            stripePaymentMethodId: paymentMethod.id,
            type: paymentType,
            last4: paymentMethod.card.last4,
          },
        },
      },
      { new: true }
    );

    res.json({ message: 'Payment method saved', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { paymentIntentId, orderId, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
      metadata: {
        orderId,
        userId: req.userId,
      },
    });

    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'refunded',
      status: 'cancelled',
      refundId: refund.id,
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refundId: refund.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// EMI options
exports.getEMIOptions = async (req, res) => {
  try {
    const { amount } = req.query;

    const emiOptions = [
      {
        tenure: 3,
        monthlyAmount: (amount / 3).toFixed(2),
        totalAmount: amount,
        interestRate: '0%',
        bank: 'Stripe',
      },
      {
        tenure: 6,
        monthlyAmount: (amount / 6).toFixed(2),
        totalAmount: amount,
        interestRate: '0%',
        bank: 'Stripe',
      },
      {
        tenure: 12,
        monthlyAmount: (amount / 12).toFixed(2),
        totalAmount: amount,
        interestRate: '0%',
        bank: 'Stripe',
      },
    ];

    res.json(emiOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
