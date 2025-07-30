const mongoose = require('mongoose');
const User = require('./models/User');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myhabit-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkUsers() {
  try {
    console.log('查看所有用户...');
    
    const users = await User.find({}).select('username email _id createdAt');
    
    console.log(`找到 ${users.length} 个用户:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户名: ${user.username}, ID: ${user._id}, 邮箱: ${user.email}, 创建时间: ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers(); 