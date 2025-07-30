// 检查用户simon的Checkin模型数据
const mongoose = require('mongoose');
const Checkin = require('./models/Checkin');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function checkSimonCheckin() {
  try {
    console.log('🔍 检查用户simon的Checkin模型数据...');
    
    // 查找用户simon
    const userSimon = await User.findOne({ username: 'simon' });
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 查找Checkin记录
    const checkin = await Checkin.findByUserId(userSimon._id);
    
    if (checkin) {
      console.log('✅ 找到Checkin记录:');
      console.log('   - Checkin ID:', checkin._id);
      console.log('   - 开始日期:', checkin.startDate);
      console.log('   - 打卡记录数:', checkin.checkins.length);
      console.log('   - 是否完成:', checkin.isCompleted);
      console.log('   - 总天数:', checkin.totalDays);
      
      if (checkin.checkins.length > 0) {
        console.log('   - 打卡记录:');
        checkin.checkins.forEach(c => {
          console.log(`     第${c.day}天: ${c.filename} (${c.uploadedAt})`);
        });
      }
      
      // 测试canCheckinDay方法
      console.log('\n📋 测试canCheckinDay方法:');
      for (let day = 1; day <= 7; day++) {
        const canCheckin = checkin.canCheckinDay(day);
        console.log(`   第${day}天: ${canCheckin ? '✅ 可以打卡' : '❌ 不能打卡'}`);
      }
      
      // 测试getTodayShouldCompleteDay方法
      console.log('\n📋 测试getTodayShouldCompleteDay方法:');
      const todayShouldCompleteDay = checkin.getTodayShouldCompleteDay();
      console.log(`   今天应该打卡第${todayShouldCompleteDay}天`);
      
    } else {
      console.log('❌ 没有找到Checkin记录');
      console.log('   需要运行迁移脚本创建Checkin记录');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkSimonCheckin(); 