// 检查所有用户和他们的数据迁移情况
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

async function checkAllUsersMigration() {
  try {
    console.log('🔍 检查所有用户和迁移情况...');
    
    // 1. 获取所有用户
    const allUsers = await User.find({}).sort({ createdAt: 1 });
    console.log(`\n📋 总用户数: ${allUsers.length}`);
    
    // 2. 获取所有Checkin记录
    const allCheckins = await Checkin.find({});
    console.log(`📋 总Checkin记录数: ${allCheckins.length}`);
    
    // 3. 检查每个用户的情况
    console.log('\n👥 用户详细信息:');
    
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      console.log(`\n${i + 1}. 用户: ${user.username}`);
      console.log(`   - 用户ID: ${user._id}`);
      console.log(`   - 邮箱: ${user.email || '无'}`);
      console.log(`   - 注册时间: ${user.createdAt.toDateString()}`);
      
      // 检查是否有Checkin记录
      const checkin = allCheckins.find(c => c.userId.toString() === user._id.toString());
      
      if (checkin) {
        console.log(`   ✅ 有Checkin记录`);
        console.log(`   - Checkin ID: ${checkin._id}`);
        console.log(`   - 开始日期: ${checkin.startDate ? checkin.startDate.toDateString() : '未设置'}`);
        console.log(`   - 打卡记录数: ${checkin.checkins.length}`);
        console.log(`   - 是否完成: ${checkin.isCompleted ? '是' : '否'}`);
        
        if (checkin.checkins.length > 0) {
          console.log(`   - 打卡详情:`);
          checkin.checkins.forEach(c => {
            console.log(`     第${c.day}天: ${c.filename}`);
          });
        }
        
        // 检查今天是否可以打卡
        const todayShouldCompleteDay = checkin.getTodayShouldCompleteDay();
        console.log(`   - 今天应该打卡第${todayShouldCompleteDay}天`);
        
      } else {
        console.log(`   ❌ 没有Checkin记录`);
        
        // 检查是否有照片文件
        const uploadsDir = path.join(__dirname, 'uploads');
        const userFiles = fs.readdirSync(uploadsDir).filter(file => 
          file.includes(user._id.toString())
        );
        
        if (userFiles.length > 0) {
          console.log(`   ⚠️  但有照片文件: ${userFiles.length}个`);
          userFiles.forEach(file => {
            console.log(`     ${file}`);
          });
        } else {
          console.log(`   📝 新用户，无照片文件`);
        }
      }
    }
    
    // 4. 统计信息
    console.log('\n📊 统计信息:');
    const usersWithCheckin = allCheckins.length;
    const usersWithoutCheckin = allUsers.length - usersWithCheckin;
    
    console.log(`   - 有Checkin记录的用户: ${usersWithCheckin}`);
    console.log(`   - 没有Checkin记录的用户: ${usersWithoutCheckin}`);
    console.log(`   - 迁移完成率: ${((usersWithCheckin / allUsers.length) * 100).toFixed(1)}%`);
    
    // 5. 检查是否有未迁移的数据
    if (usersWithoutCheckin > 0) {
      console.log('\n⚠️  需要迁移的用户:');
      allUsers.forEach(user => {
        const checkin = allCheckins.find(c => c.userId.toString() === user._id.toString());
        if (!checkin) {
          console.log(`   - ${user.username} (${user._id})`);
        }
      });
    } else {
      console.log('\n✅ 所有用户数据都已迁移完成！');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAllUsersMigration(); 