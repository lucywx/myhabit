const fs = require('fs');
const path = require('path');

console.log('🔧 Stripe支付功能配置向导\n');

// 1. 检查现有配置
console.log('1. 检查现有配置...');
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('   ✅ .env文件已存在');
} else {
  console.log('   ⚠️  .env文件不存在，将创建新文件');
}

// 2. 检查Stripe配置
const hasStripeSecret = envContent.includes('STRIPE_SECRET_KEY');
const hasStripePublishable = envContent.includes('STRIPE_PUBLISHABLE_KEY');

console.log('   Stripe Secret Key:', hasStripeSecret ? '已配置' : '未配置');
console.log('   Stripe Publishable Key:', hasStripePublishable ? '已配置' : '未配置');
console.log('');

// 3. 配置说明
console.log('2. Stripe配置步骤:');
console.log('   A. 访问 https://stripe.com 注册账户');
console.log('   B. 进入 Dashboard > Developers > API keys');
console.log('   C. 复制以下密钥:');
console.log('      - Secret key (sk_test_...)');
console.log('      - Publishable key (pk_test_...)');
console.log('');

// 4. 环境变量模板
console.log('3. 需要在.env文件中添加的配置:');
console.log('   STRIPE_SECRET_KEY=sk_test_your_secret_key_here');
console.log('   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here');
console.log('');

// 5. 前端配置
console.log('4. 前端配置 (client/src/config.js):');
console.log('   添加: export const STRIPE_PUBLISHABLE_KEY = "pk_test_...";');
console.log('');

// 6. 测试卡号
console.log('5. Stripe测试卡号:');
console.log('   ✅ 成功支付: 4242 4242 4242 4242');
console.log('   ❌ 失败支付: 4000 0000 0000 0002');
console.log('   ⚠️  需要验证: 4000 0025 0000 3155');
console.log('   过期日期: 任意未来日期');
console.log('   CVC: 任意3位数字');
console.log('');

// 7. 下一步操作
console.log('6. 配置完成后:');
console.log('   A. 重启服务器: npm run dev');
console.log('   B. 测试支付功能');
console.log('   C. 检查支付记录');
console.log('');

console.log('📝 请按照上述步骤配置Stripe密钥，然后运行测试脚本验证功能。'); 