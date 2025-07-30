const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserProgress = require('../models/UserProgress');

// 获取用户当前进度
router.get('/get-progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const progress = await UserProgress.findOrCreateByUserId(userId);

        res.json({
            currentStep: progress.currentStep,
            completedSteps: progress.completedSteps,
            lastUpdated: progress.lastUpdated
        });
    } catch (error) {
        console.error('获取用户进度失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 更新用户进度
router.post('/update-progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { step } = req.body;

        if (!step || !['goal', 'price', 'bank', 'checkin'].includes(step)) {
            return res.status(400).json({ message: '无效的步骤' });
        }

        const progress = await UserProgress.findOrCreateByUserId(userId);
        await progress.updateProgress(step);

        res.json({
            message: '进度已更新',
            currentStep: progress.currentStep,
            completedSteps: progress.completedSteps
        });
    } catch (error) {
        console.error('更新用户进度失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 获取用户应该进入的页面
router.get('/get-current-page', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const progress = await UserProgress.findOrCreateByUserId(userId);

        // 检查用户是否完成了所有必要步骤
        const hasGoal = await require('../models/Goal').findOne({ userId });
        const hasPrice = await require('../models/PriceSettings').findOne({ userId });

        let currentPage = progress.currentStep;

        // 如果用户没有设置目标，强制回到目标页面
        if (!hasGoal) {
            currentPage = 'goal';
        }
        // 如果用户没有设置价格，强制回到价格页面
        else if (!hasPrice) {
            currentPage = 'price';
        }
        // 如果用户完成了所有设置，进入打卡页面
        else if (hasGoal && hasPrice) {
            currentPage = 'checkin';
        }

        res.json({
            currentPage,
            hasGoal: !!hasGoal,
            hasPrice: !!hasPrice,
            completedSteps: progress.completedSteps
        });
    } catch (error) {
        console.error('获取当前页面失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router; 