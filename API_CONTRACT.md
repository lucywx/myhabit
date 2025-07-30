# API 契约文档

## 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

## 目标管理
- `GET /api/goals/get-goal` - 获取当前目标
- `POST /api/goals/set-goal` - 设置目标

## 进度管理
- `GET /api/progress/get-checkin-image` - 获取每日打卡图片
- `POST /api/progress/upload-checkin-image` - 上传每日打卡图片

## 用户管理
- `GET /api/user/get-punishment-settings` - 获取惩罚设置
- `PUT /api/user/update-punishment-settings` - 更新惩罚设置
- `POST /api/upload-avatar` - 上传头像

## 银行信息
- `GET /api/get-bank-info` - 获取银行信息
- `POST /api/set-bank-info` - 设置银行信息

## 支付相关
- `POST /api/mock-payment` - 模拟支付

## 其他
- `GET /api/check-missed` - 检查错过打卡
- `POST /api/upload` - 通用文件上传

## 错误响应格式
```json
{
  "message": "错误信息"
}
```

## 成功响应格式
```json
{
  "message": "成功信息",
  "data": {}
}
``` 