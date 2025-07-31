const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myhabit-app');

const User = require('./models/User');

async function testPasswords() {
    try {
        const users = await User.find({});

        console.log('🔍 测试用户密码...');
        console.log('================');

        for (const user of users) {
            console.log(`\n👤 用户: ${user.username}`);

            // 测试常见密码
            const testPasswords = ['123456', 'password', '123123', '666666', 'lux123', 'simon123'];

            for (const testPassword of testPasswords) {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                if (isMatch) {
                    console.log(`✅ 密码匹配: ${testPassword}`);
                    break;
                }
            }
        }

    } catch (error) {
        console.error('❌ 测试失败:', error);
    } finally {
        mongoose.connection.close();
    }
}

testPasswords(); 