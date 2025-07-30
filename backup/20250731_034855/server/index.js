// 加载环境变量
require('dotenv').config();

console.log("Starting server...");

const express = require('express');
const cors = require('cors');
const app = express();
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
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const progressRoutes = require('./routes/progress');
const goalRoutes = require('./routes/setGoal');

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// 使用路由
app.use('/api/goals', goalRoutes);

app.use('/api', require('./routes/checkMissed'));
app.use('/api/progress', progressRoutes);
app.use('/api', require('./routes/uploadAvatar'));
app.use('/api/user', require('./routes/userProfile'));
app.use('/api/user', require('./routes/priceSettings'));
app.use('/api/user', require('./routes/userProgress'));
app.use('/api/bank-info', require('./routes/bankInfo'));
app.use('/api/mock-payment', require('./routes/mockPayment'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/invite', require('./routes/invite'));
app.use('/api/invite', require('./routes/invite-mock'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
