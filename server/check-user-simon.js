// 检查用户simon的数据
const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function checkUserSimon() {
  try {
    console.log('🔍 检查用户simon的数据...');
    
    // 1. 查找用户simon
    console.log('\n📋 步骤1: 查找用户simon');
    const userSimon = await User.findOne({ username: 'simon' });
    if (userSimon) {
      console.log('✅ 找到用户simon:');
      console.log('   - 用户ID:', userSimon._id);
      console.log('   - 用户名:', userSimon.username);
      console.log('   - 邮箱:', userSimon.email);
      console.log('   - 创建时间:', userSimon.createdAt);
    } else {
      console.log('❌ 数据库中没有用户simon');
      return;
    }
    
    // 2. 查找用户simon的目标
    console.log('\n📋 步骤2: 查找用户simon的目标');
    const db = mongoose.connection.db;
    const goalSimon = await db.collection('goals').findOne({ userId: userSimon._id });
    if (goalSimon) {
      console.log('✅ 用户simon有目标:');
      console.log('   - 目标内容:', goalSimon.goalContent);
      console.log('   - 目标ID:', goalSimon._id);
      console.log('   - 开始日期:', goalSimon.startDate);
      console.log('   - 完整目标对象:', JSON.stringify(goalSimon, null, 2));
    } else {
      console.log('❌ 用户simon没有目标数据');
    }
    
    // 3. 查找用户simon的惩罚设置
    console.log('\n📋 步骤3: 查找用户simon的惩罚设置');
    try {
      const PunishmentSettings = require('./models/PunishmentSettings');
      const punishmentSimon = await PunishmentSettings.findOne({ userId: userSimon._id });
      if (punishmentSimon) {
        console.log('✅ 用户simon有惩罚设置:');
        console.log('   - 是否启用:', punishmentSimon.enabled);
        console.log('   - 惩罚金额:', punishmentSimon.amount);
        console.log('   - 惩罚类型:', punishmentSimon.type);
        console.log('   - 朋友联系方式:', punishmentSimon.friendContact);
      } else {
        console.log('❌ 用户simon没有惩罚设置');
      }
    } catch (error) {
      console.log('❌ PunishmentSettings模型不存在:', error.message);
    }
    
    // 4. 检查用户simon的照片
    console.log('\n📋 步骤4: 检查用户simon的照片');
    const uploadsDir = path.join(__dirname, 'uploads');
    const userSimonFiles = fs.readdirSync(uploadsDir).filter(file => 
      file.includes(userSimon._id.toString())
    );
    
    if (userSimonFiles.length > 0) {
      console.log('✅ 用户simon有照片文件:');
      userSimonFiles.forEach((file, index) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   ${index + 1}. ${file}`);
        console.log(`      大小: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`      创建时间: ${stats.birthtime}`);
        console.log(`      修改时间: ${stats.mtime}`);
      });
    } else {
      console.log('❌ 用户simon没有照片文件');
    }
    
    // 5. 计算打卡逻辑
    console.log('\n📋 步骤5: 计算打卡逻辑');
    const now = new Date();
    console.log('   - 当前时间:', now.toISOString());
    console.log('   - 当前日期:', now.toDateString());
    
    if (goalSimon && goalSimon.startDate) {
      const startDate = new Date(goalSimon.startDate);
      console.log('   - 开始日期:', startDate.toISOString());
      console.log('   - 开始日期:', startDate.toDateString());
      
      // 计算天数差
      const timeDiff = now.getTime() - startDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      console.log('   - 天数差:', daysDiff);
      
      // 检查是否可以打卡
      const canCheckinDay = daysDiff + 1; // 第几天可以打卡
      console.log('   - 今天可以打卡第几天:', canCheckinDay);
      
      // 检查已经打卡的天数
      const checkinCount = userSimonFiles.filter(file => 
        file.match(/^day-\d+-\d+-\d+\.(jpg|jpeg|png|gif)$/)
      ).length;
      console.log('   - 已经打卡天数:', checkinCount);
      
      if (canCheckinDay > checkinCount) {
        console.log('   ✅ 可以打卡第', canCheckinDay, '天');
      } else if (canCheckinDay < checkinCount) {
        console.log('   ❌ 不能提前打卡，应该打卡第', canCheckinDay, '天，但已经打卡了', checkinCount, '天');
      } else {
        console.log('   ⚠️  今天已经打卡了');
      }
    } else {
      console.log('   ❌ 没有开始日期，无法计算打卡逻辑');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUserSimon(); 