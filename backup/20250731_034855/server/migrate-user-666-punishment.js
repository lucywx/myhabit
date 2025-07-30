// 迁移用户666的惩罚数据
const mongoose = require('mongoose');
const User = require('./models/User');
const PunishmentSettings = require('./models/PunishmentSettings');

mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function migrateUser666Punishment() {
  try {
    console.log('🔍 迁移用户666的惩罚数据...');
    
    // 1. 查找用户666
    const user666 = await User.findOne({ username: '666' });
    if (!user666) {
      console.log('❌ 找不到用户666');
      return;
    }
    
    console.log('✅ 找到用户666:', user666._id);
    
    // 2. 直接查询数据库中的目标数据（不依赖模型定义）
    const db = mongoose.connection.db;
    const goal666 = await db.collection('goals').findOne({ userId: user666._id });
    
    if (!goal666) {
      console.log('❌ 找不到用户666的目标数据');
      return;
    }
    
    console.log('✅ 找到用户666的目标数据');
    console.log('原始目标数据:', JSON.stringify(goal666, null, 2));
    
    // 3. 检查目标中是否有惩罚数据
    if (!goal666.punishment || !goal666.punishment.amount) {
      console.log('❌ 用户666的目标中没有有效的惩罚数据');
      return;
    }
    
    console.log('✅ 找到惩罚数据:', goal666.punishment);
    
    // 4. 创建新的惩罚设置记录
    const punishmentSettings = new PunishmentSettings({
      userId: user666._id,
      enabled: true,
      amount: goal666.punishment.amount,
      type: goal666.punishment.type || 'platform',
      friendContact: goal666.punishment.friendContact || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await punishmentSettings.save();
    
    console.log('✅ 成功创建惩罚设置记录:', punishmentSettings._id);
    console.log('✅ 迁移完成！');
    
    // 5. 验证迁移结果
    const savedPunishment = await PunishmentSettings.findOne({ userId: user666._id });
    if (savedPunishment) {
      console.log('✅ 验证成功，新的惩罚设置:');
      console.log('   - 是否启用:', savedPunishment.enabled);
      console.log('   - 惩罚金额:', savedPunishment.amount);
      console.log('   - 惩罚类型:', savedPunishment.type);
      console.log('   - 朋友联系方式:', savedPunishment.friendContact);
    }
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateUser666Punishment(); 