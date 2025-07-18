const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get bank information
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const bankInfo = {
      bankName: user.bankName || '',
      accountName: user.accountName || '',
      accountNumber: user.accountNumber || '',
      cardType: user.cardType || '',
      expiryDate: user.expiryDate || '',
      cvv: user.cvv || '',
      idNumber: user.idNumber || '',
      phoneNumber: user.phoneNumber || '',
      branchName: user.branchName || ''
    };

    res.json({ bankInfo });
  } catch (error) {
    console.error('Failed to get bank info:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or update bank information
router.post('/', auth, async (req, res) => {
  try {
    const {
      bankName,
      accountName,
      accountNumber,
      cardType,
      expiryDate,
      cvv,
      idNumber,
      phoneNumber,
      branchName
    } = req.body;

    // 验证必填字段
    if (!bankName || !accountName || !accountNumber || !cardType || !expiryDate || !cvv || !idNumber || !phoneNumber) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 验证银行卡号格式（简单验证）
    if (!/^\d{16,19}$/.test(accountNumber.replace(/\s/g, ''))) {
      return res.status(400).json({ error: '银行卡号格式不正确' });
    }

    // 验证有效期格式
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return res.status(400).json({ error: '有效期格式不正确，请使用MM/YY格式' });
    }

    // 验证CVV格式
    if (!/^\d{3,4}$/.test(cvv)) {
      return res.status(400).json({ error: 'CVV格式不正确' });
    }

    // 验证身份证号格式
    if (!/^\d{17}[\dXx]$/.test(idNumber)) {
      return res.status(400).json({ error: '身份证号格式不正确' });
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ error: '手机号格式不正确' });
    }

    const updateData = {
      bankName,
      accountName,
      accountNumber: accountNumber.replace(/\s/g, ''),
      cardType,
      expiryDate,
      cvv,
      idNumber,
      phoneNumber,
      branchName: branchName || ''
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ 
      message: '银行信息保存成功',
      bankInfo: {
        bankName: user.bankName,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        cardType: user.cardType,
        expiryDate: user.expiryDate,
        cvv: user.cvv,
        idNumber: user.idNumber,
        phoneNumber: user.phoneNumber,
        branchName: user.branchName
      }
    });
  } catch (error) {
    console.error('保存银行信息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新银行信息
router.put('/', auth, async (req, res) => {
  try {
    const {
      bankName,
      accountName,
      accountNumber,
      cardType,
      expiryDate,
      cvv,
      idNumber,
      phoneNumber,
      branchName
    } = req.body;

    // 验证必填字段
    if (!bankName || !accountName || !accountNumber || !cardType || !expiryDate || !cvv || !idNumber || !phoneNumber) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 验证银行卡号格式（简单验证）
    if (!/^\d{16,19}$/.test(accountNumber.replace(/\s/g, ''))) {
      return res.status(400).json({ error: '银行卡号格式不正确' });
    }

    // 验证有效期格式
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return res.status(400).json({ error: '有效期格式不正确，请使用MM/YY格式' });
    }

    // 验证CVV格式
    if (!/^\d{3,4}$/.test(cvv)) {
      return res.status(400).json({ error: 'CVV格式不正确' });
    }

    // 验证身份证号格式
    if (!/^\d{17}[\dXx]$/.test(idNumber)) {
      return res.status(400).json({ error: '身份证号格式不正确' });
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ error: '手机号格式不正确' });
    }

    const updateData = {
      bankName,
      accountName,
      accountNumber: accountNumber.replace(/\s/g, ''),
      cardType,
      expiryDate,
      cvv,
      idNumber,
      phoneNumber,
      branchName: branchName || ''
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ 
      message: '银行信息更新成功',
      bankInfo: {
        bankName: user.bankName,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        cardType: user.cardType,
        expiryDate: user.expiryDate,
        cvv: user.cvv,
        idNumber: user.idNumber,
        phoneNumber: user.phoneNumber,
        branchName: user.branchName
      }
    });
  } catch (error) {
    console.error('更新银行信息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除银行信息
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bankName: '',
        accountName: '',
        accountNumber: '',
        cardType: '',
        expiryDate: '',
        cvv: '',
        idNumber: '',
        phoneNumber: '',
        branchName: ''
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ message: '银行信息已删除' });
  } catch (error) {
    console.error('删除银行信息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router; 