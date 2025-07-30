// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // 确保用户名唯一
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
  },
  // 银行信息字段
  bankName: {
    type: String,
    default: ''
  },
  accountName: {
    type: String,
    default: ''
  },
  accountNumber: {
    type: String,
    default: ''
  },
  cardType: {
    type: String,
    enum: ['', 'debit', 'credit', 'Visa', 'MasterCard', 'American Express', 'UnionPay'],
    default: ''
  },
  expiryDate: {
    type: String,
    default: ''
  },
  cvv: {
    type: String,
    default: ''
  },
  idNumber: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  branchName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true // 添加 createdAt 和 updatedAt 字段
});

module.exports = mongoose.model('User', userSchema);

