const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkUser111Goal() {
  try {
    console.log('正在检查用户111的目标数据...\n');
    
    // 查找用户111
    const user = await User.findOne({ username: '111' });
    if (!user) {
      console.log('❌ 用户111不存在');
      return;
    }
    
    console.log('✅ 用户111存在:');
    console.log('  用户ID:', user._id);
    console.log('  用户名:', user.username);
    console.log('  创建时间:', user.createdAt);
    console.log('');
    
    // 查找用户111的目标
    const goal = await Goal.findOne({ userId: user._id });
    if (!goal) {
      console.log('❌ 用户111没有设置目标');
      console.log('可能的原因:');
      console.log('  1. 用户从未设置过目标');
      console.log('  2. 目标数据被意外删除');
      console.log('  3. 数据库连接问题');
    } else {
      console.log('✅ 用户111的目标数据:');
      console.log('  目标ID:', goal._id);
      console.log('  目标内容:', goal.goalContent);
      console.log('  开始日期:', goal.startDate || '未设置');
      console.log('  创建时间:', goal.createdAt);
      console.log('  更新时间:', goal.updatedAt);
    }
    
    // 检查所有目标数据
    console.log('\n📊 数据库中的目标统计:');
    const allGoals = await Goal.find({});
    console.log('  总目标数量:', allGoals.length);
    
    if (allGoals.length > 0) {
      console.log('  最近的目标:');
      allGoals.slice(0, 5).forEach((g, index) => {
        console.log(`    ${index + 1}. 用户ID: ${g.userId}, 内容: ${g.goalContent.substring(0, 30)}...`);
      });
    }
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser111Goal(); 