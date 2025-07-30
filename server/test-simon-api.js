// 测试simon的API访问
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testSimonAPI() {
  try {
    console.log('🧪 测试simon的API访问...');
    
    // 查找用户simon
    const userSimon = await User.findOne({ username: 'simon' });
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 生成一个新的token
    const newToken = jwt.sign(
      { userId: userSimon._id, username: userSimon.username },
      'your-secret',
      { expiresIn: '24h' }
    );
    
    console.log('\n📋 新生成的token:');
    console.log('   - token:', newToken);
    console.log('   - 前端应该存储的格式: Bearer ' + newToken);
    
    // 测试token验证
    try {
      const decoded = jwt.verify(newToken, 'your-secret');
      console.log('   - token验证成功:', decoded);
    } catch (error) {
      console.log('   - token验证失败:', error.message);
    }
    
    console.log('\n💡 解决方案:');
    console.log('1. 让simon重新登录获取新的token');
    console.log('2. 或者手动设置localStorage中的token为上面的值');
    console.log('3. 然后重新尝试上传图片');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSimonAPI(); 