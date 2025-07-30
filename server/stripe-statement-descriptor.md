# Stripe对账单描述符配置指南

## 什么是Statement Descriptor？
Statement Descriptor是显示在客户信用卡账单上的商家名称，帮助客户识别交易来源。

## 配置位置
在Stripe Dashboard中：
1. 登录Stripe Dashboard
2. 进入 "Settings" > "Business settings"
3. 找到 "Statement descriptors" 部分

## 推荐配置

### 主要描述符（Primary Descriptor）
```
MYHABIT APP
```
- 长度：10个字符
- 清晰易懂
- 符合Stripe要求

### 备用描述符（备用选项）
```
MYHABIT-REWARD    (13字符)
HABIT TRACKER     (13字符)
MYHABIT           (8字符)
```

## 在代码中的使用

### 后端配置（server/routes/payment.js）
```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100),
  currency: 'usd',
  statement_descriptor: 'MYHABIT APP', // 添加这行
  metadata: {
    userId: userId,
    day: day,
    recipientContact: recipientContact,
    type: type,
    username: user.username
  }
});
```

### 动态描述符
```javascript
// 根据支付类型设置不同的描述符
const getStatementDescriptor = (type) => {
  switch(type) {
    case 'platform':
      return 'MYHABIT-PENALTY';
    case 'friend':
      return 'MYHABIT-REWARD';
    default:
      return 'MYHABIT APP';
  }
};

const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100),
  currency: 'usd',
  statement_descriptor: getStatementDescriptor(type),
  // ... 其他配置
});
```

## 测试建议
1. 使用测试卡号进行支付
2. 检查Stripe Dashboard中的交易记录
3. 验证描述符是否正确显示
4. 确认字符长度符合要求

## 注意事项
- 描述符一旦设置，可能需要24-48小时才能在所有银行对账单上生效
- 某些银行可能会截断或修改描述符
- 建议使用简洁、专业的名称
- 避免使用可能引起混淆的词汇 