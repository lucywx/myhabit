// server/routes/userProfile.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Checkin = require('../models/Checkin');

const router = express.Router();

// 获取用户档案信息
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // 获取用户基本信息
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取当前进行中的目标
    const currentGoal = await Goal.findOne({ userId });
    
    // 获取所有历史目标（通过checkin记录计算）
    const allCheckins = await Checkin.find({ userId }).sort({ date: 1 });
    
    // 计算已完成的目标
    let completedGoals = 0;
    let totalItemsCleaned = 0;
    
    if (allCheckins.length > 0) {
      // 按日期分组统计
      const checkinsByDate = {};
      allCheckins.forEach(checkin => {
        if (!checkinsByDate[checkin.date]) {
          checkinsByDate[checkin.date] = 0;
        }
        checkinsByDate[checkin.date] += checkin.itemsCleaned || 0;
      });
      
      // 计算完成的目标天数
      if (currentGoal) {
        const startDate = new Date(currentGoal.startDate);
        const today = new Date();
        const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // 统计完成的天数（每天达到目标数量）
        let completedDays = 0;
        for (let i = 0; i < daysPassed; i++) {
          const checkDate = new Date(startDate);
          checkDate.setDate(startDate.getDate() + i);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          if (checkinsByDate[dateStr] && checkinsByDate[dateStr] >= currentGoal.dailyTarget) {
            completedDays++;
          }
        }
        
        // 如果完成天数达到目标天数，则算作一个已完成目标
        if (completedDays >= currentGoal.days) {
          completedGoals = Math.floor(completedDays / currentGoal.days);
        }
      }
      
      // 计算总清理物品数
      totalItemsCleaned = allCheckins.reduce((sum, checkin) => sum + (checkin.itemsCleaned || 0), 0);
    }

    // 构建响应数据
    const profileData = {
      user: {
        username: user.username,
        email: user.email || '未设置邮箱',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'
      },
      statistics: {
        completedGoals,
        totalItemsCleaned,
        currentGoal: currentGoal ? {
          dailyTarget: currentGoal.dailyTarget,
          days: currentGoal.days,
          startDate: currentGoal.startDate,
          daysCompleted: allCheckins.length > 0 ? Math.floor(allCheckins.length / currentGoal.dailyTarget) : 0
        } : null
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('获取用户档案错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 