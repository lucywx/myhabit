# 🚀 7 DAY CHALLENGE - 云端部署指南

## 📋 部署方案

### 方案一：Vercel + Railway（推荐）

#### 1. 前端部署到 Vercel

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **在 client 目录下部署**
```bash
cd client
vercel
```

3. **设置环境变量**
在 Vercel 控制台中设置：
```
REACT_APP_API_BASE=https://your-railway-app.railway.app
```

#### 2. 后端部署到 Railway

1. **注册 Railway 账号**
- 访问 https://railway.app
- 使用 GitHub 登录

2. **连接 GitHub 仓库**
- 将代码推送到 GitHub
- 在 Railway 中导入仓库

3. **设置环境变量**
在 Railway 控制台中设置：
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myhabit-app
```

#### 3. 数据库设置

1. **MongoDB Atlas**
- 注册 https://mongodb.com/atlas
- 创建免费集群
- 获取连接字符串

2. **设置数据库用户**
- 创建数据库用户
- 设置网络访问（0.0.0.0/0）

### 方案二：Netlify + Render

#### 1. 前端部署到 Netlify

1. **构建项目**
```bash
cd client
npm run build
```

2. **拖拽部署**
- 将 `build` 文件夹拖拽到 Netlify

#### 2. 后端部署到 Render

1. **注册 Render 账号**
- 访问 https://render.com

2. **创建 Web Service**
- 连接 GitHub 仓库
- 设置构建命令：`npm install`
- 设置启动命令：`npm start`

### 方案三：Heroku（传统方案）

#### 1. 前端部署
```bash
cd client
heroku create your-app-name
git push heroku main
```

#### 2. 后端部署
```bash
cd server
heroku create your-api-name
heroku config:set MONGODB_URI=your-mongodb-uri
git push heroku main
```

## 🔧 本地测试

### 启动服务器
```bash
cd server
npm start
```

### 启动客户端
```bash
cd client
npm start
```

## 📱 分享给朋友

部署完成后，朋友可以通过以下方式访问：

### 前端地址
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- Heroku: `https://your-app.herokuapp.com`

### 功能说明
1. **注册账号** - 创建个人账户
2. **设置目标** - 定义7天整理挑战
3. **每日打卡** - 上传整理照片
4. **惩罚机制** - 忘记打卡时点击钞票转账

## ⚠️ 注意事项

1. **环境变量** - 确保正确设置 API 地址
2. **CORS 设置** - 允许前端域名访问
3. **文件上传** - 确保上传目录可写
4. **数据库连接** - 使用云数据库

## 🎯 快速部署命令

```bash
# 1. 推送到 GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. 部署前端到 Vercel
cd client
vercel --prod

# 3. 部署后端到 Railway
# 在 Railway 控制台中导入仓库并部署
```

## 📞 技术支持

如果遇到问题，检查：
1. 环境变量设置
2. 数据库连接
3. 端口配置
4. CORS 设置 