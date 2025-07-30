// server/models/Checkin.js
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  checkins: [{
    day: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 7 
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    filename: { 
      type: String, 
      required: true 
    },
    uploadedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  totalDays: { 
    type: Number, 
    default: 7 
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true // 自动管理 createdAt 和 updatedAt
});

// 添加索引以提高查询性能
checkinSchema.index({ userId: 1 });
checkinSchema.index({ startDate: 1 });

// 实例方法：添加或更新打卡记录
checkinSchema.methods.addCheckin = function(day, imageUrl, filename) {
  // 检查是否已经打卡
  const existingCheckinIndex = this.checkins.findIndex(c => c.day === day);
  
  if (existingCheckinIndex !== -1) {
    // 如果已经打卡，更新记录
    this.checkins[existingCheckinIndex] = {
      day,
      imageUrl,
      filename,
      uploadedAt: new Date()
    };
    console.log(`更新第${day}天打卡记录`);
  } else {
    // 如果还没有打卡，添加新记录
    this.checkins.push({
      day,
      imageUrl,
      filename,
      uploadedAt: new Date()
    });
    console.log(`添加第${day}天打卡记录`);
  }
  
  // 检查是否完成所有打卡
  if (this.checkins.length === this.totalDays) {
    this.isCompleted = true;
  }
  
  this.updatedAt = new Date();
  return this.save();
};

// 实例方法：获取今天应该打卡的天数
checkinSchema.methods.getTodayShouldCompleteDay = function() {
  const today = new Date();
  const startDate = new Date(this.startDate);
  
  // 重置时间为00:00:00以便准确计算天数
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays + 1);
};

// 实例方法：检查是否可以打卡指定天数
checkinSchema.methods.canCheckinDay = function(day) {
  // 第1天总是可以打卡（设置startDate）
  if (day === 1) {
    return true;
  }
  
  // 检查是否已经打卡 - 如果已经打卡，允许更新
  const existingCheckin = this.checkins.find(c => c.day === day);
  if (existingCheckin) {
    // 如果已经打卡，允许更新（更换图片）
    return true;
  }
  
  // 检查是否按顺序打卡
  for (let i = 1; i < day; i++) {
    if (!this.checkins.find(c => c.day === i)) {
      return false;
    }
  }
  
  // 检查时间规则（第1天之后）
  const todayShouldCompleteDay = this.getTodayShouldCompleteDay();
  return day === todayShouldCompleteDay;
};

// 静态方法：获取用户的打卡记录
checkinSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

// 静态方法：创建或获取用户的打卡记录
checkinSchema.statics.findOrCreateByUserId = async function(userId) {
  let checkin = await this.findOne({ userId });
  
  if (!checkin) {
    checkin = new this({
      userId,
      startDate: null, // 将在第一次打卡时设置
      checkins: [],
      totalDays: 7
    });
  }
  
  return checkin;
};

module.exports = mongoose.model('Checkin', checkinSchema);
