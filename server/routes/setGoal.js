// server/routes/goal.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const Goal = require('../models/Goal');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

router.post('/set-goal', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemsPerDay, days, punishment } = req.body;

    if (!itemsPerDay || isNaN(itemsPerDay) || itemsPerDay <= 0) {
      return res.status(400).json({ message: '每天清理物品数量无效' });
    }

    if (!days || isNaN(days) || days <= 0) {
      return res.status(400).json({ message: '目标天数无效' });
    }

    // 验证惩罚设置
    if (punishment) {
      if (punishment.amount && (isNaN(punishment.amount) || punishment.amount < 0)) {
        return res.status(400).json({ message: '惩罚金额无效' });
      }
      
      if (punishment.type && !['platform', 'friend'].includes(punishment.type)) {
        return res.status(400).json({ message: '惩罚类型无效' });
      }
      
      if (punishment.type === 'friend' && (!punishment.friendContact || punishment.friendContact.trim() === '')) {
        return res.status(400).json({ message: '请提供朋友联系方式' });
      }
    }

    const startDate = new Date().toISOString().split('T')[0]; // 当前日期

    // 保存到数据库
    const goalData = {
      userId,
      startDate,
      days,
      itemsPerDay,
      punishment: punishment || { amount: 0, type: 'platform', friendContact: '' }
    };

    // 查找并更新或创建新目标
    await Goal.findOneAndUpdate(
      { userId },
      goalData,
      { upsert: true, new: true }
    );

    // 同时保存到文件（保持向后兼容）
    const goalPath = path.join(uploadDir, `${userId}-goal.json`);
    fs.writeFileSync(goalPath, JSON.stringify(goalData, null, 2));

    res.json({ message: '目标已保存！' });
  } catch (error) {
    console.error('设置目标错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;


