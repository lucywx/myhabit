// 手动设置用户666的startDate
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function setUser666StartDate() {
  try {
    console.log('🔍 设置用户666的startDate...');
    
    // 1. 查找用户666
    const user666 = await User.findOne({ username: '666' });
    if (!user666) {
      console.log('❌ 找不到用户666');
      return;
    }
    
    console.log('✅ 找到用户666:', user666._id);
    
    // 2. 直接更新数据库中的目标数据
    const db = mongoose.connection.db;
    const today = new Date().toISOString().slice(0, 10);
    
    console.log('📅 设置startDate为:', today);
    
    const result = await db.collection('goals').updateOne(
      { userId: user666._id },
      { $set: { startDate: today } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ 成功设置startDate');
    } else {
      console.log('❌ 设置startDate失败');
    }
    
    // 3. 验证更新结果
    const updatedGoal = await db.collection('goals').findOne({ userId: user666._id });
    if (updatedGoal) {
      console.log('✅ 验证更新结果:');
      console.log('   - startDate:', updatedGoal.startDate);
      console.log('   - 目标内容:', updatedGoal.goalContent);
    }
    
  } catch (error) {
    console.error('❌ 设置失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

setUser666StartDate(); 