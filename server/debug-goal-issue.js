const mongoose = require('mongoose');
const Goal = require('./models/Goal');
const User = require('./models/User');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  debugGoalIssue();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function debugGoalIssue() {
  try {
    console.log('🔍 调试目标数据问题...\n');
    
    // 1. 检查数据库连接
    console.log('1. 数据库连接状态:', mongoose.connection.readyState);
    console.log('   数据库名称:', mongoose.connection.name);
    console.log('');
    
    // 2. 检查Goal集合是否存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    const goalCollectionExists = collections.some(col => col.name === 'goals');
    console.log('2. Goal集合是否存在:', goalCollectionExists);
    console.log('   所有集合:', collections.map(col => col.name));
    console.log('');
    
    // 3. 检查用户111
    const user111 = await User.findOne({ username: '111' });
    console.log('3. 用户111状态:');
    if (user111) {
      console.log('   ✅ 用户存在');
      console.log('   用户ID:', user111._id);
      console.log('   用户名:', user111.username);
      console.log('   创建时间:', user111.createdAt);
    } else {
      console.log('   ❌ 用户不存在');
    }
    console.log('');
    
    // 4. 检查目标数据
    const allGoals = await Goal.find({});
    console.log('4. 目标数据状态:');
    console.log('   总目标数量:', allGoals.length);
    
    if (allGoals.length > 0) {
      console.log('   目标详情:');
      allGoals.forEach((goal, index) => {
        console.log(`   ${index + 1}. 目标ID: ${goal._id}`);
        console.log(`      用户ID: ${goal.userId}`);
        console.log(`      内容: ${goal.goalContent}`);
        console.log(`      创建时间: ${goal.createdAt}`);
        console.log('');
      });
    }
    
    // 5. 检查是否有目标数据但用户ID不匹配
    if (user111) {
      const goalForUser111 = await Goal.findOne({ userId: user111._id });
      console.log('5. 用户111的目标检查:');
      if (goalForUser111) {
        console.log('   ✅ 找到用户111的目标');
        console.log('   目标内容:', goalForUser111.goalContent);
        console.log('   创建时间:', goalForUser111.createdAt);
      } else {
        console.log('   ❌ 没有找到用户111的目标');
        
        // 检查是否有其他格式的用户ID
        const allGoalsWithUserIds = await Goal.find({});
        console.log('   检查所有目标中的用户ID:');
        allGoalsWithUserIds.forEach((goal, index) => {
          console.log(`   ${index + 1}. 用户ID: ${goal.userId} (类型: ${typeof goal.userId})`);
        });
      }
    }
    
    // 6. 检查数据库操作历史
    console.log('\n6. 可能的原因分析:');
    console.log('   - 数据库被清空或重置');
    console.log('   - 目标数据被意外删除');
    console.log('   - 数据迁移过程中丢失');
    console.log('   - 用户ID格式不匹配');
    console.log('   - 集合名称问题');
    
  } catch (error) {
    console.error('调试过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 