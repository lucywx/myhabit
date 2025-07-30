// server/models/PunishmentSettings.js
const mongoose = require('mongoose');

const punishmentSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enabled: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['platform', 'friend'], default: 'platform' },
  friendContact: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PunishmentSettings', punishmentSettingsSchema); 