// 测试simon的update操作
const mongoose = require('mongoose');
const Checkin = require('./models/Checkin');
const User = require('./models/User');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testSimonUpdate() {
  try {
    console.log('🧪 测试simon的update操作...');
    
    // 查找用户simon
    const userSimon = await User.findOne({ username: 'simon' });
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 查找Checkin记录
    const checkin = await Checkin.findByUserId(userSimon._id);
    if (!checkin) {
      console.log('❌ 没有找到Checkin记录');
      return;
    }
    
    console.log('📋 更新前的状态:');
    console.log('   - 打卡记录数:', checkin.checkins.length);
    
    const day1Checkin = checkin.checkins.find(c => c.day === 1);
    if (day1Checkin) {
      console.log('   - 第1天记录:', day1Checkin.filename);
      console.log('   - 第1天URL:', day1Checkin.imageUrl);
    }
    
    // 模拟update操作
    console.log('\n🔄 模拟update操作...');
    
    // 模拟新的图片信息
    const newImageUrl = 'http://localhost:5000/uploads/test-update-simon.jpeg';
    const newFilename = 'test-update-simon.jpeg';
    
    console.log('   - 新图片URL:', newImageUrl);
    console.log('   - 新文件名:', newFilename);
    
    try {
      // 调用addCheckin方法进行更新
      await checkin.addCheckin(1, newImageUrl, newFilename);
      console.log('✅ update操作成功');
      
      // 重新加载数据验证更新
      const updatedCheckin = await Checkin.findByUserId(userSimon._id);
      const updatedDay1 = updatedCheckin.checkins.find(c => c.day === 1);
      
      console.log('\n📋 更新后的状态:');
      console.log('   - 打卡记录数:', updatedCheckin.checkins.length);
      console.log('   - 第1天记录:', updatedDay1.filename);
      console.log('   - 第1天URL:', updatedDay1.imageUrl);
      
      // 验证是否真的更新了
      if (updatedDay1.filename === newFilename) {
        console.log('✅ 数据库记录已正确更新');
      } else {
        console.log('❌ 数据库记录未更新');
      }
      
    } catch (error) {
      console.log('❌ update操作失败:', error.message);
      console.log('   - 错误堆栈:', error.stack);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSimonUpdate(); 