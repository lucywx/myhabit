// 简化的启动脚本
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 根路径
app.get('/', (req, res) => {
  res.json({ message: 'MyHabit API Server', status: 'running' });
});

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myhabit-app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // 数据库连接成功后加载路由
    app.use('/api/goals', require('./routes/setGoal'));
    app.use('/api/checkin', require('./routes/checkin'));
    app.use('/api/price', require('./routes/price'));
    app.use('/api/user-progress', require('./routes/userProgress'));
    app.use('/api/bank-info', require('./routes/bankInfo'));
    app.use('/api/mock-payment', require('./routes/mockPayment'));
    app.use('/api/payment', require('./routes/payment'));
    app.use('/api/subscription', require('./routes/subscription'));
    app.use('/api/deposit', require('./routes/deposit'));
    app.use('/api/refund', require('./routes/refund'));
    app.use('/api/invite', require('./routes/invite'));
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/user', require('./routes/userProfile'));
    app.use('/api/upload', require('./routes/uploadAvatar'));
    app.use('/api/deposit-setup', require('./routes/depositSetup'));
    
    // 静态文件
    app.use('/uploads', express.static('uploads'));
    
    console.log('✅ Routes loaded');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
  console.log(`📊 进程ID: ${process.pid}`);
  console.log(`🕐 启动时间: ${new Date().toLocaleString()}`);
});

// 错误处理
process.on('uncaughtException', (err) => {
  console.error('💥 未捕获的异常:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 未处理的Promise拒绝:', reason);
  process.exit(1);
}); 