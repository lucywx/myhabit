# API 路径规范

## 📋 概述

基础URL: `http://localhost:5000/api`

所有需要认证的API都需要在请求头中包含：
```
Authorization: Bearer <token>
```

## 🔐 认证相关 API

### 基础路径: `/api/auth`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/auth/register` | 用户注册 | ❌ |
| POST | `/auth/login` | 用户登录 | ❌ |
| GET | `/auth/verify` | 验证token | ✅ |
| GET | `/auth/user/profile` | 获取用户资料 | ✅ |
| GET | `/auth/users/search` | 搜索用户 | ✅ |
| POST | `/auth/upload-avatar` | 上传头像 | ✅ |

## 🎯 目标管理 API

### 基础路径: `/api/goals`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/goals/get-goal` | 获取用户目标 | ✅ |
| POST | `/goals/set-goal` | 设置用户目标 | ✅ |

## 💰 价格设置 API

### 基础路径: `/api/user`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/user/get-price` | 获取价格设置 | ✅ |
| PUT | `/user/update-price` | 更新价格设置 | ✅ |

## 🏦 银行信息 API

### 基础路径: `/api/bank-info`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/bank-info/get-bank` | 获取银行信息 | ✅ |
| POST | `/bank-info/set-bank` | 设置银行信息 | ✅ |
| PUT | `/bank-info/` | 更新银行信息 | ✅ |
| DELETE | `/bank-info/` | 删除银行信息 | ✅ |

## 📸 打卡相关 API

### 基础路径: `/api/progress`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/progress/get-checkin-image` | 获取打卡图片 | ✅ |
| POST | `/progress/upload-checkin-image` | 上传打卡图片 | ✅ |
| GET | `/progress/challenge-summary` | 获取挑战总结 | ✅ |
| POST | `/progress/reupload/:day` | 重新上传某天图片 | ✅ |

### 基础路径: `/api`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/check-missed` | 检查遗漏打卡 | ✅ |

## 💳 支付相关 API

### 基础路径: `/api/payment`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/payment/create-payment-intent` | 创建支付意图 | ✅ |
| POST | `/payment/confirm-payment` | 确认支付 | ✅ |
| GET | `/payment/get-payment-history` | 获取支付历史 | ✅ |
| POST | `/payment/webhook` | Stripe webhook | ❌ |

### 基础路径: `/api/mock-payment`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/mock-payment/transfer` | 模拟转账 | ✅ |
| GET | `/mock-payment/transfers` | 获取转账记录 | ✅ |
| GET | `/mock-payment/received` | 获取收到的转账 | ✅ |
| DELETE | `/mock-payment/transfers` | 删除转账记录 | ✅ |
| GET | `/mock-payment/stats` | 获取转账统计 | ✅ |

## 👥 邀请系统 API

### 基础路径: `/api/invite`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/invite/generate-invite` | 生成邀请 | ✅ |
| GET | `/invite/my-invites` | 获取我的邀请 | ✅ |
| GET | `/invite/validate-invite/:inviteId` | 验证邀请 | ❌ |
| POST | `/invite/use-invite/:inviteId` | 使用邀请 | ❌ |
| POST | `/invite/send-email` | 发送邀请邮件 | ✅ |
| POST | `/invite/cleanup-expired` | 清理过期邀请 | ❌ |

### 基础路径: `/api/invite` (Mock版本)

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/invite/send-email-mock` | 模拟发送邮件 | ✅ |
| POST | `/invite/generate-invite-mock` | 模拟生成邀请 | ✅ |

## 👤 用户资料 API

### 基础路径: `/api/user`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | `/user/profile` | 获取用户资料 | ✅ |

### 基础路径: `/api`

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/upload-avatar` | 上传头像 | ✅ |

## 📁 静态文件

| 路径 | 功能 |
|------|------|
| `/uploads/*` | 上传的文件（图片等） |

## 🔄 API 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细描述"
}
```

## 📝 请求示例

### 用户登录
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 获取用户目标
```bash
curl -X GET http://localhost:5000/api/goals/get-goal \
  -H "Authorization: Bearer <token>"
```

### 上传打卡图片
```bash
curl -X POST http://localhost:5000/api/progress/upload-checkin-image \
  -H "Authorization: Bearer <token>" \
  -F "image=@photo.jpg" \
  -F "day=1"
```

## 🚨 注意事项

1. **认证**: 大部分API需要JWT token认证
2. **文件上传**: 使用 `multipart/form-data` 格式
3. **错误处理**: 所有API都返回统一的错误格式
4. **CORS**: 已启用跨域支持
5. **文件大小**: 图片上传限制为10MB 