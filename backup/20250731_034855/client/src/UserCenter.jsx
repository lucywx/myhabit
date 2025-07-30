import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserCenter.css';

function UserCenter({ user, onLogout, onOpenMyHabits, onOpenTransferRecords, onOpenInviteFriend, onOpenSettings }) {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();

  const handleSignOut = () => {
    onLogout();
    navigate('/login');
  };

  const renderProfileSection = () => (
    <div className="profile-section">
      <div className="user-avatar">
        <img
          src={user?.avatar || '/default-avatar.png'}
          alt="用户头像"
          className="avatar-image"
        />
        <button className="change-avatar-btn">更换头像</button>
      </div>
      <div className="user-info">
        <h3>{user?.username || '用户名'}</h3>
        <p className="user-email">{user?.email || '邮箱'}</p>
        <p className="user-join-date">加入时间: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'}</p>
      </div>
    </div>
  );

  const renderMyHabitsSection = () => (
    <div className="section-content">
      <h3>我的习惯</h3>
      <p>查看和管理你的习惯目标</p>
      <button onClick={onOpenMyHabits} className="section-btn">
        查看习惯
      </button>
    </div>
  );

  const renderTransferRecordSection = () => (
    <div className="section-content">
      <h3>转账记录</h3>
      <p>查看所有的价格转账历史</p>
      <button onClick={onOpenTransferRecords} className="section-btn">
        查看记录
      </button>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="section-content">
      <h3>设置</h3>
      <p>修改密码和其他账户设置</p>
      <button onClick={onOpenSettings} className="section-btn">
        打开设置
      </button>
    </div>
  );

  const renderInviteFriendsSection = () => (
    <div className="section-content">
      <h3>邀请朋友</h3>
      <p>邀请朋友一起养成好习惯</p>
      <button onClick={onOpenInviteFriend} className="section-btn">
        邀请朋友
      </button>
    </div>
  );

  const renderSignOutSection = () => (
    <div className="section-content">
      <h3>退出登录</h3>
      <p>安全退出当前账户</p>
      <button onClick={handleSignOut} className="section-btn signout-btn">
        退出登录
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'my-habits':
        return renderMyHabitsSection();
      case 'transfer-record':
        return renderTransferRecordSection();
      case 'settings':
        return renderSettingsSection();
      case 'invite-friends':
        return renderInviteFriendsSection();
      case 'sign-out':
        return renderSignOutSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="user-center-container">
      {/* 头部导航 */}
      <header className="user-center-header">
        <div className="header-left">
          <button onClick={() => navigate('/main')} className="back-btn">
            ← 返回主页面
          </button>
          <h1>用户中心</h1>
        </div>
      </header>

      <div className="user-center-content">
        {/* 侧边栏导航 */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">个人资料</span>
            </button>

            <button
              className={`nav-item ${activeSection === 'my-habits' ? 'active' : ''}`}
              onClick={() => setActiveSection('my-habits')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">我的习惯</span>
            </button>

            <button
              className={`nav-item ${activeSection === 'transfer-record' ? 'active' : ''}`}
              onClick={() => setActiveSection('transfer-record')}
            >
              <span className="nav-icon">💰</span>
              <span className="nav-text">转账记录</span>
            </button>

            <button
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">设置</span>
            </button>

            <button
              className={`nav-item ${activeSection === 'invite-friends' ? 'active' : ''}`}
              onClick={() => setActiveSection('invite-friends')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">邀请朋友</span>
            </button>

            <button
              className={`nav-item ${activeSection === 'sign-out' ? 'active' : ''}`}
              onClick={() => setActiveSection('sign-out')}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-text">退出登录</span>
            </button>
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="main-content">
          <div className="content-card">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserCenter; 