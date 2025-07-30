// 专门检查用户666的照片上传数据
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

async function checkUser666Photos() {
  try {
    console.log('🔍 检查用户666的照片上传数据...');
    
    // 1. 查找用户666
    console.log('\n📋 步骤1: 查找用户666');
    const user666 = await User.findOne({ username: '666' });
    if (user666) {
      console.log('✅ 找到用户666:');
      console.log('   - 用户ID:', user666._id);
      console.log('   - 用户名:', user666.username);
    } else {
      console.log('❌ 数据库中没有用户666');
      return;
    }
    
    // 2. 检查uploads目录中的照片文件
    console.log('\n📋 步骤2: 检查uploads目录中的照片文件');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`✅ uploads目录存在，包含 ${files.length} 个文件:`);
      
      // 查找用户666相关的照片文件
      const user666Files = files.filter(file => 
        file.includes('666') || 
        file.includes(user666._id.toString()) ||
        file.includes('day-1') ||
        file.includes('day-2') ||
        file.includes('day-3') ||
        file.includes('day-4') ||
        file.includes('day-5') ||
        file.includes('day-6') ||
        file.includes('day-7')
      );
      
      if (user666Files.length > 0) {
        console.log('✅ 找到用户666相关的照片文件:');
        user666Files.forEach((file, index) => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          console.log(`   ${index + 1}. ${file}`);
          console.log(`      大小: ${(stats.size / 1024).toFixed(2)} KB`);
          console.log(`      创建时间: ${stats.birthtime}`);
          console.log(`      修改时间: ${stats.mtime}`);
        });
      } else {
        console.log('❌ 没有找到用户666相关的照片文件');
      }
      
      // 显示所有文件（用于调试）
      console.log('\n📋 所有uploads文件:');
      files.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
    } else {
      console.log('❌ uploads目录不存在');
    }
    
    // 3. 检查数据库中的照片记录（如果有相关集合）
    console.log('\n📋 步骤3: 检查数据库中的照片记录');
    try {
      const db = mongoose.connection.db;
      
      // 检查是否有专门的图片集合
      const collections = await db.listCollections().toArray();
      console.log('数据库中的集合:', collections.map(c => c.name));
      
      // 检查progress相关的数据
      const progressData = await db.collection('progress').find({}).toArray();
      if (progressData.length > 0) {
        console.log('✅ 找到progress数据:');
        progressData.forEach((item, index) => {
          console.log(`   ${index + 1}.`, JSON.stringify(item, null, 2));
        });
      } else {
        console.log('❌ 没有找到progress数据');
      }
      
    } catch (error) {
      console.log('❌ 检查数据库记录时出错:', error.message);
    }
    
    // 4. 检查目标数据中的startDate
    console.log('\n📋 步骤4: 检查目标数据中的startDate');
    const db = mongoose.connection.db;
    const goal666 = await db.collection('goals').findOne({ userId: user666._id });
    
    if (goal666) {
      console.log('✅ 用户666的目标数据:');
      console.log('   - startDate:', goal666.startDate);
      console.log('   - 完整目标对象:', JSON.stringify(goal666, null, 2));
      
      if (goal666.startDate) {
        console.log('✅ 用户666已经设置了startDate，说明已经上传过第一张照片');
      } else {
        console.log('❌ 用户666还没有设置startDate，说明还没有上传过照片');
      }
    } else {
      console.log('❌ 找不到用户666的目标数据');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser666Photos(); 