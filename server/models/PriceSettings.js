// server/models/PriceSettings.js
const mongoose = require('mongoose');

const priceSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enabled: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['platform', 'friend'], default: 'platform' },
  friendEmail: { type: String, default: '' }
}, {
  timestamps: true // 自动管理 createdAt 和 updatedAt
});

module.exports = mongoose.model('PriceSettings', priceSettingsSchema); 