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
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true // 添加 createdAt 和 updatedAt 字段
});

module.exports = mongoose.model('User', userSchema);

