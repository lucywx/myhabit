const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkAllUsers() {
  try {
    console.log('正在检查数据库中的所有用户...\n');
    
    // 查找所有用户
    const users = await User.find({});
    console.log(`📊 数据库中共有 ${users.length} 个用户:\n`);
    
    if (users.length === 0) {
      console.log('❌ 数据库中没有用户');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户ID: ${user._id}`);
      console.log(`   用户名: ${user.username}`);
      console.log(`   邮箱: ${user.email || '未设置'}`);
      console.log(`   创建时间: ${user.createdAt}`);
      console.log('');
    });
    
    // 检查所有目标
    console.log('📊 数据库中的目标数据:\n');
    const goals = await Goal.find({});
    console.log(`共有 ${goals.length} 个目标:\n`);
    
    if (goals.length === 0) {
      console.log('❌ 数据库中没有目标数据');
    } else {
      goals.forEach((goal, index) => {
        console.log(`${index + 1}. 目标ID: ${goal._id}`);
        console.log(`   用户ID: ${goal.userId}`);
        console.log(`   目标内容: ${goal.goalContent}`);
        console.log(`   开始日期: ${goal.startDate || '未设置'}`);
        console.log(`   创建时间: ${goal.createdAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAllUsers(); 