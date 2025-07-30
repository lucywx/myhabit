// 加载环境变量
require('dotenv').config();

console.log('🔍 检查环境变量加载...\n');

console.log('当前工作目录:', process.cwd());
console.log('');

console.log('环境变量:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '未设置');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '已设置' : '未设置');
console.log('PORT:', process.env.PORT || '未设置');
console.log('MONGODB_URI:', process.env.MONGODB_URI || '未设置');
console.log('');

// 检查.env文件是否存在
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log('.env文件路径:', envPath);
console.log('.env文件存在:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('.env文件内容:');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(envContent);
} 