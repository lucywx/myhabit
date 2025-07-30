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
  checkScriptExecution();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function checkScriptExecution() {
  try {
    console.log('🔍 检查脚本执行状态...\n');
    
    const userId = '6888dcc9a80f72af090f56e3'; // 用户111的ID
    const goalContent = 'catan <= 2 rounds';
    
    console.log('1. 检查用户111是否存在...');
    const user = await User.findOne({ username: '111' });
    if (!user) {
      console.log('❌ 用户111不存在，脚本无法执行');
      return;
    }
    console.log('✅ 用户111存在，ID:', user._id);
    console.log('');
    
    console.log('2. 检查目标数据...');
    const goal = await Goal.findOne({ userId: user._id });
    if (goal) {
      console.log('✅ 找到目标数据:');
      console.log('  目标内容:', goal.goalContent);
      console.log('  创建时间:', goal.createdAt);
    } else {
      console.log('❌ 没有找到目标数据');
    }
    console.log('');
    
    console.log('3. 检查脚本执行可能的问题...');
    
    // 检查用户ID格式
    console.log('   用户ID格式检查:');
    console.log('   脚本中的用户ID:', userId);
    console.log('   数据库中的用户ID:', user._id.toString());
    console.log('   是否匹配:', userId === user._id.toString());
    console.log('');
    
    // 检查Goal模型
    console.log('   Goal模型检查:');
    console.log('   模型名称:', Goal.modelName);
    console.log('   集合名称:', Goal.collection.name);
    console.log('');
    
    // 检查数据库连接
    console.log('   数据库连接检查:');
    console.log('   连接状态:', mongoose.connection.readyState);
    console.log('   数据库名称:', mongoose.connection.name);
    console.log('');
    
    console.log('4. 可能的原因分析:');
    console.log('   a) 脚本从未被执行');
    console.log('   b) 脚本执行时出错（网络、权限等）');
    console.log('   c) 脚本执行后数据被删除');
    console.log('   d) 用户ID格式不匹配');
    console.log('   e) 数据库连接问题');
    console.log('   f) 模型定义问题');
    console.log('');
    
    console.log('5. 建议的解决方案:');
    console.log('   - 重新运行脚本');
    console.log('   - 检查脚本执行日志');
    console.log('   - 验证数据库权限');
    console.log('   - 确认用户ID正确性');
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 