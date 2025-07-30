// 测试进度页面的API调用
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

async function testProgressAPI() {
  try {
    console.log('🔍 测试进度页面API...');
    
    // 1. 查找用户666
    const user666 = await User.findOne({ username: '666' });
    if (!user666) {
      console.log('❌ 找不到用户666');
      return;
    }
    
    console.log('✅ 找到用户666:', user666._id);
    
    // 2. 模拟进度页面的API逻辑
    const uploadDir = path.join(__dirname, 'uploads');
    const userId = user666._id.toString();
    const images = {};
    
    console.log('📋 模拟 /api/progress/get-checkin-image API:');
    
    // 检查每一天的照片
    for (let day = 1; day <= 7; day++) {
      const pattern = new RegExp(`^day-${day}-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
      const files = fs.readdirSync(uploadDir);
      const dayFile = files.find(f => pattern.test(f));
      
      if (dayFile) {
        const imageUrl = `http://localhost:5000/uploads/${dayFile}`;
        images[day] = imageUrl;
        console.log(`  Day ${day}: ✅ ${dayFile}`);
        console.log(`    URL: ${imageUrl}`);
      } else {
        images[day] = null;
        console.log(`  Day ${day}: ❌ 没有照片`);
      }
    }
    
    console.log('\n📋 完整的API响应:');
    console.log(JSON.stringify({ images }, null, 2));
    
    // 3. 测试目标API
    console.log('\n📋 模拟 /api/goals/get-goal API:');
    const db = mongoose.connection.db;
    const goal666 = await db.collection('goals').findOne({ userId: user666._id });
    
    if (goal666) {
      const goalResponse = {
        hasGoal: true,
        goal: {
          _id: goal666._id,
          goalContent: goal666.goalContent,
          userId: goal666.userId,
          startDate: goal666.startDate
        }
      };
      console.log('目标API响应:');
      console.log(JSON.stringify(goalResponse, null, 2));
    }
    
    // 4. 测试惩罚设置API
    console.log('\n📋 模拟 /api/user/get-punishment-settings API:');
    const PunishmentSettings = require('./models/PunishmentSettings');
    const punishment666 = await PunishmentSettings.findOne({ userId: user666._id });
    
    if (punishment666) {
      const punishmentResponse = {
        settings: {
          enabled: punishment666.enabled,
          amount: punishment666.amount,
          type: punishment666.type,
          friendContact: punishment666.friendContact
        }
      };
      console.log('惩罚设置API响应:');
      console.log(JSON.stringify(punishmentResponse, null, 2));
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testProgressAPI(); 