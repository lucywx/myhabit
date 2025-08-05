// server/models/Checkin.js
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  checkins: {
    type: Map,
    of: {
      imageUrl: String,
      uploadTime: Date,
      dailyAmount: Number
    },
    default: {}
  }
}, {
  timestamps: true
});

// 创建复合索引
checkinSchema.index({ userId: 1, goalId: 1 }, { unique: true });

// 实例方法
checkinSchema.methods.addCheckin = function (dayNumber, imageUrl, dailyAmount) {
  this.checkins.set(dayNumber, {
    imageUrl,
    uploadTime: new Date(),
    dailyAmount: dailyAmount || 0
  });
  return this.save();
};

checkinSchema.methods.getCheckin = function (dayNumber) {
  return this.checkins.get(dayNumber);
};

checkinSchema.methods.hasCheckin = function (dayNumber) {
  return this.checkins.has(dayNumber);
};

checkinSchema.methods.getTotalCheckins = function () {
  return this.checkins.size;
};

// 静态方法
checkinSchema.statics.findByUserAndGoal = function (userId, goalId) {
  return this.findOne({ userId, goalId });
};

checkinSchema.statics.findOrCreateByUserAndGoal = async function (userId, goalId) {
  let checkin = await this.findOne({ userId, goalId });
  if (!checkin) {
    checkin = new this({
      userId,
      goalId,
      startDate: new Date()
    });
    await checkin.save();
  }
  return checkin;
};

module.exports = mongoose.model('Checkin', checkinSchema);
