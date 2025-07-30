const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');
const Payment = require('./models/Payment');
const Checkin = require('./models/Checkin');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  testPaymentFlow();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function testPaymentFlow() {
  try {
    console.log('🧪 测试支付功能流程...\n');
    
    // 1. 检查数据库状态
    console.log('1. 数据库状态检查:');
    const userCount = await User.countDocuments();
    const goalCount = await Goal.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const checkinCount = await Checkin.countDocuments();
    
    console.log(`   用户数量: ${userCount}`);
    console.log(`   目标数量: ${goalCount}`);
    console.log(`   支付记录: ${paymentCount}`);
    console.log(`   打卡记录: ${checkinCount}`);
    console.log('');
    
    if (userCount === 0) {
      console.log('⚠️  数据库中没有用户，需要先注册用户');
      console.log('   建议步骤:');
      console.log('   1. 访问 http://localhost:3000');
      console.log('   2. 注册新用户');
      console.log('   3. 设置目标和惩罚机制');
      console.log('   4. 填写银行信息');
      console.log('   5. 进行打卡测试');
      console.log('   6. 测试支付功能');
      return;
    }
    
    // 2. 显示现有用户
    console.log('2. 现有用户列表:');
    const users = await User.find({}).select('username email bankName accountName createdAt');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email || '无邮箱'})`);
      console.log(`      银行信息: ${user.bankName ? '已设置' : '未设置'}`);
      console.log(`      创建时间: ${user.createdAt}`);
      console.log('');
    });
    
    // 3. 检查支付相关配置
    console.log('3. 支付功能配置检查:');
    console.log('   Stripe配置:', process.env.STRIPE_SECRET_KEY ? '已设置' : '未设置');
    console.log('   模拟支付: 可用');
    console.log('   真实支付: 需要Stripe密钥');
    console.log('');
    
    // 4. 支付功能测试建议
    console.log('4. 支付功能测试建议:');
    console.log('');
    console.log('   📋 测试步骤:');
    console.log('   1. 用户注册和登录');
    console.log('   2. 设置目标和惩罚金额');
    console.log('   3. 填写银行信息');
    console.log('   4. 进行打卡（成功/失败）');
    console.log('   5. 测试支付功能');
    console.log('');
    
    console.log('   🔧 支付功能类型:');
    console.log('   A. 模拟支付 (mockPayment) - 推荐用于开发测试');
    console.log('      - 无需真实支付');
    console.log('      - 模拟转账成功/失败');
    console.log('      - 记录转账历史');
    console.log('');
    console.log('   B. 真实支付 (Stripe) - 生产环境使用');
    console.log('      - 需要Stripe账户和密钥');
    console.log('      - 真实信用卡支付');
    console.log('      - 完整的支付流程');
    console.log('');
    
    console.log('   🎯 推荐测试流程:');
    console.log('   1. 使用模拟支付进行功能测试');
    console.log('   2. 验证支付记录和转账历史');
    console.log('   3. 测试朋友转账功能');
    console.log('   4. 确认银行信息验证');
    console.log('');
    
    // 5. API端点测试
    console.log('5. 可用的支付API端点:');
    console.log('   POST /api/mock-payment/transfer - 模拟转账');
    console.log('   GET  /api/mock-payment/transfers - 获取转账记录');
    console.log('   GET  /api/mock-payment/received - 获取收到账款记录');
    console.log('   GET  /api/mock-payment/stats - 获取转账统计');
    console.log('   DELETE /api/mock-payment/transfers - 清空转账记录');
    console.log('');
    console.log('   POST /api/payment/create-payment-intent - 创建Stripe支付意图');
    console.log('   POST /api/payment/confirm-payment - 确认支付成功');
    console.log('');
    
    // 6. 快速测试脚本
    console.log('6. 快速测试命令:');
    console.log('   # 测试模拟转账API');
    console.log('   curl -X POST http://localhost:5000/api/mock-payment/transfer \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -H "Authorization: Bearer YOUR_TOKEN" \\');
    console.log('     -d \'{"amount": 100, "type": "platform", "remark": "测试转账"}\'');
    console.log('');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 