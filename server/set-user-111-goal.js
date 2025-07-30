const mongoose = require('mongoose');
const Goal = require('./models/Goal');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function setUser111Goal() {
  try {
    console.log('正在为用户111设置目标...\n');
    
    const userId = '6888dcc9a80f72af090f56e3'; // 用户111的ID
    const goalContent = 'catan <= 2 rounds';
    
    // 检查是否已存在目标
    const existingGoal = await Goal.findOne({ userId });
    if (existingGoal) {
      console.log('⚠️  用户111已有目标，正在更新...');
      existingGoal.goalContent = goalContent;
      await existingGoal.save();
      console.log('✅ 目标已更新');
    } else {
      // 创建新目标
      const newGoal = new Goal({
        userId,
        goalContent,
        startDate: new Date() // 设置开始日期为今天
      });
      
      await newGoal.save();
      console.log('✅ 目标已创建');
    }
    
    // 验证目标是否设置成功
    const goal = await Goal.findOne({ userId });
    console.log('\n📋 用户111的目标数据:');
    console.log('  目标ID:', goal._id);
    console.log('  目标内容:', goal.goalContent);
    console.log('  开始日期:', goal.startDate);
    console.log('  创建时间:', goal.createdAt);
    console.log('  更新时间:', goal.updatedAt);
    
  } catch (error) {
    console.error('设置目标时出错:', error);
  } finally {
    mongoose.connection.close();
  }
}

setUser111Goal(); 