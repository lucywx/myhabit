# 前端页面结构

## 📱 页面层级结构

### 1. **主页 (HomePage)**
- **路径**: `/home`
- **功能**: 包含登录和注册逻辑
- **文件**: `client/src/HomePage.jsx`

### 2. **目标设定 (SetGoalPage)**
- **路径**: `/set-goal`
- **功能**: 设置习惯养成目标
- **文件**: `client/src/SetGoalPage.jsx`

### 3. **价格设定 (SetPricePage)**
- **路径**: `/set-price`
- **功能**: 设置价格机制（原惩罚设置）
- **文件**: `client/src/SetPricePage.jsx`

### 4. **银行信息设置 (SetBankPage)**
- **路径**: `/set-bank`
- **功能**: 设置银行账户信息
- **文件**: `client/src/SetBankPage.jsx`

### 5. **打卡 (CheckinPage)**
- **路径**: `/checkin`
- **功能**: 每日打卡上传照片
- **文件**: `client/src/CheckinPage.jsx`

### 6. **用户中心 (UserCenter)**
- **路径**: `/user-center`
- **功能**: 用户中心主页面
- **文件**: `client/src/UserCenter.jsx`

#### 6.1 **我的习惯 (MyHabitsPage)**
- **路径**: `/my-habits`
- **功能**: 查看习惯养成状态
- **文件**: `client/src/MyHabitsPage.jsx`

#### 6.2 **银行转账记录 (TransferRecordPage)**
- **路径**: `/transfer-record`
- **功能**: 查看转账历史记录
- **文件**: `client/src/TransferRecordPage.jsx`

#### 6.3 **邀请朋友 (InviteFriendModal)**
- **功能**: 邀请朋友监督
- **文件**: `client/src/InviteFriendModal.jsx`

#### 6.4 **设置 (SettingsPopup)**
- **功能**: 修改密码等设置
- **文件**: `client/src/SettingsPopup.jsx`

#### 6.5 **用户头像 (UserAccountPopup)**
- **功能**: 管理用户头像
- **文件**: `client/src/UserAccountPopup.jsx`

#### 6.6 **登出 (SignOut)**
- **功能**: 用户登出
- **位置**: 在UserCenter中实现

## 🔗 路由配置

```javascript
// App.js 中的路由配置
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/home" element={<HomePage />} />
  <Route path="/set-goal" element={<SetGoalPage />} />
  <Route path="/set-price" element={<SetPricePage />} />
  <Route path="/set-bank" element={<SetBankPage />} />
  <Route path="/checkin" element={<CheckinPage />} />
  <Route path="/my-habits" element={<MyHabitsPage />} />
  <Route path="/transfer-record" element={<TransferRecordPage />} />
  <Route path="/user-center" element={<UserCenter />} />
</Routes>
```

## 📋 页面重命名对照表

| 原名称 | 新名称 | 路径 |
|--------|--------|------|
| ProgressPage | CheckinPage | `/checkin` |
| TransferRecordsPage | TransferRecordPage | `/transfer-record` |
| PriceSettingsPage | SetPricePage | `/set-price` |
| BankInfoPage | SetBankPage | `/set-bank` |

## 🎯 页面功能说明

### 主要页面
1. **HomePage**: 应用主页，包含登录状态和主要功能入口
2. **SetGoalPage**: 设定习惯养成目标
3. **SetPricePage**: 设置价格机制（替代惩罚概念）
4. **SetBankPage**: 配置银行信息用于转账
5. **CheckinPage**: 每日打卡上传照片

### 用户中心子页面
1. **MyHabitsPage**: 查看习惯养成进度
2. **TransferRecordPage**: 查看转账记录
3. **InviteFriendModal**: 邀请朋友功能
4. **SettingsPopup**: 用户设置（密码修改等）
5. **UserAccountPopup**: 头像管理
6. **登出功能**: 在UserCenter中实现

## 🔄 页面流程

```
登录/注册 → 主页 → 目标设定 → 价格设定 → 银行信息 → 开始打卡
                ↓
            用户中心 → 我的习惯/转账记录/设置/邀请朋友
``` 