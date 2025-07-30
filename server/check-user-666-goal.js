// 专门检查用户666的目标数据
const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function checkUser666Goal() {
  try {
    console.log('🔍 检查用户666的目标数据...');
    
    // 1. 查找用户666
    console.log('\n📋 步骤1: 查找用户666');
    const user666 = await User.findOne({ username: '666' });
    if (user666) {
      console.log('✅ 找到用户666:');
      console.log('   - 用户ID:', user666._id);
      console.log('   - 用户名:', user666.username);
      console.log('   - 邮箱:', user666.email);
      console.log('   - 创建时间:', user666.createdAt);
    } else {
      console.log('❌ 数据库中没有用户666');
      return;
    }
    
    // 2. 查找用户666的目标
    console.log('\n📋 步骤2: 查找用户666的目标');
    const goal666 = await Goal.findOne({ userId: user666._id });
    if (goal666) {
      console.log('✅ 用户666有目标:');
      console.log('   - 目标内容:', goal666.goalContent);
      console.log('   - 目标ID:', goal666._id);
      console.log('   - 创建时间:', goal666.createdAt);
      console.log('   - 更新时间:', goal666.updatedAt);
      console.log('   - 开始日期:', goal666.startDate);
      console.log('   - 完整目标对象:', JSON.stringify(goal666, null, 2));
    } else {
      console.log('❌ 用户666没有目标数据');
    }
    
    // 3. 检查目标API返回的数据格式
    console.log('\n📋 步骤3: 模拟目标API返回格式');
    if (goal666) {
      const apiResponse = {
        hasGoal: true,
        goal: {
          _id: goal666._id,
          goalContent: goal666.goalContent,
          userId: goal666.userId,
          createdAt: goal666.createdAt,
          updatedAt: goal666.updatedAt,
          startDate: goal666.startDate
        }
      };
      console.log('✅ 模拟API返回数据:');
      console.log(JSON.stringify(apiResponse, null, 2));
      
      // 4. 检查登录逻辑中的条件
      console.log('\n📋 步骤4: 检查登录逻辑条件');
      console.log('条件: goalData.hasGoal && goalData.goal');
      console.log('goalData.hasGoal =', apiResponse.hasGoal);
      console.log('goalData.goal =', apiResponse.goal ? '存在' : '不存在');
      console.log('条件结果 =', apiResponse.hasGoal && apiResponse.goal ? 'true (应该跳转到进度页面)' : 'false (应该跳转到设置目标页面)');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser666Goal(); 