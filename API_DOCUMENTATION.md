# API 文档

## 概述
本文档列出了应用中所有正确的API端点。

## 认证
所有API调用都需要在请求头中包含JWT token：
```
Authorization: Bearer <token>
```

## API 端点

### Goals API
- **GET** `/api/goals/get-goal` - 获取用户当前目标
- **POST** `/api/goals/set-goal` - 设置用户目标

### Progress API
- **GET** `/api/progress/get-checkin-image` - 获取用户打卡图片
- **POST** `/api/progress/upload-checkin-image` - 上传打卡图片

### User API
- **GET** `/api/user/get-punishment-settings` - 获取惩罚设置
- **PUT** `/api/user/update-punishment-settings` - 更新惩罚设置
- **POST** `/api/user/set-punishment-settings` - 设置惩罚设置
- **PUT** `/api/user/disable-punishment-settings` - 禁用惩罚设置

### Bank Info API
- **GET** `/api/bank-info/get-bank-info` - 获取银行信息
- **POST** `/api/bank-info/set-bank-info` - 设置银行信息

### Upload API
- **POST** `/api/upload/upload-avatar` - 上传用户头像

### Auth API
- **POST** `/api/auth/login` - 用户登录
- **POST** `/api/auth/register` - 用户注册

## 数据模型

### Goal 模型
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  goalContent: String,
  startDate: String (可选)
}
```

### PunishmentSettings 模型
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  enabled: Boolean,
  amount: Number,
  type: String ('platform' | 'friend'),
  friendContact: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User 模型
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  avatar: String (可选)
}
```

## 错误处理
所有API在出错时都会返回以下格式：
```javascript
{
  message: "错误描述"
}
```

## 状态码
- `200` - 成功
- `400` - 请求参数错误
- `401` - 未认证
- `404` - 资源不存在
- `500` - 服务器错误 