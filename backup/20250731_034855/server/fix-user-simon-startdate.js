// 修复用户simon的startDate，基于第1天照片的上传时间
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function fixUserSimonStartDate() {
  try {
    console.log('🔧 修复用户simon的startDate...');
    
    // 查找用户simon
    const User = require('./models/User');
    const userSimon = await User.findOne({ username: 'simon' });
    
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 读取第1天照片的信息文件
    const infoFile = path.join(__dirname, 'uploads', 'day-1-68876e5bae34133a6f4dec0b-info.json');
    if (fs.existsSync(infoFile)) {
      const infoData = JSON.parse(fs.readFileSync(infoFile, 'utf8'));
      console.log('📋 第1天照片信息:', infoData);
      
      // 从uploadedAt时间提取日期
      const uploadedAt = new Date(infoData.uploadedAt);
      const startDate = new Date(uploadedAt);
      startDate.setHours(0, 0, 0, 0); // 设置为当天的00:00:00
      
      console.log('📅 基于上传时间设置startDate为:', startDate.toISOString());
      console.log('📅 基于上传时间设置startDate为:', startDate.toDateString());
      
      // 更新数据库
      const db = mongoose.connection.db;
      const result = await db.collection('goals').updateOne(
        { userId: userSimon._id },
        { $set: { startDate: startDate } }
      );
      
      if (result.modifiedCount > 0) {
        console.log('✅ 成功设置startDate');
        
        // 验证更新
        const updatedGoal = await db.collection('goals').findOne({ userId: userSimon._id });
        console.log('📋 更新后的目标数据:');
        console.log(JSON.stringify(updatedGoal, null, 2));
        
        // 计算今天的打卡逻辑
        const now = new Date();
        const timeDiff = now.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        const canCheckinDay = daysDiff + 1;
        
        console.log('\n📊 打卡逻辑验证:');
        console.log('   - 开始日期:', startDate.toDateString());
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
    } else {
      console.log('❌ 找不到第1天照片信息文件');
    }
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixUserSimonStartDate(); 