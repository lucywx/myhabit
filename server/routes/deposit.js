const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// ===== 存款设置相关 =====

// 获取存款设置
router.get('/setup', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 这里可以添加获取存款设置的逻辑
    res.json({
      message: 'Get deposit setup',
      userId: userId,
      setup: {
        enabled: false,
        amount: 0,
        recipientType: 'platform',
        recipientEmail: ''
      }
    });
  } catch (error) {
    console.error('获取存款设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新存款设置
router.put('/setup', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { enabled, amount, recipientType, recipientEmail } = req.body;
    
    // 这里可以添加更新存款设置的逻辑
    res.json({
      message: 'Update deposit setup',
      userId: userId,
      setup: {
        enabled: enabled || false,
        amount: amount || 0,
        recipientType: recipientType || 'platform',
        recipientEmail: recipientEmail || ''
      }
    });
  } catch (error) {
    console.error('更新存款设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// ===== 存款操作相关 =====

// 创建存款意图
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, recipientEmail, recipientType } = req.body;
    
    // 这里可以添加创建存款意图的逻辑
    res.json({
      message: 'Create deposit intent',
      userId: userId,
      intent: {
        id: 'deposit_intent_' + Date.now(),
        amount: amount,
        recipientEmail: recipientEmail,
        recipientType: recipientType
      }
    });
  } catch (error) {
    console.error('创建存款意图失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 确认存款
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { intentId, amount } = req.body;
    
    // 这里可以添加确认存款的逻辑
    res.json({
      message: 'Confirm deposit',
      userId: userId,
      deposit: {
        id: 'deposit_' + Date.now(),
        intentId: intentId,
        amount: amount,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('确认存款失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取存款状态
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 这里可以添加获取存款状态的逻辑
    res.json({
      message: 'Get deposit status',
      userId: userId,
      status: {
        hasDeposit: false,
        amount: 0,
        status: 'none'
      }
    });
  } catch (error) {
    console.error('获取存款状态失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 兼容旧API
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    res.json({
      message: 'Deposit endpoint (legacy)',
      userId: userId
    });
  } catch (error) {
    console.error('获取存款信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 