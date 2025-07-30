# 邮件发送功能设置指南

## 问题描述
邀请朋友页面点击"Send Email"时出现"❌ Failed to send invite email"错误。

## 问题原因
邮件发送功能需要Gmail SMTP配置，但环境变量未设置。

## 解决方案

### 1. 创建环境变量文件
在 `server` 目录下创建 `.env` 文件：

```bash
cd server
touch .env
```

### 2. 配置邮件设置
在 `.env` 文件中添加以下内容：

```env
# 邮件配置
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/myhabit-app

# 前端URL
FRONTEND_URL=http://localhost:3000

# JWT密钥
JWT_SECRET=your-jwt-secret-key

# 端口
PORT=5000
```

### 3. 获取Gmail应用密码

#### 步骤1：开启两步验证
1. 登录Google账户
2. 进入 [Google安全设置](https://myaccount.google.com/security)
3. 开启"两步验证"

#### 步骤2：生成应用专用密码
1. 在安全设置中找到"应用专用密码"
2. 点击"生成新的应用专用密码"
3. 选择"邮件"应用
4. 复制生成的16位密码

#### 步骤3：更新.env文件
将生成的密码替换 `your-app-password`：
```env
EMAIL_PASS=abcd efgh ijkl mnop
```

### 4. 重启服务器
```bash
# 停止当前服务器
Ctrl+C

# 重新启动
npm run dev
```

### 5. 测试邮件功能
运行测试脚本验证配置：
```bash
node test-email.js
```

## 注意事项

1. **不要使用普通密码**：必须使用应用专用密码
2. **保护.env文件**：不要提交到Git仓库
3. **Gmail限制**：每天发送邮件数量有限制
4. **测试环境**：建议使用测试邮箱进行测试

## 替代方案

如果不想配置Gmail SMTP，可以：

1. **使用其他邮件服务**：如SendGrid、Mailgun等
2. **模拟邮件发送**：在开发环境中模拟成功响应
3. **使用本地邮件服务器**：如MailHog

## 故障排除

### 常见错误
- `535-5.7.8 Username and Password not accepted`：应用密码错误
- `Invalid login`：邮箱或密码格式错误
- `Connection timeout`：网络连接问题

### 调试步骤
1. 检查.env文件格式
2. 验证Gmail应用密码
3. 确认两步验证已开启
4. 检查网络连接
5. 查看服务器日志 