// 加载环境变量
require('dotenv').config();

console.log("Starting server...");

const express = require('express');
const cors = require('cors');
const app = express();

// HTTPS强制中间件
const forceHTTPS = (req, res, next) => {
  // 检查是否在生产环境
  if (process.env.NODE_ENV === 'production') {
    // 检查是否使用HTTPS
    if (req.headers['x-forwarded-proto'] !== 'https') {
      // 重定向到HTTPS
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
  }
  next();
};

// 临时禁用HTTPS强制中间件（开发环境）
// app.use(forceHTTPS);

// 安全头部中间件
app.use((req, res, next) => {
  // 强制HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY');

  // 防止MIME类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS保护
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 引用策略
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 内容安全策略
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");

  next();
});
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

// Debug: Log environment variables
console.log('🔍 Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

// MongoDB connection - use environment variable or local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myhabit-app';
console.log('🔗 Using MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const goalRoutes = require('./routes/setGoal');
const priceRoutes = require('./routes/price');

app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// 使用路由
app.use('/api/goals', goalRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/user-progress', require('./routes/userProgress'));
app.use('/api/checkin', require('./routes/checkin'));
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

// 全局错误处理中间件 - 必须在所有路由之后
// const errorHandler = require('./middleware/errorHandler');
// app.use(errorHandler);

// 404处理 - 暂时注释掉
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     error: '页面不存在',
//     message: '请求的页面或API不存在'
//   });
// });

// 添加全局错误处理
process.on('uncaughtException', (err) => {
  console.error('💥 未捕获的异常:', err);
  console.error('🔄 服务器将在5秒后重启...');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 未处理的Promise拒绝:', reason);
  console.error('🔄 服务器将在5秒后重启...');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在优雅关闭...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在优雅关闭...');
  process.exit(0);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
  console.log(`📊 进程ID: ${process.pid}`);
  console.log(`🕐 启动时间: ${new Date().toLocaleString()}`);
});

// 服务器错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用`);
    console.log('💡 请检查是否有其他服务器实例在运行');
  } else {
    console.error('❌ 服务器错误:', err);
  }
  process.exit(1);
});
