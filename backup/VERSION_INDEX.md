# MyHabit App 版本索引

## 版本历史

### v1.0.0 (2025-07-31 03:48:55)
**备份位置**: `backup/20250731_034855/`

**主要功能**:
- ✅ 用户认证系统 (登录/注册)
- ✅ 目标设置页面
- ✅ 价格设置页面  
- ✅ 银行信息设置页面
- ✅ 打卡系统 (7天习惯养成)
- ✅ 用户中心弹窗
- ✅ 智能页面跳转 (AuthRedirect)
- ✅ Token管理 (30天有效期)

**重要修复**:
- 修复Token过期问题
- 修复无限循环跳转问题
- 实现进度跟踪和保存逻辑

**技术栈**:
- 前端: React 18.2.0, React Router 6.3.0
- 后端: Node.js, Express 5.1.0, MongoDB, Mongoose 8.16.3
- 认证: JWT Token
- 文件上传: Multer

**数据库模型**:
- User, Goal, PriceSettings, BankInfo, Checkin, UserProgress, Payment, Invite

**当前状态**:
- 用户lux已完成所有设置，直接进入打卡页面
- 所有API正常工作
- 前端页面跳转逻辑正常

---

## 回滚指南

### 回滚到 v1.0.0
```bash
# 1. 备份当前代码
cp -r client client_backup_$(date +%Y%m%d_%H%M%S)
cp -r server server_backup_$(date +%Y%m%d_%H%M%S)

# 2. 恢复 v1.0.0
rm -rf client server
cp -r backup/20250731_034855/client ./
cp -r backup/20250731_034855/server ./

# 3. 恢复根目录文件
cp backup/20250731_034855/*.md ./
cp backup/20250731_034855/*.json ./
cp backup/20250731_034855/*.js ./

# 4. 重启服务
cd server && npm install && node index.js
cd ../client && npm install && npm start
```

### 检查版本
```bash
# 查看当前版本
cat VERSION

# 查看所有可用版本
ls backup/
```
