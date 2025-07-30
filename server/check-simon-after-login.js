// 检查simon重新登录后的数据状态
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

async function checkSimonAfterLogin() {
  try {
    console.log('🔍 检查simon重新登录后的数据状态...');
    
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
    console.log('\n📋 打卡记录详情:');
    checkin.checkins.forEach(c => {
      console.log(`   - 第${c.day}天: ${c.filename} (${c.imageUrl})`);
    });
    
    // 检查uploads目录中的文件
    const uploadsDir = path.join(__dirname, 'uploads');
    console.log('\n📁 检查uploads目录:');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const simonFiles = files.filter(f => f.includes(userSimon._id.toString()));
      
      console.log(`   - 总文件数: ${files.length}`);
      console.log(`   - simon的文件数: ${simonFiles.length}`);
      
      if (simonFiles.length > 0) {
        console.log('   - simon的文件列表:');
        simonFiles.forEach(file => {
          console.log(`     * ${file}`);
        });
      }
    } else {
      console.log('   - uploads目录不存在');
    }
    
    // 检查第1天的图片是否存在
    const day1Checkin = checkin.checkins.find(c => c.day === 1);
    if (day1Checkin) {
      console.log('\n📋 第1天图片状态:');
      console.log(`   - 数据库记录: ${day1Checkin.filename}`);
      console.log(`   - 图片URL: ${day1Checkin.imageUrl}`);
      
      // 检查文件是否实际存在
      const filePath = path.join(uploadsDir, day1Checkin.filename);
      if (fs.existsSync(filePath)) {
        console.log('   - 文件存在: ✅');
        const stats = fs.statSync(filePath);
        console.log(`   - 文件大小: ${stats.size} bytes`);
        console.log(`   - 修改时间: ${stats.mtime}`);
      } else {
        console.log('   - 文件不存在: ❌');
      }
    } else {
      console.log('\n❌ 没有找到第1天打卡记录');
    }
    
    // 模拟前端API调用
    console.log('\n🌐 模拟前端API调用:');
    
    // 模拟get-checkin-image API
    const images = {};
    for (let day = 1; day <= 7; day++) {
      const dayCheckin = checkin.checkins.find(c => c.day === day);
      if (dayCheckin) {
        images[day] = dayCheckin.imageUrl;
      } else {
        images[day] = null;
      }
    }
    
    console.log('   - get-checkin-image API响应:');
    console.log('     images:', images);
    
    // 检查第1天图片URL是否可访问
    if (images[1]) {
      console.log(`   - 第1天图片URL: ${images[1]}`);
      console.log('   - 前端应该能显示这张图片');
    } else {
      console.log('   - 第1天图片URL为null，前端不会显示图片');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkSimonAfterLogin(); 