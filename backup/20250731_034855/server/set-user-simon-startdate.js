// 设置用户simon的startDate
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function setUserSimonStartDate() {
  try {
    console.log('🔧 设置用户simon的startDate...');
    
    // 查找用户simon
    const User = require('./models/User');
    const userSimon = await User.findOne({ username: 'simon' });
    
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 设置startDate为昨天（因为用户已经上传了第1天的照片）
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // 设置为当天的00:00:00
    
    console.log('📅 设置startDate为:', yesterday.toISOString());
    console.log('📅 设置startDate为:', yesterday.toDateString());
    
    // 更新数据库
    const db = mongoose.connection.db;
    const result = await db.collection('goals').updateOne(
      { userId: userSimon._id },
      { $set: { startDate: yesterday } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ 成功设置startDate');
      
      // 验证更新
      const updatedGoal = await db.collection('goals').findOne({ userId: userSimon._id });
      console.log('📋 更新后的目标数据:');
      console.log(JSON.stringify(updatedGoal, null, 2));
      
      // 计算今天的打卡逻辑
      const now = new Date();
      const timeDiff = now.getTime() - yesterday.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      const canCheckinDay = daysDiff + 1;
      
      console.log('\n📊 打卡逻辑验证:');
      console.log('   - 开始日期:', yesterday.toDateString());
      console.log('   - 当前日期:', now.toDateString());
      console.log('   - 天数差:', daysDiff);
      console.log('   - 今天可以打卡第几天:', canCheckinDay);
      console.log('   - 已经打卡天数: 1');
      
      if (canCheckinDay === 2) {
        console.log('   ✅ 今天可以打卡第2天！');
      } else {
        console.log('   ❌ 打卡逻辑有问题');
      }
      
    } else {
      console.log('❌ 设置startDate失败');
    }
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

setUserSimonStartDate(); 