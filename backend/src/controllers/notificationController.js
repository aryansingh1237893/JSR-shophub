const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Order = require('../models/Order');
const User = require('../models/User');

// Email transporter
const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (orderId) => {
  try {
    const order = await Order.findOne({ orderId }).populate('user').populate('items.product');
    if (!order) return;

    const user = order.user;
    const itemsHtml = order.items.map(item =>
      `<tr>
        <td>${item.product.title}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const emailHtml = `
      <h2>Order Confirmation - ${orderId}</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your order has been successfully placed!</p>

      <h3>Order Details:</h3>
      <table border="1" style="border-collapse: collapse;">
        <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
        ${itemsHtml}
        <tr><td colspan="3"><strong>Total</strong></td><td><strong>₹${order.total}</strong></td></tr>
      </table>

      <p><strong>Shipping Address:</strong><br>
      ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>

      <p>Thank you for shopping with ShopHub!</p>
    `;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation - ${orderId}`,
      html: emailHtml,
    });

    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// Send order confirmation SMS
exports.sendOrderConfirmationSMS = async (orderId) => {
  try {
    const order = await Order.findOne({ orderId }).populate('user');
    if (!order) return;

    const user = order.user;
    const message = `ShopHub: Your order ${orderId} for ₹${order.total} has been confirmed. Track at: https://shophub.com/track/${orderId}`;

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    console.log(`Order confirmation SMS sent to ${user.phone}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
  }
};

// Send order status update notification
exports.sendOrderStatusUpdate = async (orderId, status) => {
  try {
    const order = await Order.findOne({ orderId }).populate('user');
    if (!order) return;

    const user = order.user;
    const statusMessages = {
      shipped: 'Your order has been shipped and is on the way!',
      'out-for-delivery': 'Your order is out for delivery. Expected today!',
      delivered: 'Your order has been delivered successfully!',
      cancelled: 'Your order has been cancelled.',
    };

    const message = `ShopHub: ${statusMessages[status] || 'Order status updated'} - ${orderId}`;

    // Send SMS
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    // Send Email
    const emailHtml = `
      <h2>Order Update - ${orderId}</h2>
      <p>Dear ${user.firstName},</p>
      <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
      <p><strong>Status:</strong> ${status.replace('-', ' ').toUpperCase()}</p>
      <p>Track your order: <a href="https://shophub.com/track/${orderId}">Click here</a></p>
    `;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Update - ${orderId}`,
      html: emailHtml,
    });

    console.log(`Status update notification sent for order ${orderId}`);
  } catch (error) {
    console.error('Notification sending failed:', error);
  }
};

// Send price drop alert
exports.sendPriceDropAlert = async (userId, productId, oldPrice, newPrice) => {
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) return;

    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    const message = `ShopHub: Price drop alert! ${product.title} now ₹${newPrice} (${discount}% off). Limited time offer!`;

    // Send SMS
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone,
    });

    // Send Email
    const emailHtml = `
      <h2>Price Drop Alert!</h2>
      <p>Dear ${user.firstName},</p>
      <p>Great news! The price of a product you're interested in has dropped.</p>

      <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
        <h3>${product.title}</h3>
        <p><strong>Old Price:</strong> ₹${oldPrice}</p>
        <p><strong>New Price:</strong> ₹${newPrice}</p>
        <p><strong>You Save:</strong> ₹${oldPrice - newPrice} (${discount}%)</p>
        <a href="https://shophub.com/product/${product._id}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Shop Now</a>
      </div>
    `;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Price Drop Alert - Shop Now!',
      html: emailHtml,
    });

    console.log(`Price drop alert sent to user ${userId}`);
  } catch (error) {
    console.error('Price drop alert failed:', error);
  }
};

// Send OTP SMS
exports.sendOTPSMS = async (phone, otp) => {
  try {
    const message = `ShopHub: Your OTP is ${otp}. Valid for 5 minutes.`;

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`OTP SMS sent to ${phone}`);
  } catch (error) {
    console.error('OTP SMS failed:', error);
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  try {
    const emailHtml = `
      <h2>Welcome to ShopHub!</h2>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for joining ShopHub! Your account has been successfully created.</p>

      <h3>What you can do:</h3>
      <ul>
        <li>Browse millions of products</li>
        <li>Fast & secure checkout</li>
        <li>Track orders in real-time</li>
        <li>Get exclusive deals & offers</li>
        <li>Join Prime for free delivery</li>
      </ul>

      <p>Start shopping: <a href="https://shophub.com">Shop Now</a></p>

      <p>Happy Shopping!<br>Team ShopHub</p>
    `;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to ShopHub!',
      html: emailHtml,
    });

    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `https://shophub.com/reset-password/${resetToken}`;

    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>Dear ${user.firstName},</p>
      <p>You requested a password reset for your ShopHub account.</p>

      <p><strong>Click the link below to reset your password:</strong></p>
      <a href="${resetUrl}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>

      <p><small>This link will expire in 1 hour.</small></p>
      <p><small>If you didn't request this, please ignore this email.</small></p>

      <p>Best regards,<br>Team ShopHub</p>
    `;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset - ShopHub',
      html: emailHtml,
    });

    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error('Password reset email failed:', error);
  }
};
