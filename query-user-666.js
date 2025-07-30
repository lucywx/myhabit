// query-user-666.js
const mongoose = require('mongoose');
const User = require('./server/models/User');
const Goal = require('./server/models/Goal');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function queryUser666() {
  try {
    console.log('🔍 在数据库中查找用户666...');
    
    // 1. 通过用户名查找用户666
    const user = await User.findOne({ username: '666' });
    if (!user) {
      console.log('❌ 数据库中没有用户名为"666"的用户');
      
      // 列出所有用户
      console.log('\n📋 数据库中的所有用户:');
      const allUsers = await User.find({}, 'username email createdAt');
      allUsers.forEach(u => {
        console.log(`- 用户名: ${u.username}, 邮箱: ${u.email}, 创建时间: ${u.createdAt}`);
      });
      return;
    }
    
    console.log('✅ 找到用户666:');
    console.log('- 用户ID:', user._id);
    console.log('- 用户名:', user.username);
    console.log('- 邮箱:', user.email);
    console.log('- 创建时间:', user.createdAt);
    
    // 2. 通过用户ID查找目标
    const goal = await Goal.findOne({ userId: user._id });
    if (!goal) {
      console.log('❌ 用户666没有目标数据');
      return;
    }
    
    console.log('\n✅ 找到用户666的目标:');
    console.log('- 目标ID:', goal._id);
    console.log('- 目标内容:', goal.goalContent);
    console.log('- 天数:', goal.days);
    console.log('- 每日目标:', goal.dailyTarget);
    console.log('- 开始日期:', goal.startDate);
    console.log('- 惩罚设置:', goal.punishment);
    console.log('- 创建时间:', goal.createdAt);
    
  } catch (error) {
    console.error('❌ 查询失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

queryUser666(); 