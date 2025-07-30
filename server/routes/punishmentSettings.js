const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const PunishmentSettings = require('../models/PunishmentSettings');

// 获取惩罚设置
router.get('/get-punishment-settings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const punishmentSettings = await PunishmentSettings.findOne({ userId });
    
    if (!punishmentSettings) {
      return res.json({ 
        settings: { 
          enabled: false, 
          amount: 0, 
          type: 'platform', 
          friendContact: '' 
        } 
      });
    }

    const settings = {
      enabled: punishmentSettings.enabled,
      amount: punishmentSettings.amount,
      type: punishmentSettings.type,
      friendContact: punishmentSettings.friendContact
    };

    res.json({ settings });
  } catch (error) {
    console.error('获取惩罚设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新惩罚设置
router.put('/update-punishment-settings', authMiddleware, async (req, res) => {
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

    // 查找并更新或创建惩罚设置
    const punishmentSettings = await PunishmentSettings.findOneAndUpdate(
      { userId },
      {
        enabled: true,
        amount: parseFloat(amount),
        type: type || 'platform',
        friendContact: friendContact || '',
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      message: '惩罚设置已更新',
      settings: { 
        enabled: true, 
        amount: punishmentSettings.amount, 
        type: punishmentSettings.type, 
        friendContact: punishmentSettings.friendContact 
      }
    });
  } catch (error) {
    console.error('更新惩罚设置失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 