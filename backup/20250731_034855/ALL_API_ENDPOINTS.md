# 所有API端点完整列表

## 📋 基础信息

- **服务器地址**: `http://localhost:5000`
- **API基础路径**: `/api`
- **静态文件路径**: `/uploads/*`

---

## 🔐 认证相关 (8个端点)

### `/api/auth`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/verify` | 验证token | ✅ |
| GET | `/api/auth/user/profile` | 获取用户资料 | ✅ |
| GET | `/api/auth/users/search` | 搜索用户 | ✅ |
| POST | `/api/auth/upload-avatar` | 上传头像 | ✅ |

---

## 🎯 目标管理 (2个端点)

### `/api/goals`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| GET | `/api/goals/get-goal` | 获取用户目标 | ✅ |
| POST | `/api/goals/set-goal` | 设置用户目标 | ✅ |

---

## 💰 价格设置 (2个端点)

### `/api/user`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| GET | `/api/user/get-price` | 获取价格设置 | ✅ |
| PUT | `/api/user/update-price` | 更新价格设置 | ✅ |

---

## 🏦 银行信息 (4个端点)

### `/api/bank-info`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| GET | `/api/bank-info/get-bank` | 获取银行信息 | ✅ |
| POST | `/api/bank-info/set-bank` | 设置银行信息 | ✅ |
| PUT | `/api/bank-info/` | 更新银行信息 | ✅ |
| DELETE | `/api/bank-info/` | 删除银行信息 | ✅ |

---

## 📸 打卡相关 (7个端点)

### `/api/progress`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| GET | `/api/progress/get-checkin-image` | 获取打卡图片 | ✅ |
| POST | `/api/progress/upload-checkin-image` | 上传打卡图片 | ✅ |
| GET | `/api/progress/challenge-summary` | 获取挑战总结 | ✅ |
| POST | `/api/progress/reupload/:day` | 重新上传某天图片 | ✅ |

### `/api`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| GET | `/api/check-missed` | 检查遗漏打卡 | ✅ |

---

## 💳 支付相关 (9个端点)

### `/api/payment`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| POST | `/api/payment/create-payment-intent` | 创建支付意图 | ✅ |
| POST | `/api/payment/confirm-payment` | 确认支付 | ✅ |
| GET | `/api/payment/get-payment-history` | 获取支付历史 | ✅ |
| POST | `/api/payment/webhook` | Stripe webhook | ❌ |

### `/api/mock-payment`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| POST | `/api/mock-payment/transfer` | 模拟转账 | ✅ |
| GET | `/api/mock-payment/transfers` | 获取转账记录 | ✅ |
| GET | `/api/mock-payment/received` | 获取收到的转账 | ✅ |
| DELETE | `/api/mock-payment/transfers` | 删除转账记录 | ✅ |
| GET | `/api/mock-payment/stats` | 获取转账统计 | ✅ |

---

## 👥 邀请系统 (8个端点)

### `/api/invite`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| POST | `/api/invite/generate-invite` | 生成邀请 | ✅ |
| GET | `/api/invite/my-invites` | 获取我的邀请 | ✅ |
| GET | `/api/invite/validate-invite/:inviteId` | 验证邀请 | ❌ |
| POST | `/api/invite/use-invite/:inviteId` | 使用邀请 | ❌ |
| POST | `/api/invite/send-email` | 发送邀请邮件 | ✅ |
| POST | `/api/invite/cleanup-expired` | 清理过期邀请 | ❌ |

### `/api/invite` (Mock版本)
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| POST | `/api/invite/send-email-mock` | 模拟发送邮件 | ✅ |
| POST | `/api/invite/generate-invite-mock` | 模拟生成邀请 | ✅ |

---

## 👤 用户资料 (2个端点)

### `/api/user`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| GET | `/api/user/profile` | 获取用户资料 | ✅ |

### `/api`
| 方法 | 完整路径 | 功能 | 认证 |
|------|----------|------|------|
| POST | `/api/upload-avatar` | 上传头像 | ✅ |

---

## 📁 静态文件 (1个路径)

| 路径 | 功能 |
|------|------|
| `/uploads/*` | 上传的文件（图片等） |

---

## 📊 端点统计

### 按功能模块分类
- **认证系统**: 8个端点
- **目标管理**: 2个端点
- **价格设置**: 2个端点
- **银行信息**: 4个端点
- **打卡系统**: 7个端点
- **支付系统**: 9个端点
- **邀请系统**: 8个端点
- **用户资料**: 2个端点
- **静态文件**: 1个路径

### 按HTTP方法分类
- **GET**: 15个端点
- **POST**: 18个端点
- **PUT**: 3个端点
- **DELETE**: 3个端点

### 按认证要求分类
- **需要认证**: 38个端点 (90%)
- **无需认证**: 4个端点 (10%)

---

## 🔗 完整端点列表 (按字母顺序)

```
/api/auth/login
/api/auth/register
/api/auth/upload-avatar
/api/auth/user/profile
/api/auth/users/search
/api/auth/verify
/api/bank-info/
/api/bank-info/get-bank
/api/bank-info/set-bank
/api/check-missed
/api/goals/get-goal
/api/goals/set-goal
/api/invite/cleanup-expired
/api/invite/generate-invite
/api/invite/generate-invite-mock
/api/invite/my-invites
/api/invite/send-email
/api/invite/send-email-mock
/api/invite/use-invite/:inviteId
/api/invite/validate-invite/:inviteId
/api/mock-payment/received
/api/mock-payment/stats
/api/mock-payment/transfer
/api/mock-payment/transfers
/api/payment/confirm-payment
/api/payment/create-payment-intent
/api/payment/get-payment-history
/api/payment/webhook
/api/progress/challenge-summary
/api/progress/reupload/:day
/api/progress/get-checkin-image
/api/progress/upload-checkin-image
/api/upload-avatar
/api/user/get-price
/api/user/profile
/api/user/update-price
/uploads/*
```

---

## 🚨 重要说明

1. **认证**: 大部分端点需要JWT token，在请求头中添加 `Authorization: Bearer <token>`
2. **文件上传**: 使用 `multipart/form-data` 格式
3. **动态参数**: `:inviteId` 和 `:day` 为路径参数
4. **CORS**: 已启用跨域支持
5. **文件大小限制**: 图片上传限制为10MB 