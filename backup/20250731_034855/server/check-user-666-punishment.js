// 专门检查用户666的惩罚设置数据
const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function checkUser666Punishment() {
  try {
    console.log('🔍 检查用户666的惩罚设置数据...');
    
    // 1. 查找用户666
    console.log('\n📋 步骤1: 查找用户666');
    const user666 = await User.findOne({ username: '666' });
    if (user666) {
      console.log('✅ 找到用户666:');
      console.log('   - 用户ID:', user666._id);
      console.log('   - 用户名:', user666.username);
    } else {
      console.log('❌ 数据库中没有用户666');
      return;
    }
    
    // 2. 查找用户666的目标（可能包含惩罚数据）
    console.log('\n📋 步骤2: 查找用户666的目标数据');
    const goal666 = await Goal.findOne({ userId: user666._id });
    if (goal666) {
      console.log('✅ 用户666有目标数据:');
      console.log('   - 目标内容:', goal666.goalContent);
      console.log('   - 完整目标对象:', JSON.stringify(goal666, null, 2));
      
      // 检查目标中是否包含惩罚数据
      if (goal666.punishment) {
        console.log('\n📋 步骤3: 目标中的惩罚数据');
        console.log('✅ 目标中包含惩罚数据:');
        console.log('   - 惩罚金额:', goal666.punishment.amount);
        console.log('   - 惩罚类型:', goal666.punishment.type);
        console.log('   - 朋友联系方式:', goal666.punishment.friendContact);
      } else {
        console.log('\n📋 步骤3: 目标中的惩罚数据');
        console.log('❌ 目标中不包含惩罚数据');
      }
    } else {
      console.log('❌ 用户666没有目标数据');
    }
    
    // 3. 检查是否有独立的惩罚设置模型
    console.log('\n📋 步骤4: 检查独立的惩罚设置模型');
    try {
      const PunishmentSettings = require('./models/PunishmentSettings');
      const punishment666 = await PunishmentSettings.findOne({ userId: user666._id });
      if (punishment666) {
        console.log('✅ 找到独立的惩罚设置数据:');
        console.log('   - 是否启用:', punishment666.enabled);
        console.log('   - 惩罚金额:', punishment666.amount);
        console.log('   - 惩罚类型:', punishment666.type);
        console.log('   - 朋友联系方式:', punishment666.friendContact);
        console.log('   - 完整惩罚设置对象:', JSON.stringify(punishment666, null, 2));
      } else {
        console.log('❌ 没有找到独立的惩罚设置数据');
      }
    } catch (error) {
      console.log('❌ PunishmentSettings模型不存在:', error.message);
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser666Punishment(); 