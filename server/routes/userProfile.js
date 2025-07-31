// server/routes/userProfile.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Checkin = require('../models/Checkin');
const bcrypt = require('bcrypt');

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

// 修改密码
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // 验证输入
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '请提供当前密码和新密码' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '新密码至少需要6个字符' });
    }

    // 获取用户信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: '当前密码错误' });
    }

    // 检查新密码是否与当前密码相同
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isNewPasswordSame) {
      return res.status(400).json({ message: '新密码不能与当前密码相同' });
    }

    // 加密新密码
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 更新密码
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 