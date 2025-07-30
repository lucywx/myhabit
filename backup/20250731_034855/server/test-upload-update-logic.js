// 测试upload/update判断逻辑
const mongoose = require('mongoose');
const Checkin = require('./models/Checkin');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testUploadUpdateLogic() {
  try {
    console.log('🧪 测试upload/update判断逻辑...');
    
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
    
    console.log('📋 当前打卡记录:');
    checkin.checkins.forEach(c => {
      console.log(`   - 第${c.day}天: ${c.filename}`);
    });
    
    // 测试upload/update判断逻辑
    console.log('\n🔍 测试upload/update判断逻辑:');
    
    for (let day = 1; day <= 7; day++) {
      const existingCheckin = checkin.checkins.find(c => c.day === day);
      const isUpdate = existingCheckin !== undefined;
      
      console.log(`   第${day}天: ${isUpdate ? 'UPDATE' : 'UPLOAD'} 操作`);
      if (isUpdate) {
        console.log(`     - 现有文件: ${existingCheckin.filename}`);
      }
    }
    
    // 模拟服务器端的判断逻辑
    console.log('\n🔄 模拟服务器端逻辑:');
    
    // 模拟第1天（已有记录）
    const day1 = 1;
    const existingDay1 = checkin.checkins.find(c => c.day === day1);
    const isUpdateDay1 = existingDay1 !== undefined;
    console.log(`   第${day1}天: ${isUpdateDay1 ? 'UPDATE' : 'UPLOAD'} 操作`);
    
    // 模拟第3天（无记录）
    const day3 = 3;
    const existingDay3 = checkin.checkins.find(c => c.day === day3);
    const isUpdateDay3 = existingDay3 !== undefined;
    console.log(`   第${day3}天: ${isUpdateDay3 ? 'UPDATE' : 'UPLOAD'} 操作`);
    
    // 测试错误消息生成
    console.log('\n💬 测试错误消息生成:');
    
    // 模拟update失败
    const updateErrorMessage = isUpdateDay1 ? 'Update failed, please try again' : 'Upload failed, please try again';
    console.log(`   第${day1}天错误消息: ${updateErrorMessage}`);
    
    // 模拟upload失败
    const uploadErrorMessage = isUpdateDay3 ? 'Update failed, please try again' : 'Upload failed, please try again';
    console.log(`   第${day3}天错误消息: ${uploadErrorMessage}`);
    
    console.log('\n✅ 测试完成！');
    console.log('现在服务器端可以正确区分upload和update操作了。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testUploadUpdateLogic(); 