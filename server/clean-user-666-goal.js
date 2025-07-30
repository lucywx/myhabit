// 清理用户666的Goal数据，只保留必要字段
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function cleanUser666Goal() {
  try {
    console.log('🔍 清理用户666的Goal数据...');
    
    // 1. 查找用户666
    const user666 = await User.findOne({ username: '666' });
    if (!user666) {
      console.log('❌ 找不到用户666');
      return;
    }
    
    console.log('✅ 找到用户666:', user666._id);
    
    // 2. 查看当前的Goal数据
    const db = mongoose.connection.db;
    const currentGoal = await db.collection('goals').findOne({ userId: user666._id });
    
    if (!currentGoal) {
      console.log('❌ 找不到用户666的Goal数据');
      return;
    }
    
    console.log('📋 当前的Goal数据:');
    console.log(JSON.stringify(currentGoal, null, 2));
    
    // 3. 清理数据，只保留必要字段
    const cleanedGoal = {
      _id: currentGoal._id,
      userId: currentGoal.userId,
      goalContent: currentGoal.goalContent,
      startDate: currentGoal.startDate // 保留startDate，因为进度页面需要
    };
    
    console.log('📋 清理后的Goal数据:');
    console.log(JSON.stringify(cleanedGoal, null, 2));
    
    // 4. 更新数据库
    const result = await db.collection('goals').replaceOne(
      { _id: currentGoal._id },
      cleanedGoal
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ 成功清理Goal数据');
    } else {
      console.log('❌ 清理Goal数据失败');
    }
    
    // 5. 验证更新结果
    const updatedGoal = await db.collection('goals').findOne({ userId: user666._id });
    if (updatedGoal) {
      console.log('✅ 验证更新结果:');
      console.log('   - _id:', updatedGoal._id);
      console.log('   - userId:', updatedGoal.userId);
      console.log('   - goalContent:', updatedGoal.goalContent);
      console.log('   - startDate:', updatedGoal.startDate);
      console.log('   - 其他字段:', Object.keys(updatedGoal).filter(key => !['_id', 'userId', 'goalContent', 'startDate', '__v'].includes(key)));
    }
    
  } catch (error) {
    console.error('❌ 清理失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanUser666Goal(); 