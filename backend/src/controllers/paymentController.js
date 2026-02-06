const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const Order = require('../models/Order');

// Create a PaymentIntent for the order
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (error) {
    console.error('initiatePayment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify payment status (retrieve PaymentIntent)
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required' });

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({ status: pi.status, paymentIntent: pi });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Card payment (alias to initiate)
exports.processCardPayment = async (req, res) => {
  return exports.initiatePayment(req, res);
};

// UPI payment (create PaymentIntent with UPI method - best-effort for test)
exports.processUPIPayment = async (req, res) => {
  try {
    const { amount, currency = 'inr' } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      payment_method_types: ['upi', 'card'],
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (error) {
    console.error('processUPIPayment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Wallet payment (simulate or route to existing gateway)
exports.processWalletPayment = async (req, res) => {
  try {
    // For wallets, use PaymentIntent as well; frontend should collect wallet token
    const { amount, currency = 'inr' } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (error) {
    console.error('processWalletPayment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Simple EMI options (static)
exports.getEMIOptions = async (req, res) => {
  try {
    const options = [
      { months: 3, interest: 0 },
      { months: 6, interest: 2.5 },
      { months: 9, interest: 4.0 },
      { months: 12, interest: 6.0 },
    ];
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refund processing
exports.processRefund = async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;
    if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required' });

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(Number(amount) * 100) : undefined,
    });

    res.json({ refund });
  } catch (error) {
    console.error('processRefund error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Retrieve payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required' });

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(pi);
  } catch (error) {
    console.error('getPaymentDetails error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // If no webhook secret provided, try parsing JSON body
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Fulfill the purchase, mark order paid
      console.log('PaymentIntent succeeded:', event.data.object.id);
      // Optionally update Order by metadata/orderId
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const PaymentMethod = require('../models/PaymentMethod');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paisa
      currency,
      metadata: { orderId },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    // Update order status
    if (paymentIntent.status === 'succeeded') {
      await Order.findOneAndUpdate(
        { orderId: paymentIntent.metadata.orderId },
        { paymentStatus: 'paid', status: 'confirmed' }
      );
    }

    res.json({ status: paymentIntent.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process card payment
exports.processCardPayment = async (req, res) => {
  try {
    const { amount, cardToken, orderId } = req.body;

    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'inr',
      source: cardToken,
      description: `Payment for order ${orderId}`,
    });

    if (charge.status === 'succeeded') {
      await Order.findOneAndUpdate(
        { orderId },
        { paymentStatus: 'paid', status: 'confirmed' }
      );
    }

    res.json({ success: true, charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process UPI payment
exports.processUPIPayment = async (req, res) => {
  try {
    const { amount, upiId, orderId } = req.body;

    // For UPI, we'll use Stripe's payment methods
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'upi',
      upi: { vpa: upiId },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      payment_method: paymentMethod.id,
      confirm: true,
      metadata: { orderId },
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process wallet payment
exports.processWalletPayment = async (req, res) => {
  try {
    const { amount, walletType, orderId } = req.body;

    // Create payment intent for wallet
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      payment_method_types: ['card'], // Wallets use card tokens
      metadata: { orderId, walletType },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get EMI options
exports.getEMIOptions = async (req, res) => {
  try {
    const { amount } = req.query;

    // EMI calculation logic
    const emiOptions = [
      { months: 3, interest: 0, emi: Math.ceil(amount / 3) },
      { months: 6, interest: 5, emi: Math.ceil((amount * 1.05) / 6) },
      { months: 9, interest: 8, emi: Math.ceil((amount * 1.08) / 9) },
      { months: 12, interest: 12, emi: Math.ceil((amount * 1.12) / 12) },
    ];

    res.json(emiOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const refund = await stripe.refunds.create({
      charge: order.stripeChargeId,
      amount: amount * 100,
      reason: reason || 'requested_by_customer',
    });

    // Update order status
    await Order.findOneAndUpdate(
      { orderId },
      {
        refundStatus: 'processed',
        refundAmount: amount,
        refundId: refund.id
      }
    );

    res.json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { orderId: paymentIntent.metadata.orderId },
        { paymentStatus: 'paid', status: 'confirmed' }
      );
      break;

    case 'payment_intent.payment_failed':
      await Order.findOneAndUpdate(
        { orderId: event.data.object.metadata.orderId },
        { paymentStatus: 'failed', status: 'payment_failed' }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
