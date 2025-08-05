const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI);

const User = require('./models/User');

async function checkUserData() {
    try {
        const users = await User.find({}).select('username email salt password');
        console.log('所有用户数据:');
        users.forEach(user => {
            console.log({
                username: user.username,
                email: user.email,
                hasSalt: !!user.salt,
                salt: user.salt ? user.salt.substring(0, 10) + '...' : 'null',
                passwordLength: user.password ? user.password.length : 0
            });
        });
    } catch (error) {
        console.error('查询失败:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkUserData(); 