# Stripe支付功能设置指南

## 1. 创建Stripe账户
1. 访问 https://stripe.com
2. 注册账户（可以使用测试模式）
3. 完成账户验证

## 2. 获取API密钥
1. 登录Stripe Dashboard
2. 进入 "Developers" > "API keys"
3. 复制以下密钥：
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

## 3. 测试卡号
Stripe提供测试卡号：
- **成功支付**: 4242 4242 4242 4242
- **失败支付**: 4000 0000 0000 0002
- **需要验证**: 4000 0025 0000 3155

## 4. 环境变量配置
在 `.env` 文件中添加：
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 5. 前端配置
在 `client/src/config.js` 中添加：
```javascript
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here';
```

## 6. 测试流程
1. 使用测试卡号进行支付
2. 检查支付状态
3. 验证支付记录 