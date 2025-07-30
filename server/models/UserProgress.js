const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentStep: {
        type: String,
        enum: ['goal', 'price', 'bank', 'checkin'],
        default: 'goal'
    },
    completedSteps: [{
        type: String,
        enum: ['goal', 'price', 'bank', 'checkin']
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 静态方法：查找或创建用户进度
userProgressSchema.statics.findOrCreateByUserId = async function (userId) {
    let progress = await this.findOne({ userId });
    if (!progress) {
        progress = new this({ userId });
        await progress.save();
    }
    return progress;
};

// 实例方法：更新进度
userProgressSchema.methods.updateProgress = async function (step) {
    this.currentStep = step;
    if (!this.completedSteps.includes(step)) {
        this.completedSteps.push(step);
    }
    this.lastUpdated = new Date();
    return await this.save();
};

// 实例方法：获取下一步
userProgressSchema.methods.getNextStep = function () {
    const steps = ['goal', 'price', 'bank', 'checkin'];
    const currentIndex = steps.indexOf(this.currentStep);

    if (currentIndex === -1 || currentIndex === steps.length - 1) {
        return 'checkin'; // 如果已完成所有步骤，返回打卡页面
    }

    return steps[currentIndex + 1];
};

module.exports = mongoose.model('UserProgress', userProgressSchema); 