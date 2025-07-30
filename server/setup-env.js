const fs = require('fs');
const path = require('path');

console.log('🔧 设置 .env 文件');
console.log('================');

const envPath = path.join(__dirname, '.env');

// 检查.env文件是否存在
if (!fs.existsSync(envPath)) {
  console.log('❌ .env 文件不存在，正在创建...');
  fs.writeFileSync(envPath, '');
}

console.log('📝 请在下面的 .env 文件中添加以下内容：');
console.log('');

const envTemplate = `# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# JWT Secret
JWT_SECRET=your-secret

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/myhabit

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development`;

console.log(envTemplate);
console.log('');
console.log('📍 .env 文件位置：', envPath);
console.log('');
console.log('💡 请将上面的内容复制到 .env 文件中，并替换为您的实际值');
console.log('🔑 特别是 STRIPE_SECRET_KEY 和 STRIPE_PUBLISHABLE_KEY');
console.log('');
console.log('完成后运行：node test-stripe-setup.js'); 