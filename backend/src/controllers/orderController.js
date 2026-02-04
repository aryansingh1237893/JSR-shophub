const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderId = `ORD-${Date.now()}`;
    let total = 0;
    const items = cart.items.map(item => {
      const price = item.product.discountPrice || item.product.price;
      total += price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: price,
      };
    });

    const order = new Order({
      orderId,
      user: req.userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      total,
      subtotal: total,
      tax: 0,
      shippingCost: 0,
    });

    await order.save();
    await Cart.deleteOne({ user: req.userId });

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    await Order.findByIdAndUpdate(id, { orderStatus: 'cancelled' });
    res.json({ message: 'Order cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request return
exports.requestReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        'returnRequest.status': 'pending',
        'returnRequest.reason': reason,
        'returnRequest.requestedAt': Date.now(),
      },
      { new: true }
    );

    res.json({ message: 'Return request created', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Download invoice
exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product');
    // TODO: Generate PDF invoice
    res.json({ message: 'Invoice generated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
