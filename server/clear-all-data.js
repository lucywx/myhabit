const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');
const Checkin = require('./models/Checkin');
const Payment = require('./models/Payment');
const Invite = require('./models/Invite');
const PunishmentSettings = require('./models/PunishmentSettings');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  clearAllData();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function clearAllData() {
  try {
    console.log('🗑️  开始清除所有数据...\n');
    
    // 1. 统计当前数据
    console.log('📊 当前数据统计:');
    const userCount = await User.countDocuments();
    const goalCount = await Goal.countDocuments();
    const checkinCount = await Checkin.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const inviteCount = await Invite.countDocuments();
    const punishmentCount = await PunishmentSettings.countDocuments();
    
    console.log(`   用户数量: ${userCount}`);
    console.log(`   目标数量: ${goalCount}`);
    console.log(`   打卡记录: ${checkinCount}`);
    console.log(`   支付记录: ${paymentCount}`);
    console.log(`   邀请记录: ${inviteCount}`);
    console.log(`   惩罚设置: ${punishmentCount}`);
    console.log('');
    
    if (userCount === 0 && goalCount === 0) {
      console.log('✅ 数据库已经是空的，无需清除');
      return;
    }
    
    // 2. 确认清除操作
    console.log('⚠️  警告：此操作将永久删除所有数据！');
    console.log('   包括：用户、目标、打卡记录、支付记录等');
    console.log('');
    
    // 3. 开始清除数据
    console.log('🧹 开始清除数据...');
    
    // 清除所有集合的数据
    const results = await Promise.all([
      User.deleteMany({}),
      Goal.deleteMany({}),
      Checkin.deleteMany({}),
      Payment.deleteMany({}),
      Invite.deleteMany({}),
      PunishmentSettings.deleteMany({})
    ]);
    
    console.log('✅ 数据清除完成！');
    console.log('');
    
    // 4. 验证清除结果
    console.log('📊 清除后数据统计:');
    const newUserCount = await User.countDocuments();
    const newGoalCount = await Goal.countDocuments();
    const newCheckinCount = await Checkin.countDocuments();
    const newPaymentCount = await Payment.countDocuments();
    const newInviteCount = await Invite.countDocuments();
    const newPunishmentCount = await PunishmentSettings.countDocuments();
    
    console.log(`   用户数量: ${newUserCount}`);
    console.log(`   目标数量: ${newGoalCount}`);
    console.log(`   打卡记录: ${newCheckinCount}`);
    console.log(`   支付记录: ${newPaymentCount}`);
    console.log(`   邀请记录: ${newInviteCount}`);
    console.log(`   惩罚设置: ${newPunishmentCount}`);
    console.log('');
    
    if (newUserCount === 0 && newGoalCount === 0) {
      console.log('🎉 所有数据已成功清除！');
      console.log('   现在可以重新注册用户了。');
    } else {
      console.log('⚠️  部分数据可能未完全清除，请检查。');
    }
    
  } catch (error) {
    console.error('❌ 清除数据时出错:', error);
  } finally {
    mongoose.connection.close();
  }
} 