// server/routes/goal.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const Goal = require('../models/Goal');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

// 获取当前目标
router.get('/get-goal', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const currentGoal = await Goal.findOne({ userId });
    
    if (!currentGoal) {
      return res.json({ 
        hasGoal: false,
        goal: null 
      });
    }
    
    res.json({
      hasGoal: true,
      goal: {
        _id: currentGoal._id,
        goalContent: currentGoal.goalContent,
        userId: currentGoal.userId,
        startDate: currentGoal.startDate || null // 保留startDate用于进度页面
      }
    });
  } catch (error) {
    console.error('获取当前目标错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/set-goal', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { goalContent } = req.body;

    if (!goalContent || goalContent.trim() === '') {
      return res.status(400).json({ message: '目标内容不能为空' });
    }

    // 保存到数据库
    const goalData = {
      userId,
      goalContent: goalContent || ''
    };

    // 查找并更新或创建新目标
    await Goal.findOneAndUpdate(
      { userId },
      goalData,
      { upsert: true, new: true }
    );



    res.json({ message: '目标已保存！' });
  } catch (error) {
    console.error('设置目标错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;


