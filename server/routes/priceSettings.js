const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const PriceSettings = require('../models/PriceSettings');

// 获取价格设置
router.get('/get-price', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const priceSettings = await PriceSettings.findOne({ userId });

    if (!priceSettings) {
      return res.json({
        settings: {
          enabled: false,
          amount: 0,
          type: 'platform',
          friendEmail: ''
        }
      });
    }

    const settings = {
      enabled: priceSettings.enabled,
      amount: priceSettings.amount,
      type: priceSettings.type,
      friendEmail: priceSettings.friendEmail
    };

    res.json({ settings });
  } catch (error) {
    console.error('获取价格设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新价格设置
router.put('/update-price', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { enabled, amount, type, friendEmail } = req.body;

    if (!enabled) {
      return res.status(400).json({ message: '请启用价格机制' });
    }

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: '请输入有效的价格金额' });
    }

    if (type === 'friend' && !friendEmail) {
      return res.status(400).json({ message: '请输入朋友邮箱' });
    }

    // 查找并更新或创建价格设置
    const priceSettings = await PriceSettings.findOneAndUpdate(
      { userId },
      {
        enabled: true,
        amount: parseFloat(amount),
        type: type || 'platform',
        friendEmail: friendEmail || ''
      },
      { upsert: true, new: true }
    );

    res.json({
      message: '价格设置已更新',
      settings: {
        enabled: true,
        amount: priceSettings.amount,
        type: priceSettings.type,
        friendEmail: priceSettings.friendEmail
      }
    });
  } catch (error) {
    console.error('更新价格设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 