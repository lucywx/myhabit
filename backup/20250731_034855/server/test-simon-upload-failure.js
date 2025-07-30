// 诊断simon上传失败的具体原因
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Checkin = require('./models/Checkin');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testSimonUploadFailure() {
  try {
    console.log('🔍 诊断simon上传失败的原因...');
    
    // 查找用户simon
    const userSimon = await User.findOne({ username: 'simon' });
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 生成新的token
    const newToken = jwt.sign(
      { userId: userSimon._id, username: userSimon.username },
      'your-secret',
      { expiresIn: '24h' }
    );
    
    console.log('\n📋 生成的新token:');
    console.log('   - token:', newToken);
    console.log('   - 前端应该设置: localStorage.setItem("token", "' + newToken + '")');
    
    // 验证token
    try {
      const decoded = jwt.verify(newToken, 'your-secret');
      console.log('   - token验证成功:', decoded);
    } catch (error) {
      console.log('   - token验证失败:', error.message);
    }
    
    // 检查Checkin记录
    const checkin = await Checkin.findByUserId(userSimon._id);
    if (checkin) {
      console.log('\n📋 Checkin记录状态:');
      console.log('   - 打卡记录数:', checkin.checkins.length);
      
      const day1Checkin = checkin.checkins.find(c => c.day === 1);
      if (day1Checkin) {
        console.log('   - 第1天记录存在:', day1Checkin.filename);
        
        // 测试canCheckinDay方法
        const canCheckin = checkin.canCheckinDay(1);
        console.log('   - 第1天可以打卡:', canCheckin ? '✅ 是' : '❌ 否');
      }
    }
    
    // 模拟前端API调用
    console.log('\n🌐 模拟前端API调用:');
    
    // 模拟get-goal API
    console.log('1. 模拟get-goal API调用...');
    // 这里应该调用实际的API，但为了安全，我们只模拟
    
    // 模拟get-checkin-image API
    console.log('2. 模拟get-checkin-image API调用...');
    
    // 模拟upload-checkin-image API
    console.log('3. 模拟upload-checkin-image API调用...');
    console.log('   - 这需要实际的HTTP请求和文件上传');
    
    console.log('\n💡 可能的解决方案:');
    console.log('1. 确保前端localStorage中有正确的token');
    console.log('2. 检查浏览器开发者工具的网络请求');
    console.log('3. 查看服务器端的错误日志');
    console.log('4. 确认文件上传权限和目录权限');
    
    console.log('\n🔧 立即解决方案:');
    console.log('在浏览器控制台运行:');
    console.log('localStorage.setItem("token", "' + newToken + '");');
    console.log('然后刷新页面重试');
    
  } catch (error) {
    console.error('❌ 诊断失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSimonUploadFailure(); 