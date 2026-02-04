const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['card', 'upi', 'wallet'],
    required: true,
  },
  cardNumber: String,
  cardHolder: String,
  expiryMonth: Number,
  expiryYear: Number,
  cvv: String,
  upiId: String,
  walletBalance: Number,
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
