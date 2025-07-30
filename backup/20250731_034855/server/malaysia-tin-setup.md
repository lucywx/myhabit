# 马来西亚个人TIN配置指南

## 您的TIN信息
- **TIN类型**: NRIC (National Registration Identity Card Number)
- **国家**: Malaysia (MY)
- **格式**: YYMMDD-PB-XXXX

## 获取NRIC号码
1. **马来西亚公民**: 使用身份证上的NRIC号码
2. **永久居民**: 使用MyPR卡上的NRIC号码
3. **非公民**: 可能需要其他税务识别号码

## 在Stripe Dashboard中设置

### 步骤
1. 登录Stripe Dashboard
2. 进入 "Settings" > "Business settings"
3. 找到 "Tax identification numbers" 部分
4. 添加TIN信息：
   - **TIN类型**: 选择 "NRIC" 或 "Other"
   - **TIN号码**: 输入您的NRIC号码
   - **国家**: 选择 "Malaysia"
   - **验证**: 确保格式正确

### 示例配置
```
TIN类型: NRIC
TIN号码: 901231-01-1234
国家: Malaysia
```

## 马来西亚税务要求

### 个人商家
- 需要注册为个体经营者
- 年收入超过RM50,000需要注册GST
- 需要提交年度税务申报

### 税务义务
1. **所得税**: 根据收入水平缴纳
2. **GST**: 如果年收入超过门槛
3. **税务申报**: 年度申报

## 安全注意事项

### 保护NRIC信息
- NRIC是敏感个人信息
- 不要在代码中硬编码
- 使用环境变量存储
- 确保数据传输加密

### 环境变量配置
```bash
# .env 文件 (不要直接存储真实NRIC)
STRIPE_TIN_TYPE=NRIC
STRIPE_TIN_COUNTRY=MY
# STRIPE_TIN_NUMBER=在Stripe Dashboard中直接输入
```

## 验证NRIC格式

### JavaScript验证函数
```javascript
function validateMalaysianNRIC(nric) {
  // 马来西亚NRIC格式验证
  const nricPattern = /^\d{6}-\d{2}-\d{4}$/;
  return nricPattern.test(nric);
}

// 使用示例
const nric = "901231-01-1234";
if (validateMalaysianNRIC(nric)) {
  console.log("NRIC格式正确");
} else {
  console.log("NRIC格式错误");
}
```

## 常见问题

### Q: 我没有NRIC怎么办？
A: 如果您不是马来西亚公民，可能需要其他税务识别号码或咨询税务顾问。

### Q: NRIC格式错误怎么办？
A: 确保格式为 YYMMDD-PB-XXXX，包含连字符。

### Q: 测试环境需要真实NRIC吗？
A: 不需要，可以使用测试数据或跳过验证。

### Q: 如何保护NRIC安全？
A: 只在Stripe Dashboard中直接输入，不要存储在代码或日志中。

## 下一步操作
1. 准备好您的NRIC号码
2. 在Stripe Dashboard中配置TIN
3. 完成业务验证
4. 测试支付功能 