const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  inviteId: {
    type: String,
    required: true,
    unique: true
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'registered', 'expired'],
    default: 'sent'
  },
  inviteUrl: {
    type: String,
    required: true
  },
  registeredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  registeredAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    required: true
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
inviteSchema.index({ inviteId: 1 });
inviteSchema.index({ fromUserId: 1 });
inviteSchema.index({ toEmail: 1 });
inviteSchema.index({ status: 1 });
inviteSchema.index({ expiresAt: 1 });

// 静态方法
inviteSchema.statics.findByInviteId = function(inviteId) {
  return this.findOne({ inviteId, status: 'sent', expiresAt: { $gt: new Date() } });
};

inviteSchema.statics.findByFromUserId = function(fromUserId) {
  return this.find({ fromUserId }).sort({ createdAt: -1 });
};

inviteSchema.statics.findByToEmail = function(toEmail) {
  return this.find({ toEmail }).sort({ createdAt: -1 });
};

// 实例方法
inviteSchema.methods.markAsRegistered = function(userId) {
  this.status = 'registered';
  this.registeredUserId = userId;
  this.registeredAt = new Date();
  return this.save();
};

inviteSchema.methods.markAsExpired = function() {
  this.status = 'expired';
  return this.save();
};

module.exports = mongoose.model('Invite', inviteSchema); 