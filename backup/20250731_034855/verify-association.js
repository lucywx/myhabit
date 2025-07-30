// verify-association.js
const mongoose = require('mongoose');
const User = require('./server/models/User');
const Goal = require('./server/models/Goal');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function verifyAssociation() {
  try {
    console.log('🔍 验证数据库关联关系...');
    
    // 1. 查找所有用户
    const users = await User.find({}, 'username _id createdAt');
    console.log(`\n📋 数据库中的用户 (${users.length}个):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户名: ${user.username}, ID: ${user._id}, 创建时间: ${user.createdAt}`);
    });
    
    // 2. 查找所有目标及其关联的用户
    const goals = await Goal.find({}).populate('userId', 'username');
    console.log(`\n📋 数据库中的目标 (${goals.length}个):`);
    goals.forEach((goal, index) => {
      const username = goal.userId ? goal.userId.username : '未知用户';
      console.log(`${index + 1}. 用户: ${username}, 目标: ${goal.goalContent}, 创建时间: ${goal.createdAt}`);
    });
    
    // 3. 特别查找用户666
    console.log('\n🔍 特别查找用户666:');
    const user666 = await User.findOne({ username: '666' });
    if (user666) {
      console.log('✅ 找到用户666:', user666._id);
      const goal666 = await Goal.findOne({ userId: user666._id });
      if (goal666) {
        console.log('✅ 用户666有目标:', goal666.goalContent);
      } else {
        console.log('❌ 用户666没有目标');
      }
    } else {
      console.log('❌ 数据库中没有用户666');
    }
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

verifyAssociation(); 