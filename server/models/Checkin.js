// server/models/Checkin.js
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // 例如 "2025-07-17"
  imagePath: { type: String },
});

module.exports = mongoose.model('Checkin', checkinSchema);
