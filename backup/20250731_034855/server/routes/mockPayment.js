const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const BankInfo = require('../models/BankInfo');

// 模拟转账记录存储（实际项目中应该使用数据库）
const mockTransferLogs = [];
// 收到账款记录存储
const mockReceivedLogs = [];

// 模拟转账
router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { amount, type, receiver, remark } = req.body;
    const userId = req.user.id;

    // 获取用户信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取银行信息
    const bankInfo = await BankInfo.findByUserId(userId);
    if (!bankInfo || !bankInfo.bankName || !bankInfo.accountNumber || !bankInfo.accountName) {
      return res.status(400).json({ error: '请先完善银行信息' });
    }

    // 模拟转账处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟转账成功率（90%成功，10%失败）
    const isSuccess = Math.random() > 0.1;

    // 生成模拟交易号
    const transactionId = 'MOCK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // 创建转账记录
    const transferRecord = {
      id: Date.now().toString(),
      userId: userId,
      amount: parseFloat(amount),
      type: type, // 'platform' 或 'friend'
      receiver: receiver || (type === 'platform' ? '平台账户' : '朋友账户'),
      status: isSuccess ? 'success' : 'failed',
      transactionId: transactionId,
      remark: remark || '模拟转账 - 未打卡惩罚',
      date: new Date().toISOString(),
      fee: 0, // 模拟转账免手续费
      bankInfo: {
        bankName: bankInfo.bankName,
        accountName: bankInfo.accountName,
        accountNumber: bankInfo.accountNumber.substring(bankInfo.accountNumber.length - 4) // 只显示后4位
      }
    };

    // 保存到模拟记录中
    mockTransferLogs.push(transferRecord);

    // 如果转账成功且是朋友转账，创建收到账款记录
    if (isSuccess && type === 'friend' && receiver) {
      // 查找接收方用户
      const receiverUser = await User.findOne({ username: receiver });
      if (receiverUser) {
        const receivedRecord = {
          id: Date.now().toString() + '_received',
          receiverId: receiverUser._id.toString(),
          receiverUsername: receiver,
          senderId: userId,
          senderUsername: user.username,
          amount: parseFloat(amount),
          transactionId: transactionId,
          status: 'received',
          date: new Date().toISOString(),
          remark: remark || '朋友转账 - 监督奖励',
          type: 'friend_transfer'
        };
        mockReceivedLogs.push(receivedRecord);
      }
    }

    // 模拟响应
    if (isSuccess) {
      res.json({
        success: true,
        message: '模拟转账成功',
        transactionId: transactionId,
        transferRecord: transferRecord
      });
    } else {
      res.status(400).json({
        success: false,
        message: '模拟转账失败（模拟网络错误）',
        transactionId: transactionId,
        transferRecord: transferRecord
      });
    }

  } catch (error) {
    console.error('模拟转账失败:', error);
    res.status(500).json({ error: '模拟转账服务错误' });
  }
});

// 获取模拟转账记录
router.get('/transfers', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取当前用户的转账记录
    const userTransfers = mockTransferLogs.filter(log => log.userId === userId);
    
    res.json({
      transfers: userTransfers,
      total: userTransfers.length,
      successCount: userTransfers.filter(t => t.status === 'success').length,
      failedCount: userTransfers.filter(t => t.status === 'failed').length
    });
  } catch (error) {
    console.error('获取模拟转账记录失败:', error);
    res.status(500).json({ error: '获取转账记录失败' });
  }
});

// 获取收到账款记录
router.get('/received', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取当前用户收到的账款记录
    const userReceived = mockReceivedLogs.filter(log => log.receiverId === userId);
    
    res.json({
      received: userReceived,
      total: userReceived.length,
      totalAmount: userReceived.reduce((sum, record) => sum + record.amount, 0)
    });
  } catch (error) {
    console.error('获取收到账款记录失败:', error);
    res.status(500).json({ error: '获取收到账款记录失败' });
  }
});

// 清空模拟转账记录（仅用于测试）
router.delete('/transfers', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 删除当前用户的转账记录
    const userIndexes = [];
    mockTransferLogs.forEach((log, index) => {
      if (log.userId === userId) {
        userIndexes.push(index);
      }
    });
    
    // 从后往前删除，避免索引变化
    for (let i = userIndexes.length - 1; i >= 0; i--) {
      mockTransferLogs.splice(userIndexes[i], 1);
    }
    
    res.json({ message: '模拟转账记录已清空' });
  } catch (error) {
    console.error('清空模拟转账记录失败:', error);
    res.status(500).json({ error: '清空转账记录失败' });
  }
});

// 模拟转账统计
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userTransfers = mockTransferLogs.filter(log => log.userId === userId);
    const totalAmount = userTransfers.reduce((sum, transfer) => sum + transfer.amount, 0);
    const successAmount = userTransfers
      .filter(t => t.status === 'success')
      .reduce((sum, transfer) => sum + transfer.amount, 0);
    
    res.json({
      totalTransfers: userTransfers.length,
      successTransfers: userTransfers.filter(t => t.status === 'success').length,
      failedTransfers: userTransfers.filter(t => t.status === 'failed').length,
      totalAmount: totalAmount,
      successAmount: successAmount,
      successRate: userTransfers.length > 0 ? (userTransfers.filter(t => t.status === 'success').length / userTransfers.length * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('获取模拟转账统计失败:', error);
    res.status(500).json({ error: '获取转账统计失败' });
  }
});

module.exports = router; 