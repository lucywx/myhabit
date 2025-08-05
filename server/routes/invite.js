const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Invite = require('../models/Invite');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 生成邀请链接（不需要邮箱）
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const fromUserId = req.user.userId;

    // 生成邀请ID
    const inviteId = crypto.randomBytes(8).toString('hex');

    // 设置过期时间（7天）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 生成邀请链接
    const baseUrl = process.env.FRONTEND_URL || 'https://myhabit.up.railway.app';
    const inviteUrl = `${baseUrl}/register?invite=${inviteId}`;

    // 创建邀请记录（不包含邮箱）
    const invite = new Invite({
      inviteId,
      fromUserId,
      inviteUrl,
      expiresAt
    });

    await invite.save();

    res.json({
      success: true,
      inviteLink: inviteUrl,
      inviteId: inviteId
    });

  } catch (error) {
    console.error('生成邀请链接失败:', error);
    res.status(500).json({ error: '生成邀请链接失败' });
  }
});

// 发送邀请链接到邮箱
router.post('/send-link', authMiddleware, async (req, res) => {
  try {
    const { friendEmail, inviteLink } = req.body;
    const fromUserId = req.user.userId;

    if (!friendEmail || !inviteLink) {
      return res.status(400).json({ error: '请输入朋友邮箱和邀请链接' });
    }

    // 从邀请链接中提取inviteId
    const inviteId = inviteLink.split('invite=')[1];
    if (!inviteId) {
      return res.status(400).json({ error: '邀请链接格式错误' });
    }

    // 查找邀请记录
    const invite = await Invite.findOne({ inviteId, fromUserId });
    if (!invite) {
      return res.status(404).json({ error: '邀请链接不存在' });
    }

    // 获取邀请人信息
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 创建邮件传输器（使用Gmail SMTP）
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // 邮件内容
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: friendEmail,
      subject: '邀请加入 MyHabit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🎉 邀请你加入 MyHabit！</h2>
          <p>你好！</p>
          <p><strong>${fromUser.username}</strong> 邀请你加入 MyHabit，一起养成好习惯！</p>
          <p>点击下面的按钮注册：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
               加入 MyHabit
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            此邀请链接有效期为7天。<br>
            如果按钮无法点击，请复制粘贴此链接：<a href="${inviteLink}">${inviteLink}</a>
          </p>
        </div>
      `
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    // 更新邀请记录的邮箱
    invite.toEmail = friendEmail;
    await invite.save();

    res.json({
      success: true,
      message: '邀请链接发送成功'
    });

  } catch (error) {
    console.error('发送邀请链接失败:', error);
    res.status(500).json({ error: '发送邀请链接失败' });
  }
});

// 生成邀请链接（需要邮箱）
router.post('/generate-invite', authMiddleware, async (req, res) => {
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
    const baseUrl = process.env.FRONTEND_URL || 'https://myhabit.up.railway.app';
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

// 获取用户的邀请记录
router.get('/my-invites', authMiddleware, async (req, res) => {
  try {
    const fromUserId = req.user.userId;
    const invites = await Invite.findByFromUserId(fromUserId);

    const inviteList = invites.map(invite => ({
      inviteId: invite.inviteId,
      toEmail: invite.toEmail,
      status: invite.status,
      inviteUrl: invite.inviteUrl,
      createdAt: invite.createdAt,
      expiresAt: invite.expiresAt,
      registeredAt: invite.registeredAt
    }));

    res.json({
      success: true,
      invites: inviteList
    });

  } catch (error) {
    console.error('获取邀请记录失败:', error);
    res.status(500).json({ error: '获取邀请记录失败' });
  }
});

// 验证邀请链接
router.get('/validate-invite/:inviteId', async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invite = await Invite.findByInviteId(inviteId);

    if (!invite) {
      return res.status(404).json({ error: '邀请链接无效或已过期' });
    }

    // 获取邀请人信息
    const fromUser = await User.findById(invite.fromUserId);
    if (!fromUser) {
      return res.status(404).json({ error: '邀请人信息不存在' });
    }

    res.json({
      success: true,
      invite: {
        inviteId: invite.inviteId,
        fromUsername: fromUser.username,
        toEmail: invite.toEmail,
        expiresAt: invite.expiresAt
      }
    });

  } catch (error) {
    console.error('验证邀请链接失败:', error);
    res.status(500).json({ error: '验证邀请链接失败' });
  }
});

// 使用邀请链接注册
router.post('/use-invite/:inviteId', async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { userId } = req.body; // 新注册用户的ID

    const invite = await Invite.findByInviteId(inviteId);
    if (!invite) {
      return res.status(404).json({ error: '邀请链接无效或已过期' });
    }

    // 标记邀请为已使用
    await invite.markAsRegistered(userId);

    // 建立好友关系（这里可以扩展为好友系统）
    // 暂时只记录邀请关系

    res.json({
      success: true,
      message: '邀请使用成功'
    });

  } catch (error) {
    console.error('使用邀请链接失败:', error);
    res.status(500).json({ error: '使用邀请链接失败' });
  }
});

// 发送邀请邮件
router.post('/send-email', authMiddleware, async (req, res) => {
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

    // 创建邮件传输器（使用Gmail SMTP）
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // 邮件内容
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: toEmail,
      subject: 'Invitation to join MyHabit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #333;">🎉 You're invited to join MyHabit!</h2>
          <p>Hey there!</p>
                                <p><strong>${fromUser.username}</strong> is inviting you to join MyHabit and build good habits together!</p>
          <p>Click the button below to register:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invite.inviteUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                        Join MyHabit
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This invite link is valid for 7 days.<br>
            If the button doesn't work, copy and paste this link: <a href="${invite.inviteUrl}">${invite.inviteUrl}</a>
          </p>
        </div>
      `
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    // 更新邀请记录的邮箱
    invite.toEmail = toEmail;
    await invite.save();

    res.json({
      success: true,
      message: 'Invite email sent successfully'
    });

  } catch (error) {
    console.error('发送邀请邮件失败:', error);
    res.status(500).json({ error: 'Failed to send invite email' });
  }
});

// 清理过期邀请
router.post('/cleanup-expired', async (req, res) => {
  try {
    const result = await Invite.updateMany(
      { status: 'sent', expiresAt: { $lt: new Date() } },
      { status: 'expired' }
    );

    res.json({
      success: true,
      message: `清理了 ${result.modifiedCount} 个过期邀请`
    });

  } catch (error) {
    console.error('清理过期邀请失败:', error);
    res.status(500).json({ error: '清理过期邀请失败' });
  }
});

module.exports = router; 