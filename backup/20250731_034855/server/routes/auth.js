// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Added import for authMiddleware

const JWT_SECRET = 'your-secret'; // 实际部署时用 .env

// 注册
// auth.js
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      username,
      password: hashedPassword,
      email: email || ''
    });

    // 返回用户信息（不包含密码）
    res.json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'User does not exist' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Wrong password' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

  // 返回用户信息（不包含密码）
  res.json({
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || null
    }
  });
});

// 搜索用户接口
router.get('/users/search', authMiddleware, async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username cannot be empty' });
    }

    // Search for matching usernames (exclude current user)
    const users = await User.find({
      username: { $regex: username, $options: 'i' },
      _id: { $ne: req.user.userId }
    })
      .select('username')
      .limit(10);

    res.json({ users });
  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// 刷新token接口
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // 生成新的token
    const newToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Token refreshed',
      token: newToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
});

// 验证token接口
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    res.json({
      message: 'Token valid',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Token verification failed' });
  }
});

// 获取用户档案接口
router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Get user statistics (can add more statistics as needed)
    const statistics = {
      completedGoals: 0,
      totalItemsCleaned: 0,
      currentGoal: null
    };

    res.json({
      user: {
        username: user.username,
        email: user.email,
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'Unknown'
      },
      statistics
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
});

// 上传头像接口
router.post('/upload-avatar', authMiddleware, async (req, res) => {
  try {
    // This should handle file upload, temporarily return a mock avatar URL
    const avatarUrl = `https://via.placeholder.com/150/3498db/ffffff?text=${req.user.userId.slice(-2)}`;

    res.json({ avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
});

module.exports = router;
