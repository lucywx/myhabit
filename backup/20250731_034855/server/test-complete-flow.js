const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  testCompleteFlow();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function testCompleteFlow() {
  try {
    console.log('🧪 测试完整用户流程...\n');
    
    // 1. 检查数据库状态
    console.log('1. 数据库状态检查:');
    const userCount = await User.countDocuments();
    const goalCount = await Goal.countDocuments();
    console.log(`   用户数量: ${userCount}`);
    console.log(`   目标数量: ${goalCount}`);
    console.log('');
    
    if (userCount === 0) {
      console.log('⚠️  数据库中没有用户，需要重新注册');
      console.log('   建议步骤:');
      console.log('   1. 访问 http://localhost:3000');
      console.log('   2. 点击 "Register" 注册新用户');
      console.log('   3. 登录并设置目标');
      console.log('   4. 设置惩罚机制');
      console.log('   5. 填写银行信息');
    } else {
      console.log('✅ 数据库中有用户，可以尝试登录');
      const users = await User.find({}).select('username email createdAt');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email || '无邮箱'}) - ${user.createdAt}`);
      });
    }
    
    console.log('\n2. 服务器状态检查:');
    console.log('   后端服务器: http://localhost:5000');
    console.log('   前端服务器: http://localhost:3000');
    console.log('');
    
    console.log('3. 常见问题解决:');
    console.log('   - 如果出现 "Failed to fetch" 错误:');
    console.log('     * 确保已登录并获取有效token');
    console.log('     * 检查浏览器控制台是否有CORS错误');
    console.log('     * 确保后端服务器正在运行');
    console.log('');
    console.log('   - 如果银行信息API失败:');
    console.log('     * 确保用户已登录');
    console.log('     * 检查localStorage中是否有token');
    console.log('     * 重新登录获取新token');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 