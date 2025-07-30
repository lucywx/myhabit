// 测试simon的图片上传功能
const mongoose = require('mongoose');
const Checkin = require('./models/Checkin');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testSimonUpload() {
  try {
    console.log('🧪 测试simon的图片上传功能...');
    
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
    
    console.log('✅ 找到Checkin记录');
    console.log('   - startDate:', checkin.startDate);
    console.log('   - 当前打卡记录数:', checkin.checkins.length);
    
    // 显示所有打卡记录
    checkin.checkins.forEach(c => {
      console.log(`   - 第${c.day}天: ${c.filename}`);
    });
    
    // 测试第1天的canCheckinDay
    console.log('\n📋 测试第1天canCheckinDay:');
    const canCheckinDay1 = checkin.canCheckinDay(1);
    console.log(`   第1天可以打卡: ${canCheckinDay1 ? '✅ 是' : '❌ 否'}`);
    
    // 测试getTodayShouldCompleteDay
    console.log('\n📋 测试getTodayShouldCompleteDay:');
    const todayShouldCompleteDay = checkin.getTodayShouldCompleteDay();
    console.log(`   今天应该打卡第${todayShouldCompleteDay}天`);
    
    // 测试addCheckin方法
    console.log('\n📋 测试addCheckin方法:');
    try {
      await checkin.addCheckin(1, 'http://localhost:5000/uploads/test-simon-update.jpeg', 'test-simon-update.jpeg');
      console.log('✅ 成功更新第1天打卡记录');
      
      // 重新加载数据
      const updatedCheckin = await Checkin.findByUserId(userSimon._id);
      console.log('   - 更新后打卡记录数:', updatedCheckin.checkins.length);
      
      const day1Checkin = updatedCheckin.checkins.find(c => c.day === 1);
      if (day1Checkin) {
        console.log('   - 第1天新图片:', day1Checkin.filename);
      }
      
    } catch (error) {
      console.log('❌ 更新失败:', error.message);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSimonUpload(); 