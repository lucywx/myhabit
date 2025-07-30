// 检查用户555的数据
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

async function checkUser555() {
  try {
    console.log('🔍 检查用户555的数据...');
    
    // 1. 查找用户555
    console.log('\n📋 步骤1: 查找用户555');
    const user555 = await User.findOne({ username: '555' });
    if (user555) {
      console.log('✅ 找到用户555:');
      console.log('   - 用户ID:', user555._id);
      console.log('   - 用户名:', user555.username);
      console.log('   - 邮箱:', user555.email);
      console.log('   - 创建时间:', user555.createdAt);
    } else {
      console.log('❌ 数据库中没有用户555');
      return;
    }
    
    // 2. 查找用户555的目标
    console.log('\n📋 步骤2: 查找用户555的目标');
    const db = mongoose.connection.db;
    const goal555 = await db.collection('goals').findOne({ userId: user555._id });
    if (goal555) {
      console.log('✅ 用户555有目标:');
      console.log('   - 目标内容:', goal555.goalContent);
      console.log('   - 目标ID:', goal555._id);
      console.log('   - 开始日期:', goal555.startDate);
      console.log('   - 完整目标对象:', JSON.stringify(goal555, null, 2));
    } else {
      console.log('❌ 用户555没有目标数据');
    }
    
    // 3. 查找用户555的惩罚设置
    console.log('\n📋 步骤3: 查找用户555的惩罚设置');
    try {
      const PunishmentSettings = require('./models/PunishmentSettings');
      const punishment555 = await PunishmentSettings.findOne({ userId: user555._id });
      if (punishment555) {
        console.log('✅ 用户555有惩罚设置:');
        console.log('   - 是否启用:', punishment555.enabled);
        console.log('   - 惩罚金额:', punishment555.amount);
        console.log('   - 惩罚类型:', punishment555.type);
        console.log('   - 朋友联系方式:', punishment555.friendContact);
      } else {
        console.log('❌ 用户555没有惩罚设置');
      }
    } catch (error) {
      console.log('❌ PunishmentSettings模型不存在:', error.message);
    }
    
    // 4. 检查用户555的照片
    console.log('\n📋 步骤4: 检查用户555的照片');
    const uploadsDir = path.join(__dirname, 'uploads');
    const user555Files = fs.readdirSync(uploadsDir).filter(file => 
      file.includes(user555._id.toString())
    );
    
    if (user555Files.length > 0) {
      console.log('✅ 用户555有照片文件:');
      user555Files.forEach((file, index) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   ${index + 1}. ${file}`);
        console.log(`      大小: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`      创建时间: ${stats.birthtime}`);
      });
    } else {
      console.log('❌ 用户555没有照片文件');
    }
    
    // 5. 模拟My Habits页面的API调用
    console.log('\n📋 步骤5: 模拟My Habits页面的API调用');
    
    // 模拟目标API
    if (goal555) {
      const goalResponse = {
        hasGoal: true,
        goal: {
          _id: goal555._id,
          goalContent: goal555.goalContent,
          userId: goal555.userId,
          startDate: goal555.startDate || null
        }
      };
      console.log('目标API响应:');
      console.log(JSON.stringify(goalResponse, null, 2));
    }
    
    // 模拟图片API
    const images = {};
    for (let day = 1; day <= 7; day++) {
      const pattern = new RegExp(`^day-${day}-${user555._id.toString()}-\\d+\\.(jpg|jpeg|png|gif)$`);
      const files = fs.readdirSync(uploadsDir);
      const dayFile = files.find(f => pattern.test(f));
      
      if (dayFile) {
        images[day] = `http://localhost:5000/uploads/${dayFile}`;
      } else {
        images[day] = null;
      }
    }
    
    const imagesResponse = { images };
    console.log('图片API响应:');
    console.log(JSON.stringify(imagesResponse, null, 2));
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser555(); 