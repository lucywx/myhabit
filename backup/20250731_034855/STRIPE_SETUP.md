# Stripe支付集成配置指南

## 🚀 快速开始

### 1. 获取Stripe密钥

1. 注册 [Stripe账户](https://stripe.com)
2. 进入 [Stripe Dashboard](https://dashboard.stripe.com)
3. 获取测试密钥：
   - **Publishable Key**: `pk_test_...`
   - **Secret Key**: `sk_test_...`

### 2. 配置环境变量

#### 服务器端配置 (`server/.env`)
```bash
# Stripe配置
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### 前端配置 (`client/.env`)
```bash
# Stripe公钥
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. 设置Webhook

1. 在Stripe Dashboard中创建Webhook
2. 端点URL: `https://your-domain.com/api/payment/webhook`
3. 选择事件: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. 获取Webhook Secret并添加到环境变量

## 💳 测试支付

### 测试卡号
- **成功支付**: `4242 4242 4242 4242`
- **需要验证**: `4000 0025 0000 3155`
- **支付失败**: `4000 0000 0000 0002`

### 测试数据
- **有效期**: 任意未来日期 (如 `12/25`)
- **CVC**: 任意3位数字 (如 `123`)

## 🔧 API端点

### 创建支付意图
```
POST /api/payment/create-payment-intent
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 100,
  "day": 3,
  "recipientContact": "friend@example.com",
  "type": "friend"
}
```

### 确认支付
```
POST /api/payment/confirm-payment
Content-Type: application/json
Authorization: Bearer <token>

{
  "paymentIntentId": "pi_xxx",
  "day": 3,
  "recipientContact": "friend@example.com",
  "type": "friend",
  "amount": 100
}
```

### 获取支付历史
```
GET /api/payment/payment-history
Authorization: Bearer <token>
```

## 📊 支付类型

### Platform支付
- 支付给平台账户
- 用于平台惩罚机制
- `type: "platform"`

### Friend支付
- 支付给朋友
- 用于朋友监督机制
- `type: "friend"`
- 需要提供`recipientContact`

## 🛡️ 安全考虑

1. **永远不要在前端暴露Secret Key**
2. **使用HTTPS进行生产环境**
3. **验证Webhook签名**
4. **记录所有支付操作**
5. **实现适当的错误处理**

## 🔍 故障排除

### 常见错误
- `Invalid API key`: 检查Stripe密钥配置
- `Webhook signature verification failed`: 检查Webhook Secret
- `Payment intent not found`: 检查支付意图ID

### 调试步骤
1. 检查环境变量是否正确设置
2. 验证Stripe密钥是否有效
3. 查看服务器日志
4. 使用Stripe Dashboard查看支付状态

## 📈 生产环境

### 切换到生产密钥
1. 在Stripe Dashboard中获取生产密钥
2. 更新环境变量
3. 配置生产环境Webhook
4. 测试支付流程

### 监控
- 使用Stripe Dashboard监控支付
- 设置支付失败告警
- 定期检查Webhook状态 