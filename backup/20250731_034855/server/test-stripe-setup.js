// 加载环境变量
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  testStripeSetup();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function testStripeSetup() {
  try {
    console.log('🧪 Stripe配置测试...\n');
    
    // 1. 检查环境变量
    console.log('1. 环境变量检查:');
    console.log('   STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '已设置' : '未设置');
    console.log('   STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? '已设置' : '未设置');
    console.log('');
    
    // 2. 检查Stripe密钥格式
    if (process.env.STRIPE_SECRET_KEY) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (secretKey.startsWith('sk_test_')) {
        console.log('   ✅ Secret Key格式正确 (测试模式)');
      } else if (secretKey.startsWith('sk_live_')) {
        console.log('   ⚠️  Secret Key格式正确 (生产模式)');
      } else {
        console.log('   ❌ Secret Key格式错误');
      }
    }
    
    if (process.env.STRIPE_PUBLISHABLE_KEY) {
      const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
      if (publishableKey.startsWith('pk_test_')) {
        console.log('   ✅ Publishable Key格式正确 (测试模式)');
      } else if (publishableKey.startsWith('pk_live_')) {
        console.log('   ⚠️  Publishable Key格式正确 (生产模式)');
      } else {
        console.log('   ❌ Publishable Key格式错误');
      }
    }
    console.log('');
    
    // 3. 测试Stripe连接
    if (process.env.STRIPE_SECRET_KEY) {
      console.log('2. 测试Stripe连接:');
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const account = await stripe.accounts.retrieve();
        console.log('   ✅ Stripe连接成功');
        console.log('   账户ID:', account.id);
        console.log('   账户类型:', account.type);
        console.log('   国家:', account.country);
        console.log('   货币:', account.default_currency);
      } catch (error) {
        console.log('   ❌ Stripe连接失败:', error.message);
      }
    } else {
      console.log('2. 跳过Stripe连接测试 (密钥未设置)');
    }
    console.log('');
    
    // 4. 对账单描述符测试
    console.log('3. 对账单描述符测试:');
    const testTypes = ['platform', 'friend', 'unknown'];
    testTypes.forEach(type => {
      const descriptor = getStatementDescriptor(type);
      console.log(`   ${type}: "${descriptor}" (${descriptor.length}字符)`);
    });
    console.log('');
    
    // 5. 配置建议
    console.log('4. 配置建议:');
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
      console.log('   A. 获取Stripe密钥:');
      console.log('      1. 访问 https://stripe.com');
      console.log('      2. 注册账户并完成验证');
      console.log('      3. 进入 Dashboard > Developers > API keys');
      console.log('      4. 复制 Secret key 和 Publishable key');
      console.log('');
      console.log('   B. 设置环境变量:');
      console.log('      在 .env 文件中添加:');
      console.log('      STRIPE_SECRET_KEY=sk_test_your_key_here');
      console.log('      STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here');
      console.log('');
    }
    
    console.log('   C. 前端配置:');
    console.log('      在 client/src/config.js 中确保:');
    console.log('      export const STRIPE_PUBLISHABLE_KEY = "pk_test_...";');
    console.log('');
    
    console.log('   D. 安装依赖:');
    console.log('      cd client && npm install @stripe/stripe-js @stripe/react-stripe-js');
    console.log('');
    
    // 6. 测试卡号
    console.log('5. Stripe测试卡号:');
    console.log('   ✅ 成功支付: 4242 4242 4242 4242');
    console.log('   ❌ 失败支付: 4000 0000 0000 0002');
    console.log('   ⚠️  需要验证: 4000 0025 0000 3155');
    console.log('   过期日期: 任意未来日期 (如 12/25)');
    console.log('   CVC: 任意3位数字 (如 123)');
    console.log('');
    
    // 7. 下一步操作
    console.log('6. 下一步操作:');
    console.log('   1. 配置Stripe密钥');
    console.log('   2. 重启服务器');
    console.log('   3. 测试支付功能');
    console.log('   4. 检查对账单描述符');
    console.log('');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
}

// 对账单描述符函数
function getStatementDescriptor(type) {
  switch(type) {
    case 'platform':
      return 'MYHABIT-PENALTY';
    case 'friend':
      return 'MYHABIT-REWARD';
    default:
      return 'MYHABIT APP';
  }
} 