const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testToken() {
  try {
    // 测试一个示例token（这里需要替换为实际的token）
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODcwNzU5NmJiYmI5OGQwMGEwNzliZSIsImlhdCI6MTczMjg5NzMwNSwiZXhwIjoxNzMzNTAyMTA1fQ.example';
    
    console.log('测试token解析...');
    
    try {
      const decoded = jwt.verify(testToken, 'your-secret-key');
      console.log('Token解析成功:', decoded);
      
      // 查找用户
      const user = await User.findById(decoded.id);
      if (user) {
        console.log('找到用户:', user.username);
      } else {
        console.log('用户不存在，ID:', decoded.id);
      }
      
    } catch (tokenError) {
      console.log('Token解析失败:', tokenError.message);
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testToken(); 