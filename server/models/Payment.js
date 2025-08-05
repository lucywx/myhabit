const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  paymentIntentId: { 
    type: String, 
    required: true
  },
  stripeChargeId: { 
    type: String 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'usd' 
  },
  day: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['platform', 'friend'], 
    required: true 
  },
  recipientContact: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  metadata: {
    username: String,
    goalContent: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// 索引
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentIntentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// 静态方法
paymentSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

paymentSchema.statics.findByPaymentIntentId = function(paymentIntentId) {
  return this.findOne({ paymentIntentId });
};

// 实例方法
paymentSchema.methods.updateStatus = function(status) {
  this.status = status;
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema); 