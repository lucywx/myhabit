const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 获取订阅信息
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 这里可以添加订阅逻辑
    res.json({
      message: 'Subscription endpoint',
      userId: userId
    });
  } catch (error) {
    console.error('获取订阅信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 