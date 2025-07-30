import React from 'react';
import { Link } from 'react-router-dom';

function MyHabitsPage({ user }) {
  return (
    <div>
      <nav className="nav-bar">
        <div className="nav-container">
          <h2>MyHabit App</h2>
          <div className="nav-links">
            <Link to="/home">首页</Link>
            <Link to="/my-habits">我的习惯</Link>
            <Link to="/checkin">打卡</Link>
            <Link to="/transfer-record">转账记录</Link>
            <Link to="/user-center">用户中心</Link>
          </div>
        </div>
      </nav>

      <div className="page-container">
        <div className="card">
          <h2>我的习惯</h2>
          <p>这里将显示您的习惯列表和进度</p>
          <Link to="/set-goal" className="btn btn-primary">设置新目标</Link>
        </div>
      </div>
    </div>
  );
}

export default MyHabitsPage; 