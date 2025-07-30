// 迁移现有数据到新的Checkin模型
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Checkin = require('./models/Checkin');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function migrateToCheckinModel() {
  try {
    console.log('🔧 开始迁移数据到Checkin模型...');
    
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    
    // 按用户分组文件
    const userFiles = {};
    
    files.forEach(file => {
      // 匹配 day-{day}-{userId}-{timestamp}.{ext} 格式
      const match = file.match(/^day-(\d+)-([a-f0-9]{24})-(\d+)\.(jpg|jpeg|png|gif)$/);
      if (match) {
        const [, day, userId, timestamp, ext] = match;
        if (!userFiles[userId]) {
          userFiles[userId] = [];
        }
        userFiles[userId].push({
          day: parseInt(day),
          filename: file,
          timestamp: parseInt(timestamp),
          ext
        });
      }
    });
    
    console.log(`📋 找到 ${Object.keys(userFiles).length} 个用户的打卡数据`);
    
    // 为每个用户创建Checkin记录
    for (const [userId, userFileList] of Object.entries(userFiles)) {
      console.log(`\n👤 处理用户 ${userId}...`);
      
      // 按天数排序
      userFileList.sort((a, b) => a.day - b.day);
      
      // 检查用户是否存在
      const user = await User.findById(userId);
      if (!user) {
        console.log(`❌ 用户 ${userId} 不存在，跳过`);
        continue;
      }
      
      console.log(`✅ 用户存在: ${user.username}`);
      
      // 检查是否已经有Checkin记录
      let checkin = await Checkin.findByUserId(userId);
      if (checkin) {
        console.log(`⚠️  用户 ${user.username} 已有Checkin记录，跳过`);
        continue;
      }
      
      // 创建新的Checkin记录
      checkin = new Checkin({
        userId,
        startDate: null, // 稍后设置
        checkins: [],
        totalDays: 7
      });
      
      // 设置startDate为第1天的时间
      if (userFileList.length > 0) {
        const firstDay = userFileList[0];
        const firstDayDate = new Date(firstDay.timestamp);
        firstDayDate.setHours(0, 0, 0, 0);
        checkin.startDate = firstDayDate;
        console.log(`📅 设置startDate为: ${firstDayDate.toDateString()}`);
      }
      
      // 添加所有打卡记录
      for (const fileInfo of userFileList) {
        const imageUrl = `http://localhost:5000/uploads/${fileInfo.filename}`;
        
        checkin.checkins.push({
          day: fileInfo.day,
          imageUrl,
          filename: fileInfo.filename,
          uploadedAt: new Date(fileInfo.timestamp)
        });
        
        console.log(`✅ 添加第${fileInfo.day}天打卡记录`);
      }
      
      // 检查是否完成
      if (checkin.checkins.length === checkin.totalDays) {
        checkin.isCompleted = true;
        console.log(`🎉 用户 ${user.username} 已完成所有打卡`);
      }
      
      // 保存Checkin记录
      await checkin.save();
      console.log(`✅ 用户 ${user.username} 的Checkin记录已保存`);
    }
    
    console.log('\n🎉 迁移完成！');
    
    // 验证迁移结果
    console.log('\n📊 迁移结果统计:');
    const totalCheckins = await Checkin.countDocuments();
    console.log(`总Checkin记录数: ${totalCheckins}`);
    
    const completedCheckins = await Checkin.countDocuments({ isCompleted: true });
    console.log(`已完成打卡的用户数: ${completedCheckins}`);
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateToCheckinModel(); 