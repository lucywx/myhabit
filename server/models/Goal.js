// server/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: String, required: true },
  days: { type: Number, required: true }, // 例如目标是打卡 30 天
  itemsPerDay: { type: Number, required: true }, // 每天清理物品数量
  punishment: {
    amount: { type: Number, default: 0 }, // 惩罚金额
    type: { type: String, enum: ['platform', 'friend'], default: 'platform' }, // 惩罚类型
    friendContact: { type: String, default: '' } // 朋友联系方式
  }
});

module.exports = mongoose.model('Goal', goalSchema);
