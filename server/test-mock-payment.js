const mongoose = require('mongoose');
const User = require('./models/User');
const Payment = require('./models/Payment');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  testMockPayment();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function testMockPayment() {
  try {
    console.log('🧪 测试模拟支付功能...\n');
    
    // 1. 获取用户信息
    const user = await User.findOne({ username: 'lux' });
    if (!user) {
      console.log('❌ 用户lux不存在，请先注册用户');
      return;
    }
    
    console.log('1. 用户信息:');
    console.log(`   用户名: ${user.username}`);
    console.log(`   银行信息: ${user.bankName ? '已设置' : '未设置'}`);
    if (user.bankName) {
      console.log(`   银行: ${user.bankName}`);
      console.log(`   账户名: ${user.accountName}`);
      console.log(`   账号: ${user.accountNumber ? '****' + user.accountNumber.slice(-4) : '未设置'}`);
    }
    console.log('');
    
    // 2. 生成测试token（模拟登录）
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign(
      { id: user._id, username: user.username },
      'your-secret',
      { expiresIn: '1h' }
    );
    
    console.log('2. 测试Token已生成');
    console.log('');
    
    // 3. 测试模拟转账API
    console.log('3. 测试模拟转账API:');
    
    const fetch = require('node-fetch');
    const baseURL = 'http://localhost:5000';
    
    // 测试平台转账
    console.log('   A. 测试平台转账 ($100):');
    try {
      const platformResponse = await fetch(`${baseURL}/api/mock-payment/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          amount: 100,
          type: 'platform',
          remark: '测试平台转账 - 未打卡惩罚'
        })
      });
      
      const platformData = await platformResponse.json();
      console.log(`   状态码: ${platformResponse.status}`);
      console.log(`   响应: ${JSON.stringify(platformData, null, 2)}`);
    } catch (error) {
      console.log(`   错误: ${error.message}`);
    }
    console.log('');
    
    // 测试朋友转账
    console.log('   B. 测试朋友转账 ($50):');
    try {
      const friendResponse = await fetch(`${baseURL}/api/mock-payment/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
          amount: 50,
          type: 'friend',
          receiver: 'testfriend',
          remark: '测试朋友转账 - 监督奖励'
        })
      });
      
      const friendData = await friendResponse.json();
      console.log(`   状态码: ${friendResponse.status}`);
      console.log(`   响应: ${JSON.stringify(friendData, null, 2)}`);
    } catch (error) {
      console.log(`   错误: ${error.message}`);
    }
    console.log('');
    
    // 4. 获取转账记录
    console.log('4. 获取转账记录:');
    try {
      const transfersResponse = await fetch(`${baseURL}/api/mock-payment/transfers`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      
      const transfersData = await transfersResponse.json();
      console.log(`   状态码: ${transfersResponse.status}`);
      console.log(`   转账记录: ${JSON.stringify(transfersData, null, 2)}`);
    } catch (error) {
      console.log(`   错误: ${error.message}`);
    }
    console.log('');
    
    // 5. 获取转账统计
    console.log('5. 获取转账统计:');
    try {
      const statsResponse = await fetch(`${baseURL}/api/mock-payment/stats`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });
      
      const statsData = await statsResponse.json();
      console.log(`   状态码: ${statsResponse.status}`);
      console.log(`   统计信息: ${JSON.stringify(statsData, null, 2)}`);
    } catch (error) {
      console.log(`   错误: ${error.message}`);
    }
    console.log('');
    
    // 6. 测试建议
    console.log('6. 前端测试建议:');
    console.log('   1. 登录用户lux');
    console.log('   2. 进入转账记录页面');
    console.log('   3. 查看转账历史');
    console.log('   4. 测试新的转账功能');
    console.log('   5. 验证银行信息显示');
    console.log('');
    
    console.log('✅ 模拟支付测试完成');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 