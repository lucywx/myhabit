const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Invite = require('../models/Invite');
const crypto = require('crypto');

// 模拟发送邀请邮件（开发环境使用）
router.post('/send-email-mock', authMiddleware, async (req, res) => {
  try {
    const { inviteId, toEmail } = req.body;
    const fromUserId = req.user.userId;

    if (!inviteId || !toEmail) {
      return res.status(400).json({ error: 'Missing inviteId or toEmail' });
    }

    // 查找邀请记录
    const invite = await Invite.findOne({ inviteId, fromUserId });
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    // 获取邀请人信息
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 模拟邮件发送延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 更新邀请记录的邮箱
    invite.toEmail = toEmail;
    await invite.save();

    // 返回成功响应（模拟邮件发送成功）
    res.json({
      success: true,
      message: 'Invite email sent successfully (Mock)',
      inviteUrl: invite.inviteUrl,
      debug: {
        fromUser: fromUser.username,
        toEmail: toEmail,
        inviteId: inviteId,
        inviteUrl: invite.inviteUrl
      }
    });

  } catch (error) {
    console.error('模拟发送邀请邮件失败:', error);
    res.status(500).json({ error: 'Failed to send invite email' });
  }
});

// 生成邀请链接（模拟版本）
router.post('/generate-invite-mock', authMiddleware, async (req, res) => {
  try {
    const { toEmail } = req.body;
    const fromUserId = req.user.userId;

    if (!toEmail) {
      return res.status(400).json({ error: '请输入朋友的邮箱地址' });
    }

    // 生成邀请ID
    const inviteId = crypto.randomBytes(8).toString('hex');

    // 设置过期时间（7天）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 生成邀请链接
    const baseUrl = process.env.FRONTEND_URL || 'https://myhabit-production.up.railway.app';
    const inviteUrl = `${baseUrl}/register?invite=${inviteId}`;

    // 创建邀请记录
    const invite = new Invite({
      inviteId,
      fromUserId,
      toEmail,
      inviteUrl,
      expiresAt
    });

    await invite.save();

    res.json({
      success: true,
      invite: {
        inviteId,
        inviteUrl,
        toEmail,
        expiresAt
      }
    });

  } catch (error) {
    console.error('生成邀请链接失败:', error);
    res.status(500).json({ error: '生成邀请链接失败' });
  }
});

module.exports = router; 