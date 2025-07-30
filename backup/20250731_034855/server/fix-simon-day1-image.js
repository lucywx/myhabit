// 修复simon第1天图片的问题
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

async function fixSimonDay1Image() {
  try {
    console.log('🔧 修复simon第1天图片问题...');
    
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
    
    // 检查uploads目录中的simon文件
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    const simonDay1Files = files.filter(f => 
      f.includes(userSimon._id.toString()) && 
      f.startsWith('day-1-') && 
      f.endsWith('.jpeg')
    );
    
    console.log('📁 找到的simon第1天文件:');
    simonDay1Files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   - ${file} (${stats.size} bytes, ${stats.mtime})`);
    });
    
    if (simonDay1Files.length === 0) {
      console.log('❌ 没有找到simon的第1天图片文件');
      return;
    }
    
    // 选择最新的第1天文件
    const latestDay1File = simonDay1Files[simonDay1Files.length - 1];
    console.log(`\n🎯 选择最新的第1天文件: ${latestDay1File}`);
    
    // 构建正确的URL
    const imageUrl = `http://localhost:5000/uploads/${latestDay1File}`;
    console.log(`   - 图片URL: ${imageUrl}`);
    
    // 更新Checkin记录
    const day1CheckinIndex = checkin.checkins.findIndex(c => c.day === 1);
    if (day1CheckinIndex !== -1) {
      checkin.checkins[day1CheckinIndex] = {
        day: 1,
        imageUrl: imageUrl,
        filename: latestDay1File,
        uploadedAt: new Date()
      };
      
      await checkin.save();
      console.log('✅ 成功更新第1天打卡记录');
      
      // 验证更新
      const updatedCheckin = await Checkin.findByUserId(userSimon._id);
      const updatedDay1 = updatedCheckin.checkins.find(c => c.day === 1);
      console.log(`   - 更新后的文件名: ${updatedDay1.filename}`);
      console.log(`   - 更新后的URL: ${updatedDay1.imageUrl}`);
      
    } else {
      console.log('❌ 没有找到第1天打卡记录');
    }
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixSimonDay1Image(); 