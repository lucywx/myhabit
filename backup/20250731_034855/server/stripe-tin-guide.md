# Stripe TIN (税务识别号码) 配置指南

## 什么是TIN？
TIN (Tax Identification Number) 是税务识别号码，用于政府税务识别和报告。

## 在Stripe中的用途
1. **税务合规**: 满足当地税务法规要求
2. **1099-K报告**: 美国商家需要提供TIN用于税务报告
3. **业务验证**: 验证商家身份和合法性
4. **支付处理**: 某些支付方式需要TIN

## 不同国家的TIN要求

### 美国 (US)
- **个人商家**: SSN (社会安全号码)
- **企业商家**: EIN (雇主识别号码)
- **格式**: XXX-XX-XXXX (SSN) 或 XX-XXXXXXX (EIN)

### 中国 (CN)
- **统一社会信用代码**: 18位数字和字母
- **纳税人识别号**: 15-20位数字
- **格式**: 例如 91110000100000000X

### 其他国家
- **英国**: National Insurance Number
- **加拿大**: Social Insurance Number
- **澳大利亚**: Tax File Number

## 如何获取TIN

### 美国
1. **SSN**: 申请社会安全卡
2. **EIN**: 在IRS网站申请雇主识别号码

### 中国
1. **统一社会信用代码**: 工商注册时获得
2. **纳税人识别号**: 税务登记时获得

## 在Stripe Dashboard中设置

### 步骤
1. 登录Stripe Dashboard
2. 进入 "Settings" > "Business settings"
3. 找到 "Tax identification numbers" 部分
4. 添加相应的TIN信息

### 填写要求
- **TIN类型**: 选择对应的TIN类型
- **TIN号码**: 输入完整的TIN号码
- **国家**: 选择TIN所属国家
- **验证**: 确保号码格式正确

## 注意事项

### 安全考虑
- TIN是敏感信息，需要安全存储
- 不要在代码中硬编码TIN
- 使用环境变量存储

### 合规要求
- 确保TIN信息准确
- 及时更新过期的TIN
- 遵守当地税务法规

### 测试环境
- 测试环境可以使用测试TIN
- 生产环境必须使用真实的TIN
- 不同环境使用不同的TIN

## 代码示例

### 环境变量配置
```bash
# .env 文件
STRIPE_TIN_TYPE=EIN
STRIPE_TIN_NUMBER=12-3456789
STRIPE_TIN_COUNTRY=US
```

### 后端验证
```javascript
// 验证TIN格式
function validateTIN(tin, country) {
  switch(country) {
    case 'US':
      // 验证EIN格式: XX-XXXXXXX
      return /^\d{2}-\d{7}$/.test(tin);
    case 'CN':
      // 验证统一社会信用代码: 18位
      return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(tin);
    default:
      return true;
  }
}
```

## 常见问题

### Q: 个人商家需要TIN吗？
A: 取决于国家法规，美国个人商家需要SSN。

### Q: 测试环境需要真实TIN吗？
A: 不需要，可以使用测试TIN或跳过验证。

### Q: TIN格式错误怎么办？
A: 检查格式要求，确保输入正确。

### Q: 如何更新TIN？
A: 在Stripe Dashboard中编辑TIN信息。 