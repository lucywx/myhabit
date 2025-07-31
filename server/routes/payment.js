const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Checkin = require('../models/Checkin');
const Payment = require('../models/Payment');

// 创建支付意图
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { amount, day, recipientContact, type } = req.body;
    const userId = req.user.userId;

    // 验证用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 验证金额
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '无效的支付金额' });
    }

    // 根据支付类型设置对账单描述符
    const getStatementDescriptor = (type) => {
      switch (type) {
        case 'platform':
          return 'MYHABIT-PENALTY';
        case 'friend':
          return 'MYHABIT-REWARD';
        default:
          return 'MYHABIT APP';
      }
    };

    // 创建Stripe支付意图
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe使用分为单位
      currency: 'usd',
      statement_descriptor: getStatementDescriptor(type), // 添加对账单描述符
      metadata: {
        userId: userId,
        day: day,
        recipientContact: recipientContact,
        type: type, // 'platform' 或 'friend'
        username: user.username
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('创建支付意图失败:', error);
    res.status(500).json({ error: '创建支付失败' });
  }
});

// 确认支付成功
router.post('/confirm-payment', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId, day, recipientContact, type, amount } = req.body;
    const userId = req.user.userId;

    // 验证支付意图
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: '支付未完成' });
    }

    // 验证支付金额
    if (paymentIntent.amount !== Math.round(amount * 100)) {
      return res.status(400).json({ error: '支付金额不匹配' });
    }

    // 获取用户目标信息
    const userGoal = await require('./setGoal').getCurrentGoal(userId);

    // 创建支付记录
    const paymentRecord = new Payment({
      userId: userId,
      paymentIntentId: paymentIntentId,
      amount: amount,
      day: day,
      type: type, // 'platform' 或 'friend'
      recipientContact: recipientContact,
      status: 'completed',
      stripeChargeId: paymentIntent.latest_charge,
      metadata: {
        username: user.username,
        goalContent: userGoal?.goalContent || '未知目标'
      }
    });

    await paymentRecord.save();
    console.log('支付记录已保存:', paymentRecord._id);

    // 如果是朋友转账，通知接收方
    if (type === 'friend' && recipientContact) {
      // 这里可以发送通知给朋友
      console.log(`通知用户 ${recipientContact} 收到转账 $${amount}`);
    }

    res.json({
      success: true,
      message: '支付成功',
      paymentRecord: paymentRecord
    });

  } catch (error) {
    console.error('确认支付失败:', error);
    res.status(500).json({ error: '确认支付失败' });
  }
});

// 获取支付历史
router.get('/get-payment-history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const payments = await Payment.findByUserId(userId);

    res.json({
      payments: payments
    });

  } catch (error) {
    console.error('获取支付历史失败:', error);
    res.status(500).json({ error: '获取支付历史失败' });
  }
});

// 处理Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook签名验证失败:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 处理支付成功事件
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('支付成功:', paymentIntent.id);

    // 这里可以更新数据库中的支付状态
    // 发送通知等
  }

  // 处理支付失败事件
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.log('支付失败:', paymentIntent.id);

    // 这里可以处理支付失败逻辑
  }

  res.json({ received: true });
});

module.exports = router; 