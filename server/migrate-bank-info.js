// server/migrate-bank-info.js
const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myhabit-app';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

const User = require('./models/User');
const BankInfo = require('./models/BankInfo');

async function migrateBankInfo() {
    try {
        console.log('🔄 开始迁移银行信息...');

        // 查找所有有银行信息的用户
        const usersWithBankInfo = await User.find({
            $or: [
                { bankName: { $ne: '' } },
                { accountName: { $ne: '' } },
                { accountNumber: { $ne: '' } },
                { cardType: { $ne: '' } },
                { expiryDate: { $ne: '' } },
                { cvv: { $ne: '' } }
            ]
        });

        console.log(`📋 找到 ${usersWithBankInfo.length} 个用户有银行信息`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const user of usersWithBankInfo) {
            console.log(`\n👤 处理用户: ${user.username}`);

            // 检查是否已经有BankInfo记录
            const existingBankInfo = await BankInfo.findByUserId(user._id);
            if (existingBankInfo) {
                console.log(`   ⚠️  用户 ${user.username} 已有BankInfo记录，跳过`);
                skippedCount++;
                continue;
            }

            // 检查是否有有效的银行信息
            if (!user.bankName && !user.accountName && !user.accountNumber) {
                console.log(`   ⚠️  用户 ${user.username} 银行信息为空，跳过`);
                skippedCount++;
                continue;
            }

            // 创建新的BankInfo记录
            const bankInfo = new BankInfo({
                userId: user._id,
                bankName: user.bankName || '',
                accountName: user.accountName || '',
                accountNumber: user.accountNumber || '',
                cardType: user.cardType || '',
                expiryDate: user.expiryDate || '',
                cvv: user.cvv || ''
            });

            await bankInfo.save();
            console.log(`   ✅ 用户 ${user.username} 银行信息迁移成功`);
            migratedCount++;
        }

        console.log(`\n🎉 迁移完成！`);
        console.log(`   - 成功迁移: ${migratedCount} 个用户`);
        console.log(`   - 跳过: ${skippedCount} 个用户`);
        console.log(`   - 总计处理: ${usersWithBankInfo.length} 个用户`);

    } catch (error) {
        console.error('❌ 迁移失败:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 数据库连接已关闭');
    }
}

// 运行迁移
migrateBankInfo(); 