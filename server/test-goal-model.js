// 测试Goal模型的新配置
const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function testGoalModel() {
  try {
    console.log('🔍 测试Goal模型配置...');
    
    // 1. 查找用户666
    const user666 = await User.findOne({ username: '666' });
    if (!user666) {
      console.log('❌ 找不到用户666');
      return;
    }
    
    console.log('✅ 找到用户666:', user666._id);
    
    // 2. 使用Mongoose模型查找Goal数据
    const goalByModel = await Goal.findOne({ userId: user666._id });
    if (goalByModel) {
      console.log('📋 通过Mongoose模型获取的Goal数据:');
      console.log('   - _id:', goalByModel._id);
      console.log('   - userId:', goalByModel.userId);
      console.log('   - goalContent:', goalByModel.goalContent);
      console.log('   - startDate:', goalByModel.startDate);
      console.log('   - 所有字段:', Object.keys(goalByModel.toObject()));
    }
    
    // 3. 直接查询数据库
    const db = mongoose.connection.db;
    const goalByDb = await db.collection('goals').findOne({ userId: user666._id });
    if (goalByDb) {
      console.log('\n📋 直接查询数据库的Goal数据:');
      console.log('   - _id:', goalByDb._id);
      console.log('   - userId:', goalByDb.userId);
      console.log('   - goalContent:', goalByDb.goalContent);
      console.log('   - startDate:', goalByDb.startDate);
      console.log('   - dailyTarget:', goalByDb.dailyTarget);
      console.log('   - days:', goalByDb.days);
      console.log('   - dayGoals:', goalByDb.dayGoals);
      console.log('   - punishment:', goalByDb.punishment);
      console.log('   - 所有字段:', Object.keys(goalByDb));
    }
    
    // 4. 测试API响应格式
    console.log('\n📋 模拟API响应格式:');
    const apiResponse = {
      hasGoal: true,
      goal: {
        _id: goalByModel._id,
        goalContent: goalByModel.goalContent,
        userId: goalByModel.userId,
        startDate: goalByModel.startDate || null
      }
    };
    console.log(JSON.stringify(apiResponse, null, 2));
    
    // 5. 测试strict: false是否工作
    console.log('\n📋 测试strict: false配置:');
    console.log('   - 模型定义字段:', Object.keys(Goal.schema.paths));
    console.log('   - 数据库中实际字段:', Object.keys(goalByDb));
    console.log('   - 模型能否访问未定义字段:', goalByModel.dailyTarget !== undefined);
    console.log('   - 模型能否访问未定义字段:', goalByModel.punishment !== undefined);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

testGoalModel(); 