// server/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalContent: { type: String, required: true }
}, { 
  strict: false // 允许存储模型中未定义的字段
});

module.exports = mongoose.model('Goal', goalSchema);
