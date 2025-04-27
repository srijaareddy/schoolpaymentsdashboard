const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  collect_id: {
    type: String,
    required: true,
    unique: true
  },
  school_id: {
    type: String,
    required: true,
    index: true
  },
  gateway: {
    type: String,
    required: true,
    enum: ['PhonePe', 'Paytm', 'Razorpay', 'Stripe']
  },
  order_amount: {
    type: Number,
    required: true
  },
  transaction_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Success', 'Pending', 'Failed'],
    default: 'Pending'
  },
  custom_order_id: {
    type: String,
    required: true,
    unique: true
  },
  bank_reference: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

transactionSchema.index({ school_id: 1, created_at: -1 });
transactionSchema.index({ custom_order_id: 1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
