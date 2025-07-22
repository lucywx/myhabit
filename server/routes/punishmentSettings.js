const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Goal = require('../models/Goal');

// 获取惩罚设置
router.get('/punishment-settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!goal) {
      return res.json({ 
        settings: { 
          enabled: false, 
          amount: '', 
          type: 'platform', 
          friendContact: '' 
        } 
      });
    }

    const settings = {
      enabled: goal.punishment && goal.punishment.amount > 0,
      amount: goal.punishment ? goal.punishment.amount : '',
      type: goal.punishment ? goal.punishment.type : 'platform',
      friendContact: goal.punishment ? goal.punishment.friendContact : ''
    };

    res.json({ settings });
  } catch (error) {
    console.error('获取惩罚设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新惩罚设置
router.put('/punishment-settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { enabled, amount, type, friendContact } = req.body;

    if (!enabled) {
      return res.status(400).json({ message: '请启用惩罚机制' });
    }

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: '请输入有效的惩罚金额' });
    }

    if (type === 'friend' && !friendContact) {
      return res.status(400).json({ message: '请输入朋友用户名' });
    }

    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!goal) {
      return res.status(404).json({ message: '未找到用户目标' });
    }

    // 更新惩罚设置
    goal.punishment = {
      amount: parseFloat(amount),
      type: type || 'platform',
      friendContact: friendContact || ''
    };

    await goal.save();

    res.json({
      message: '惩罚设置已更新',
      settings: { enabled: true, amount, type, friendContact }
    });
  } catch (error) {
    console.error('更新惩罚设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 