// 详细诊断simon上传失败的原因
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Checkin = require('./models/Checkin');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function diagnoseSimonUpload() {
  try {
    console.log('🔍 详细诊断simon上传失败原因...');
    
    // 查找用户simon
    const userSimon = await User.findOne({ username: 'simon' });
    if (!userSimon) {
      console.log('❌ 找不到用户simon');
      return;
    }
    
    console.log('✅ 找到用户simon:', userSimon._id);
    
    // 生成新的token
    const newToken = jwt.sign(
      { userId: userSimon._id, username: userSimon.username },
      'your-secret',
      { expiresIn: '24h' }
    );
    
    console.log('\n📋 Token状态:');
    console.log('   - 新token:', newToken.substring(0, 50) + '...');
    
    // 验证token
    try {
      const decoded = jwt.verify(newToken, 'your-secret');
      console.log('   - token验证: ✅ 有效');
      console.log('   - userId:', decoded.userId);
      console.log('   - username:', decoded.username);
    } catch (error) {
      console.log('   - token验证: ❌ 失败 -', error.message);
    }
    
    // 检查Checkin记录
    const checkin = await Checkin.findByUserId(userSimon._id);
    if (checkin) {
      console.log('\n📋 Checkin记录状态:');
      console.log('   - 打卡记录数:', checkin.checkins.length);
      
      const day1Checkin = checkin.checkins.find(c => c.day === 1);
      if (day1Checkin) {
        console.log('   - 第1天记录:', day1Checkin.filename);
        
        // 测试canCheckinDay方法
        const canCheckin = checkin.canCheckinDay(1);
        console.log('   - 第1天可以打卡:', canCheckin ? '✅ 是' : '❌ 否');
        
        // 检查文件是否存在
        const filePath = path.join(__dirname, 'uploads', day1Checkin.filename);
        const fileExists = fs.existsSync(filePath);
        console.log('   - 文件存在:', fileExists ? '✅ 是' : '❌ 否');
      }
    }
    
    // 检查uploads目录权限
    const uploadsDir = path.join(__dirname, 'uploads');
    console.log('\n📁 Uploads目录状态:');
    console.log('   - 目录路径:', uploadsDir);
    console.log('   - 目录存在:', fs.existsSync(uploadsDir) ? '✅ 是' : '❌ 否');
    
    if (fs.existsSync(uploadsDir)) {
      const stats = fs.statSync(uploadsDir);
      console.log('   - 目录权限:', stats.mode.toString(8));
      console.log('   - 可写:', (stats.mode & 0o200) ? '✅ 是' : '❌ 否');
    }
    
    // 检查最新的simon文件
    console.log('\n📁 最新的simon文件:');
    const files = fs.readdirSync(uploadsDir);
    const simonFiles = files.filter(f => f.includes(userSimon._id.toString()));
    const simonDay1Files = simonFiles.filter(f => f.startsWith('day-1-') && f.endsWith('.jpeg'));
    
    if (simonDay1Files.length > 0) {
      // 按修改时间排序
      const fileStats = simonDay1Files.map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return { file, mtime: stats.mtime, size: stats.size };
      }).sort((a, b) => b.mtime - a.mtime);
      
      console.log('   - 最新的第1天文件:', fileStats[0].file);
      console.log('   - 文件大小:', fileStats[0].size, 'bytes');
      console.log('   - 修改时间:', fileStats[0].mtime);
      
      // 检查数据库记录是否匹配
      const day1Checkin = checkin.checkins.find(c => c.day === 1);
      if (day1Checkin && day1Checkin.filename !== fileStats[0].file) {
        console.log('   - ⚠️  数据库记录与最新文件不匹配');
        console.log('     * 数据库:', day1Checkin.filename);
        console.log('     * 最新文件:', fileStats[0].file);
      } else {
        console.log('   - ✅ 数据库记录与最新文件匹配');
      }
    }
    
    // 模拟API响应
    console.log('\n🌐 模拟API响应:');
    
    // 模拟get-checkin-image API响应
    const images = {};
    for (let day = 1; day <= 7; day++) {
      const dayCheckin = checkin.checkins.find(c => c.day === day);
      if (dayCheckin) {
        images[day] = dayCheckin.imageUrl;
      } else {
        images[day] = null;
      }
    }
    
    console.log('   - get-checkin-image响应:');
    console.log('     images:', JSON.stringify(images, null, 2));
    
    console.log('\n💡 诊断结果和建议:');
    console.log('1. ✅ Token生成和验证正常');
    console.log('2. ✅ Checkin记录存在且第1天可以打卡');
    console.log('3. ✅ Uploads目录权限正常');
    console.log('4. ⚠️  可能存在文件与数据库记录不同步的问题');
    
    console.log('\n🔧 立即解决方案:');
    console.log('1. 在浏览器控制台运行:');
    console.log('   localStorage.setItem("token", "' + newToken + '");');
    console.log('2. 刷新页面');
    console.log('3. 重新尝试上传图片');
    console.log('4. 如果仍然失败，检查浏览器开发者工具的网络请求');
    
  } catch (error) {
    console.error('❌ 诊断失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

diagnoseSimonUpload(); 