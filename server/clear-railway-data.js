const mongoose = require('mongoose');
const User = require('./models/User');
const Goal = require('./models/Goal');
const Checkin = require('./models/Checkin');
const Payment = require('./models/Payment');
const Invite = require('./models/Invite');
const PriceSettings = require('./models/PriceSettings');
const BankInfo = require('./models/BankInfo');
const UserProgress = require('./models/UserProgress');

async function clearRailwayData() {
  try {
    // 连接Railway数据库
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ 错误: 未设置MONGODB_URI环境变量');
      console.log('💡 请确保在Railway环境中运行此脚本');
      process.exit(1);
    }

    console.log('🔗 连接到Railway数据库...');
    console.log('📊 数据库URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // 隐藏密码

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Railway数据库连接成功');

    // 开始清空数据
    console.log('🗑️ 开始清空Railway数据库中的所有用户数据...');

    // 清空各种数据
    const results = {};

    // 清空用户数据
    const userResult = await User.deleteMany({});
    results.users = userResult.deletedCount;

    // 清空目标数据
    const goalResult = await Goal.deleteMany({});
    results.goals = goalResult.deletedCount;

    // 清空打卡数据
    const checkinResult = await Checkin.deleteMany({});
    results.checkins = checkinResult.deletedCount;

    // 清空支付数据
    const paymentResult = await Payment.deleteMany({});
    results.payments = paymentResult.deletedCount;

    // 清空邀请数据
    const inviteResult = await Invite.deleteMany({});
    results.invites = inviteResult.deletedCount;

    // 清空价格设置
    const priceResult = await PriceSettings.deleteMany({});
    results.priceSettings = priceResult.deletedCount;

    // 清空银行信息
    const bankResult = await BankInfo.deleteMany({});
    results.bankInfo = bankResult.deletedCount;

    // 清空用户进度
    const progressResult = await UserProgress.deleteMany({});
    results.userProgress = progressResult.deletedCount;

    // 输出清理结果
    console.log('\n🎉 Railway数据库清理完成！');
    console.log('📊 清理统计:');
    console.log(`   - 用户: ${results.users}`);
    console.log(`   - 目标: ${results.goals}`);
    console.log(`   - 打卡记录: ${results.checkins}`);
    console.log(`   - 支付记录: ${results.payments}`);
    console.log(`   - 邀请记录: ${results.invites}`);
    console.log(`   - 价格设置: ${results.priceSettings}`);
    console.log(`   - 银行信息: ${results.bankInfo}`);
    console.log(`   - 用户进度: ${results.userProgress}`);

    console.log('\n✅ Railway数据库已重置，可以开始新的测试！');

  } catch (error) {
    console.error('❌ 清理Railway数据库时出错:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('🔌 Railway数据库连接已关闭');
    process.exit(0);
  }
}

// 运行清理脚本
clearRailwayData(); 