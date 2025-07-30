const mongoose = require('mongoose');
const User = require('./models/User');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  testTransferRecords();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function testTransferRecords() {
  try {
    console.log('🧪 测试转账记录数据结构...\n');
    
    // 1. 获取用户信息
    const user = await User.findOne({ username: 'lux' });
    if (!user) {
      console.log('❌ 用户lux不存在');
      return;
    }
    
    // 2. 生成测试token
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign(
      { id: user._id, username: user.username },
      'your-secret',
      { expiresIn: '1h' }
    );
    
    // 3. 调用转账记录API
    const fetch = require('node-fetch');
    const baseURL = 'http://localhost:5000';
    
    console.log('调用转账记录API...');
    const response = await fetch(`${baseURL}/api/mock-payment/transfers`, {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });
    
    const data = await response.json();
    console.log('API响应状态码:', response.status);
    console.log('API响应数据结构:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    // 4. 分析数据结构
    console.log('数据结构分析:');
    if (data.transfers && Array.isArray(data.transfers)) {
      console.log(`✅ 转账记录数组存在，共 ${data.transfers.length} 条记录`);
      
      if (data.transfers.length > 0) {
        const firstRecord = data.transfers[0];
        console.log('第一条记录字段:');
        console.log(Object.keys(firstRecord));
        console.log('');
        
        console.log('前端期望的字段 vs API返回的字段:');
        console.log('前端期望: transferDate, friendContact, transferType, status, amount');
        console.log('API返回:', Object.keys(firstRecord));
        console.log('');
        
        // 5. 字段映射建议
        console.log('字段映射建议:');
        console.log('transferDate -> date');
        console.log('friendContact -> receiver');
        console.log('transferType -> type');
        console.log('status -> status (匹配)');
        console.log('amount -> amount (匹配)');
      }
    } else {
      console.log('❌ 转账记录数组不存在或格式错误');
    }
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 