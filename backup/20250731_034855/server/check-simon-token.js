// 检查simon的token和登录状态
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// 模拟检查token的函数
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function checkSimonToken() {
  try {
    console.log('🔍 检查simon的token状态...');
    
    // 查找用户simon
    const userSimon = await User.findOne({ username: 'simon' });
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    console.log('   - username:', userSimon.username);
    console.log('   - email:', userSimon.email);
    
    // 生成一个测试token
    const testToken = jwt.sign(
      { userId: userSimon._id, username: userSimon.username },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('\n📋 测试token:');
    console.log('   - 生成的token:', testToken.substring(0, 50) + '...');
    
    // 验证token
    const verification = verifyToken(testToken);
    console.log('   - token验证结果:', verification.valid ? '✅ 有效' : '❌ 无效');
    if (!verification.valid) {
      console.log('   - 错误信息:', verification.error);
    } else {
      console.log('   - userId:', verification.userId);
    }
    
    // 检查localStorage中可能的token格式
    console.log('\n📋 可能的token格式:');
    console.log('   - 完整token:', testToken);
    console.log('   - 前端应该存储的格式: Bearer ' + testToken);
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

checkSimonToken(); 