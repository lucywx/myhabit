import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    onLogin(userData);
    navigate('/main');
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };

  return (
    <div className="home-container">
      {/* 背景遮罩 */}
      <div className="background-overlay"></div>

      {/* 主要内容 */}
      <div className="home-content">
        {/* 品牌区域 */}
        <div className="brand-section">
          <h1 className="app-title">MyHabit</h1>
          <p className="app-subtitle">养成好习惯，成就更好的自己</p>
        </div>

        {/* 登录/注册区域 */}
        <div className="auth-section">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(true)}
            >
              登录
            </button>
            <button
              className={`auth-tab ${!showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(false)}
            >
              注册
            </button>
          </div>

          <div className="auth-content">
            {showLogin ? (
              <LoginForm onLogin={handleLoginSuccess} />
            ) : (
              <RegisterForm onRegister={handleRegisterSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 登录表单组件
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        onLogin({ ...data.user, token: data.token });
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || '登录失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="用户名"
          value={formData.username}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="密码"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        className="auth-button"
        disabled={loading}
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}

// 注册表单组件
function RegisterForm({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 发送注册数据:', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      console.log('📡 响应状态:', response.status);
      console.log('📡 响应头:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 注册成功:', data);
        onRegister();
      } else {
        const errorData = await response.json();
        console.log('❌ 注册失败:', errorData);
        setError(errorData.error || errorData.message || '注册失败');
      }
    } catch (error) {
      console.error('💥 网络错误:', error);
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="用户名"
          value={formData.username}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="邮箱"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="密码"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="确认密码"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        className="auth-button"
        disabled={loading}
      >
        {loading ? '注册中...' : '注册'}
      </button>
    </form>
  );
}

export default HomePage; 