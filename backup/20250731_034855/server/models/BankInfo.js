// server/models/BankInfo.js
const mongoose = require('mongoose');

const bankInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // 一个用户只能有一个银行信息
    },
    bankName: {
        type: String,
        default: ''
    },
    accountName: {
        type: String,
        default: ''
    },
    accountNumber: {
        type: String,
        default: ''
    },
    cardType: {
        type: String,
        enum: ['', 'debit', 'credit', 'Visa', 'MasterCard', 'American Express', 'UnionPay'],
        default: ''
    },
    expiryDate: {
        type: String,
        default: ''
    },
    cvv: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // 添加 createdAt 和 updatedAt 字段
});

// 添加索引以提高查询性能
bankInfoSchema.index({ userId: 1 });

// 静态方法：根据用户ID查找银行信息
bankInfoSchema.statics.findByUserId = function (userId) {
    return this.findOne({ userId });
};

// 静态方法：创建或更新银行信息
bankInfoSchema.statics.findOrCreateByUserId = async function (userId) {
    let bankInfo = await this.findOne({ userId });

    if (!bankInfo) {
        bankInfo = new this({ userId });
    }

    return bankInfo;
};

module.exports = mongoose.model('BankInfo', bankInfoSchema); 