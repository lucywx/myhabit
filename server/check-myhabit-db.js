const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

// 连接myhabit数据库
mongoose.connect('mongodb://localhost:27017/myhabit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkMyhabitDB() {
  try {
    console.log('正在检查myhabit数据库...\n');
    
    // 查找所有用户
    const users = await User.find({});
    console.log(`📊 myhabit数据库中共有 ${users.length} 个用户:\n`);
    
    if (users.length === 0) {
      console.log('❌ myhabit数据库中没有用户');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户ID: ${user._id}`);
      console.log(`   用户名: ${user.username}`);
      console.log(`   邮箱: ${user.email || '未设置'}`);
      console.log(`   创建时间: ${user.createdAt}`);
      console.log('');
    });
    
    // 查找用户111
    const user111 = await User.findOne({ username: '111' });
    if (user111) {
      console.log('✅ 在myhabit数据库中找到用户111:');
      console.log('  用户ID:', user111._id);
      console.log('  用户名:', user111.username);
      console.log('');
      
      // 查找用户111的目标
      const goal = await Goal.findOne({ userId: user111._id });
      if (goal) {
        console.log('✅ 用户111的目标数据:');
        console.log('  目标ID:', goal._id);
        console.log('  目标内容:', goal.goalContent);
        console.log('  开始日期:', goal.startDate || '未设置');
        console.log('  创建时间:', goal.createdAt);
        console.log('  更新时间:', goal.updatedAt);
      } else {
        console.log('❌ 用户111在myhabit数据库中没有目标数据');
      }
    } else {
      console.log('❌ 在myhabit数据库中没有找到用户111');
    }
    
    // 检查所有目标数据
    console.log('\n📊 myhabit数据库中的目标统计:');
    const allGoals = await Goal.find({});
    console.log('  总目标数量:', allGoals.length);
    
    if (allGoals.length > 0) {
      console.log('  所有目标:');
      allGoals.forEach((g, index) => {
        console.log(`    ${index + 1}. 用户ID: ${g.userId}, 内容: ${g.goalContent}`);
      });
    }
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkMyhabitDB(); 