const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Checkin = require('../models/Checkin');
const Payment = require('../models/Payment');

// ===== 退款计算相关 =====

// 计算应返还金额
router.post('/calculate', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 获取用户目标信息
        const userGoal = await Goal.findOne({ userId });
        if (!userGoal || !userGoal.depositAmount) {
            return res.status(400).json({
                error: '未找到保证金记录',
                message: '请先设置保证金'
            });
        }

        // 获取用户打卡记录
        const checkin = await Checkin.findByUserId(userId);
        if (!checkin || !checkin.checkins) {
            return res.status(400).json({
                error: '未找到打卡记录',
                message: '请先开始打卡'
            });
        }

        const totalDeposit = userGoal.depositAmount;
        const totalDays = 7;
        const completedDays = checkin.checkins.length;
        const dailyAmount = Math.round(totalDeposit / totalDays);

        // 计算返还金额
        const refundAmount = completedDays * dailyAmount;
        const forfeitedAmount = totalDeposit - refundAmount;

        // 计算完成率
        const completionRate = (completedDays / totalDays) * 100;

        // 检查是否可以申请退款
        const canRefund = completedDays >= totalDays ||
            (new Date().getDate() > checkin.startDate.getDate() + 6);

        // 根据完成情况生成提示信息
        let encouragementMessage = '';
        let messageType = '';

        if (completionRate === 100) {
            // 100%完成
            encouragementMessage = '你的努力一定会有回报！';
            messageType = 'success';
        } else if (completedDays >= 4 && completedDays < 7) {
            // 4-6天完成
            encouragementMessage = '看见了你的努力，还差一点点，要不要再试试打卡一周。';
            messageType = 'encouragement';
        } else if (completedDays < 4) {
            // 少于4天
            encouragementMessage = '可能你还没有准备好，调整状态后再来试试吧！';
            messageType = 'suggestion';
        }

        res.json({
            success: true,
            calculation: {
                totalDeposit: totalDeposit,
                totalDays: totalDays,
                completedDays: completedDays,
                dailyAmount: dailyAmount,
                refundAmount: refundAmount,
                forfeitedAmount: forfeitedAmount,
                completionRate: completionRate
            },
            canRefund: canRefund,
            message: `完成 ${completedDays}/7 天，应返还 $${refundAmount}`,
            encouragement: {
                message: encouragementMessage,
                type: messageType,
                completionRate: completionRate
            }
        });

    } catch (error) {
        console.error('计算退款金额失败:', error);
        res.status(500).json({ error: '计算退款失败' });
    }
});

// ===== 退款处理相关 =====

// 处理退款
router.post('/process', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { refundAmount, recipientEmail, recipientType } = req.body;

        // 验证用户是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }

        // 获取用户目标信息
        const userGoal = await Goal.findOne({ userId });
        if (!userGoal || !userGoal.depositAmount) {
            return res.status(400).json({ error: '未找到保证金记录' });
        }

        // 获取打卡记录
        const checkin = await Checkin.findByUserId(userId);
        if (!checkin || !checkin.checkins) {
            return res.status(400).json({ error: '未找到打卡记录' });
        }

        const completedDays = checkin.checkins.length;
        const totalDays = 7;
        const dailyAmount = Math.round(userGoal.depositAmount / totalDays);
        const calculatedRefundAmount = completedDays * dailyAmount;

        // 验证退款金额
        if (refundAmount !== calculatedRefundAmount) {
            return res.status(400).json({
                error: '退款金额不匹配',
                calculatedAmount: calculatedRefundAmount,
                requestedAmount: refundAmount
            });
        }

        // 检查是否已经处理过退款
        const existingRefund = await Payment.findOne({
            userId: userId,
            type: 'refund',
            status: 'completed'
        });

        if (existingRefund) {
            return res.status(400).json({
                error: '退款已处理',
                message: '该用户的退款已经处理过了'
            });
        }

        // 创建退款记录
        const refundRecord = new Payment({
            userId: userId,
            paymentIntentId: `refund_${Date.now()}`,
            amount: refundAmount,
            type: 'refund',
            recipientContact: recipientEmail || userGoal.depositRecipient,
            recipientType: recipientType || userGoal.depositRecipientType,
            day: new Date().getDate(),
            status: 'completed',
            metadata: {
                username: user.username,
                goalContent: userGoal.goalContent,
                completedDays: completedDays,
                totalDays: totalDays,
                refundType: 'challenge_completed',
                originalDepositAmount: userGoal.depositAmount
            }
        });

        await refundRecord.save();
        console.log('退款记录已保存:', refundRecord._id);

        // 更新目标状态
        userGoal.refundAmount = refundAmount;
        userGoal.refundDate = new Date();
        userGoal.refundStatus = 'completed';
        await userGoal.save();

        res.json({
            success: true,
            message: `退款处理成功，返还金额: $${refundAmount}`,
            refund: {
                id: refundRecord._id,
                amount: refundAmount,
                completedDays: completedDays,
                status: 'completed',
                processedAt: new Date()
            }
        });

    } catch (error) {
        console.error('处理退款失败:', error);
        res.status(500).json({ error: '处理退款失败' });
    }
});

// ===== 退款状态查询 =====

// 获取退款状态
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 获取用户的退款记录
        const refunds = await Payment.find({
            userId: userId,
            type: 'refund'
        }).sort({ createdAt: -1 });

        // 获取用户目标信息
        const userGoal = await Goal.findOne({ userId });

        // 获取打卡记录
        const checkin = await Checkin.findByUserId(userId);

        const completedDays = checkin?.checkins?.length || 0;
        const totalDays = 7;
        const totalDeposit = userGoal?.depositAmount || 0;
        const dailyAmount = totalDeposit ? Math.round(totalDeposit / totalDays) : 0;
        const calculatedRefundAmount = completedDays * dailyAmount;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

        // 根据完成情况生成提示信息
        let encouragementMessage = '';
        let messageType = '';

        if (completionRate === 100) {
            // 100%完成
            encouragementMessage = '你的努力一定会有回报！';
            messageType = 'success';
        } else if (completedDays >= 4 && completedDays < 7) {
            // 4-6天完成
            encouragementMessage = '看见了你的努力，还差一点点，要不要再试试打卡一周。';
            messageType = 'encouragement';
        } else if (completedDays < 4) {
            // 少于4天
            encouragementMessage = '可能你还没有准备好，调整状态后再来试试吧！';
            messageType = 'suggestion';
        }

        res.json({
            success: true,
            currentStatus: {
                hasDeposit: !!userGoal?.depositAmount,
                totalDeposit: totalDeposit,
                completedDays: completedDays,
                totalDays: totalDays,
                calculatedRefundAmount: calculatedRefundAmount,
                completionRate: completionRate,
                canRefund: completedDays >= totalDays ||
                    (checkin && new Date().getDate() > checkin.startDate.getDate() + 6)
            },
            encouragement: {
                message: encouragementMessage,
                type: messageType,
                completionRate: completionRate
            },
            refundHistory: refunds.map(refund => ({
                id: refund._id,
                amount: refund.amount,
                status: refund.status,
                createdAt: refund.createdAt,
                metadata: refund.metadata
            })),
            message: refunds.length > 0
                ? `已处理 ${refunds.length} 次退款`
                : '暂无退款记录'
        });

    } catch (error) {
        console.error('获取退款状态失败:', error);
        res.status(500).json({ error: '获取退款状态失败' });
    }
});

// ===== 自动退款检查 =====

// 检查并处理自动退款（可由定时任务调用）
router.post('/auto-check', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 获取用户目标信息
        const userGoal = await Goal.findOne({ userId });
        if (!userGoal || !userGoal.depositAmount) {
            return res.json({
                message: '用户未设置保证金',
                processed: false
            });
        }

        // 获取打卡记录
        const checkin = await Checkin.findByUserId(userId);
        if (!checkin || !checkin.checkins) {
            return res.json({
                message: '用户未开始打卡',
                processed: false
            });
        }

        const completedDays = checkin.checkins.length;
        const totalDays = 7;
        const totalDeposit = userGoal.depositAmount;
        const dailyAmount = Math.round(totalDeposit / totalDays);
        const refundAmount = completedDays * dailyAmount;

        // 检查是否应该自动退款
        const shouldAutoRefund = completedDays >= totalDays ||
            (new Date().getDate() > checkin.startDate.getDate() + 6);

        if (!shouldAutoRefund) {
            return res.json({
                message: '还未到退款时间',
                processed: false,
                completedDays: completedDays,
                totalDays: totalDays
            });
        }

        // 检查是否已经处理过退款
        const existingRefund = await Payment.findOne({
            userId: userId,
            type: 'refund',
            status: 'completed'
        });

        if (existingRefund) {
            return res.json({
                message: '退款已处理',
                processed: false,
                refundId: existingRefund._id
            });
        }

        // 自动处理退款
        const refundRecord = new Payment({
            userId: userId,
            paymentIntentId: `auto_refund_${Date.now()}`,
            amount: refundAmount,
            type: 'refund',
            recipientContact: userGoal.depositRecipient,
            recipientType: userGoal.depositRecipientType,
            day: new Date().getDate(),
            status: 'completed',
            metadata: {
                username: user.username,
                goalContent: userGoal.goalContent,
                completedDays: completedDays,
                totalDays: totalDays,
                refundType: 'auto_refund',
                originalDepositAmount: totalDeposit
            }
        });

        await refundRecord.save();

        // 更新目标状态
        userGoal.refundAmount = refundAmount;
        userGoal.refundDate = new Date();
        userGoal.refundStatus = 'completed';
        await userGoal.save();

        res.json({
            success: true,
            message: `自动退款处理成功，返还金额: $${refundAmount}`,
            processed: true,
            refund: {
                id: refundRecord._id,
                amount: refundAmount,
                completedDays: completedDays,
                status: 'completed'
            }
        });

    } catch (error) {
        console.error('自动退款检查失败:', error);
        res.status(500).json({ error: '自动退款检查失败' });
    }
});

// ===== 兼容旧API =====

// 获取退款信息（兼容旧API）
router.get('/info', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        res.json({
            message: 'Refund endpoint (legacy)',
            userId: userId
        });
    } catch (error) {
        console.error('获取退款信息失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;

