const mongoose = require('mongoose');
require('dotenv').config();

// 导入模型
const User = require('./models/User');
const Goal = require('./models/Goal');
const Checkin = require('./models/Checkin');
const Payment = require('./models/Payment');
const Invite = require('./models/Invite');
const PriceSettings = require('./models/PriceSettings');
const BankInfo = require('./models/BankInfo');

async function clearAllUsers() {
    try {
        // 连接数据库 - 使用环境变量或本地默认连接
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myhabit-app';
        console.log('🔗 使用MongoDB URI:', MONGODB_URI);

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ 数据库连接成功');

        // 清空所有集合
        console.log('🗑️ 开始清空所有用户数据...');

        // 删除所有用户相关数据
        const userResult = await User.deleteMany({});
        console.log(`✅ 删除了 ${userResult.deletedCount} 个用户`);

        const goalResult = await Goal.deleteMany({});
        console.log(`✅ 删除了 ${goalResult.deletedCount} 个目标`);

        const checkinResult = await Checkin.deleteMany({});
        console.log(`✅ 删除了 ${checkinResult.deletedCount} 个打卡记录`);

        const paymentResult = await Payment.deleteMany({});
        console.log(`✅ 删除了 ${paymentResult.deletedCount} 个支付记录`);

        const inviteResult = await Invite.deleteMany({});
        console.log(`✅ 删除了 ${inviteResult.deletedCount} 个邀请记录`);

        const priceSettingsResult = await PriceSettings.deleteMany({});
        console.log(`✅ 删除了 ${priceSettingsResult.deletedCount} 个价格设置`);

        const bankInfoResult = await BankInfo.deleteMany({});
        console.log(`✅ 删除了 ${bankInfoResult.deletedCount} 个银行信息`);

        console.log('\n🎉 所有用户数据已成功清空！');
        console.log('📊 清理统计:');
        console.log(`   - 用户: ${userResult.deletedCount}`);
        console.log(`   - 目标: ${goalResult.deletedCount}`);
        console.log(`   - 打卡记录: ${checkinResult.deletedCount}`);
        console.log(`   - 支付记录: ${paymentResult.deletedCount}`);
        console.log(`   - 邀请记录: ${inviteResult.deletedCount}`);
        console.log(`   - 价格设置: ${priceSettingsResult.deletedCount}`);
        console.log(`   - 银行信息: ${bankInfoResult.deletedCount}`);

    } catch (error) {
        console.error('❌ 清空数据时出错:', error);
    } finally {
        // 关闭数据库连接
        await mongoose.connection.close();
        console.log('🔌 数据库连接已关闭');
        process.exit(0);
    }
}

// 运行清理脚本
clearAllUsers(); 