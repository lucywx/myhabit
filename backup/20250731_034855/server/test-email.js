const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🧪 测试邮件发送功能...\n');
  
  // 1. 检查环境变量
  console.log('1. 环境变量检查:');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER || '未设置');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '已设置' : '未设置');
  console.log('');
  
  // 2. 创建测试传输器
  console.log('2. 创建邮件传输器:');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
  
  // 3. 验证连接
  console.log('3. 验证邮件服务连接:');
  try {
    await transporter.verify();
    console.log('   ✅ 邮件服务连接成功');
  } catch (error) {
    console.log('   ❌ 邮件服务连接失败:', error.message);
    console.log('');
    console.log('🔧 解决方案:');
    console.log('   1. 创建 .env 文件在 server 目录下');
    console.log('   2. 添加以下内容:');
    console.log('      EMAIL_USER=your-gmail@gmail.com');
    console.log('      EMAIL_PASS=your-app-password');
    console.log('');
    console.log('   3. 获取Gmail应用密码:');
    console.log('      - 登录Google账户');
    console.log('      - 进入安全设置');
    console.log('      - 开启两步验证');
    console.log('      - 生成应用专用密码');
    console.log('');
    console.log('   4. 重启服务器');
    return;
  }
  
  // 4. 发送测试邮件
  console.log('4. 发送测试邮件:');
  const testEmail = 'test@example.com';
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: testEmail,
    subject: 'Test Email from MyHabit',
    text: 'This is a test email from MyHabit application.'
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('   ✅ 测试邮件发送成功');
  } catch (error) {
    console.log('   ❌ 测试邮件发送失败:', error.message);
  }
  
  console.log('\n✅ 邮件测试完成');
}

testEmail(); 