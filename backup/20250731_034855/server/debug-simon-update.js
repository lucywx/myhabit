// 调试simon的update操作失败原因
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

async function debugSimonUpdate() {
  try {
    console.log('🔍 调试simon的update操作失败原因...');
    
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
    
    console.log('📋 当前状态:');
    console.log('   - 打卡记录数:', checkin.checkins.length);
    
    const day1Checkin = checkin.checkins.find(c => c.day === 1);
    if (day1Checkin) {
      console.log('   - 第1天记录:', day1Checkin.filename);
      console.log('   - 第1天URL:', day1Checkin.imageUrl);
    }
    
    // 检查第1天是否可以打卡
    console.log('\n🔍 检查第1天是否可以打卡:');
    const canCheckin = checkin.canCheckinDay(1);
    console.log('   - 第1天可以打卡:', canCheckin ? '✅ 是' : '❌ 否');
    
    if (!canCheckin) {
      console.log('❌ 问题：第1天不能打卡，这是update失败的原因');
      return;
    }
    
    // 模拟update操作
    console.log('\n🔄 模拟update操作...');
    
    try {
      // 模拟新的图片信息
      const newImageUrl = 'http://localhost:5000/uploads/test-update-debug.jpeg';
      const newFilename = 'test-update-debug.jpeg';
      
      console.log('   - 新图片URL:', newImageUrl);
      console.log('   - 新文件名:', newFilename);
      
      // 调用addCheckin方法
      console.log('   - 调用addCheckin方法...');
      await checkin.addCheckin(1, newImageUrl, newFilename);
      console.log('   - ✅ addCheckin方法执行成功');
      
      // 验证更新
      console.log('\n📋 验证更新结果:');
      const updatedCheckin = await Checkin.findByUserId(userSimon._id);
      const updatedDay1 = updatedCheckin.checkins.find(c => c.day === 1);
      
      console.log('   - 更新后文件名:', updatedDay1.filename);
      console.log('   - 更新后URL:', updatedDay1.imageUrl);
      
      if (updatedDay1.filename === newFilename) {
        console.log('   - ✅ 数据库更新成功');
      } else {
        console.log('   - ❌ 数据库更新失败');
      }
      
    } catch (error) {
      console.log('❌ update操作失败:', error.message);
      console.log('   - 错误堆栈:', error.stack);
    }
    
    // 检查uploads目录权限
    console.log('\n📁 检查uploads目录:');
    const uploadsDir = path.join(__dirname, 'uploads');
    console.log('   - 目录路径:', uploadsDir);
    console.log('   - 目录存在:', fs.existsSync(uploadsDir) ? '✅ 是' : '❌ 否');
    
    if (fs.existsSync(uploadsDir)) {
      const stats = fs.statSync(uploadsDir);
      console.log('   - 目录权限:', stats.mode.toString(8));
      console.log('   - 可写:', (stats.mode & 0o200) ? '✅ 是' : '❌ 否');
    }
    
  } catch (error) {
    console.error('❌ 调试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugSimonUpdate(); 