// 测试更新打卡记录的功能
const mongoose = require('mongoose');
const Checkin = require('./models/Checkin');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testUpdateCheckin() {
  try {
    console.log('🧪 测试更新打卡记录功能...');
    
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
    console.log('   - 当前打卡记录数:', checkin.checkins.length);
    
    // 测试canCheckinDay方法
    console.log('\n📋 测试canCheckinDay方法:');
    for (let day = 1; day <= 7; day++) {
      const canCheckin = checkin.canCheckinDay(day);
      const hasImage = checkin.checkins.find(c => c.day === day);
      console.log(`   第${day}天: ${canCheckin ? '✅ 可以打卡' : '❌ 不能打卡'} ${hasImage ? '(已有图片)' : ''}`);
    }
    
    // 测试addCheckin方法 - 更新第1天的记录
    console.log('\n📋 测试更新第1天打卡记录:');
    try {
      await checkin.addCheckin(1, 'http://localhost:5000/uploads/test-update.jpeg', 'test-update.jpeg');
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

testUpdateCheckin(); 