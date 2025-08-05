// server/routes/checkin.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const Checkin = require('../models/Checkin');
const Goal = require('../models/Goal');
const PriceSettings = require('../models/PriceSettings');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.userId;
    // 从文件名中提取day信息，因为multer在解析body之前执行
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    // 先使用临时文件名，稍后在路由中重命名
    cb(null, `temp-${userId}-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get day images for 7-day challenge
router.get('/get-checkin-image', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const checkin = await Checkin.findByUserId(userId);

    const images = {};

    if (checkin) {
      // 从Checkin模型中获取打卡记录
      for (let day = 1; day <= 7; day++) {
        const dayCheckin = checkin.checkins.find(c => c.day === day);
        if (dayCheckin) {
          images[day] = dayCheckin.imageUrl;
        } else {
          images[day] = null;
        }
      }
    } else {
      // 如果没有Checkin记录，返回空的图片数组
      for (let day = 1; day <= 7; day++) {
        images[day] = null;
      }
    }

    res.json({ images });
  } catch (error) {
    console.error('Error getting checkin images:', error);
    res.status(500).json({ message: 'Failed to get checkin images' });
  }
});

// Upload or update image for specific day
router.post('/upload-checkin-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file selected' });
    }

    const day = parseInt(req.body.day || req.query.day);
    if (!day || day < 1 || day > 7) {
      return res.status(400).json({ message: 'Invalid day number' });
    }

    const userId = req.user.userId;

    // 获取或创建用户的打卡记录
    let checkin = await Checkin.findOrCreateByUserId(userId);

    // 检查是否可以打卡
    if (!checkin.canCheckinDay(day)) {
      return res.status(400).json({ message: '不能提前打卡噢' });
    }

    // 判断是upload还是update操作
    const existingCheckin = checkin.checkins.find(c => c.day === day);
    const isUpdate = existingCheckin !== undefined;

    console.log(`处理第${day}天图片: ${isUpdate ? 'UPDATE' : 'UPLOAD'} 操作`);

    // 重命名文件为正确的格式
    const oldPath = req.file.path;
    const ext = path.extname(req.file.filename);
    const newFilename = `day-${day}-${userId}-${Date.now()}${ext}`;
    const newPath = path.join(uploadDir, newFilename);

    // 重命名文件
    fs.renameSync(oldPath, newPath);

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${newFilename}`;

    // 如果是第一次打卡（第1天），设置startDate
    if (day === 1 && !checkin.startDate) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // 设置为当天的00:00:00
      checkin.startDate = todayDate;
    }

    // 添加或更新打卡记录到Checkin模型
    await checkin.addCheckin(day, imageUrl, newFilename);

    // Save day image info to a JSON file for tracking (保持兼容性)
    const dayImageInfo = {
      userId,
      day: day,
      imageUrl,
      filename: newFilename,
      uploadedAt: new Date().toISOString()
    };

    const infoFilename = `day-${day}-${userId}-info.json`;
    const infoPath = path.join(uploadDir, infoFilename);
    fs.writeFileSync(infoPath, JSON.stringify(dayImageInfo, null, 2));

    // 根据操作类型返回不同的消息
    const message = isUpdate ? 'Image updated successfully' : 'Image uploaded successfully';

    res.json({
      message,
      imageUrl,
      day: day,
      operation: isUpdate ? 'update' : 'upload'
    });

  } catch (error) {
    console.error('Failed to process image:', error);

    // 根据操作类型返回不同的错误消息
    const existingCheckin = checkin?.checkins?.find(c => c.day === parseInt(req.body.day || req.query.day));
    const isUpdate = existingCheckin !== undefined;
    const errorMessage = isUpdate ? 'Update failed, please try again' : 'Upload failed, please try again';

    res.status(500).json({ message: errorMessage });
  }
});

// Get challenge progress summary
router.get('/challenge-summary', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  let completedDays = 0;
  const completedDayNumbers = [];

  // Check which days have images
  for (let day = 1; day <= 7; day++) {
    const pattern = new RegExp(`^day-${day}-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
    const files = fs.readdirSync(uploadDir);
    const dayFile = files.find(f => pattern.test(f));

    if (dayFile) {
      completedDays++;
      completedDayNumbers.push(day);
    }
  }

  const progress = {
    totalDays: 7,
    completedDays,
    completedDayNumbers,
    progressPercentage: Math.round((completedDays / 7) * 100),
    isCompleted: completedDays === 7
  };

  res.json(progress);
});

// Reupload image for specific day
router.post('/reupload/:day', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (day < 1 || day > 7) {
      return res.status(400).json({ message: 'Invalid day number' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file selected' });
    }

    const userId = req.user.userId;

    // 获取或创建用户的打卡记录
    let checkin = await Checkin.findOrCreateByUserId(userId);

    // 检查是否可以重新上传（只能重新上传已打卡的天数）
    const existingCheckin = checkin.checkins.find(c => c.day === day);
    if (!existingCheckin) {
      return res.status(400).json({ message: '只能重新上传已打卡的天数' });
    }

    // 删除旧文件
    const oldPattern = new RegExp(`^day-${day}-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
    const files = fs.readdirSync(uploadDir);
    const oldFile = files.find(f => oldPattern.test(f));

    if (oldFile) {
      const oldFilePath = path.join(uploadDir, oldFile);
      fs.unlinkSync(oldFilePath);
    }

    // 重命名新文件为正确的格式
    const oldPath = req.file.path;
    const ext = path.extname(req.file.filename);
    const newFilename = `day-${day}-${userId}-${Date.now()}${ext}`;
    const newPath = path.join(uploadDir, newFilename);

    // 重命名文件
    fs.renameSync(oldPath, newPath);

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${newFilename}`;

    // 更新打卡记录
    await checkin.addCheckin(day, imageUrl, newFilename);

    res.json({
      message: 'Image reuploaded successfully',
      imageUrl,
      day: day
    });

  } catch (error) {
    console.error('Failed to reupload image:', error);
    res.status(500).json({ message: 'Reupload failed, please try again' });
  }
});

// Get user goals with progress
router.get('/user-goals', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 获取用户的目标
    const goals = await Goal.find({ userId });
    
    // 获取用户的打卡记录
    const checkin = await Checkin.findByUserId(userId);
    
    // 获取价格设置
    const priceSettings = await PriceSettings.findOne({ userId });
    
    // 计算每个目标的进度
    const goalsWithProgress = goals.map(goal => {
      let currentStreak = 0;
      let totalAmount = 0;
      let dailyAmount = 0;
      
      if (checkin && checkin.checkins) {
        // 计算连续打卡天数
        currentStreak = checkin.checkins.length;
        
        // 计算总金额和每日金额
        if (priceSettings) {
          totalAmount = priceSettings.amount;
          dailyAmount = Math.round(totalAmount / 7);
        }
      }
      
      return {
        _id: goal._id,
        title: goal.goalContent,
        description: `每日目标：${goal.goalContent}`,
        startDate: checkin?.startDate || new Date(),
        targetDays: 7,
        currentStreak,
        totalAmount,
        dailyAmount,
        penaltyAmount: priceSettings?.amount || 10
      };
    });
    
    res.json({ goals: goalsWithProgress });
  } catch (error) {
    console.error('Error getting user goals:', error);
    res.status(500).json({ message: 'Failed to get user goals' });
  }
});

// Start checkin process
router.post('/start-checkin', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 获取或创建用户的打卡记录
    let checkin = await Checkin.findOrCreateByUserId(userId);
    
    res.json({
      message: 'Checkin started successfully',
      startDate: checkin.startDate
    });
  } catch (error) {
    console.error('Error starting checkin:', error);
    res.status(500).json({ message: 'Failed to start checkin' });
  }
});

// Get checkin data
router.get('/get-checkin', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const checkin = await Checkin.findByUserId(userId);

    if (!checkin) {
      return res.json({
        checkins: {},
        startDate: null
      });
    }

    // 转换打卡记录格式为前端期望的格式
    const checkins = {};
    checkin.checkins.forEach(dayCheckin => {
      const dayIndex = dayCheckin.day - 1; // 转换为0-6的索引
      checkins[dayIndex] = {
        imageUrl: dayCheckin.imageUrl,
        timestamp: dayCheckin.uploadedAt,
        dailyAmount: Math.round(70 / 7) // 默认每日金额
      };
    });

    res.json({
      checkins,
      startDate: checkin.startDate
    });
  } catch (error) {
    console.error('Error getting checkin data:', error);
    res.status(500).json({ message: 'Failed to get checkin data' });
  }
});

// Handle checkin for specific goal
router.post('/checkin', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { goalId, date } = req.body;

    // 验证目标是否存在
    const goal = await Goal.findById(goalId);
    if (!goal || goal.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // 获取或创建打卡记录
    let checkin = await Checkin.findOrCreateByUserId(userId);

    // 计算今天是第几天（基于开始日期）
    const today = new Date();
    const startDate = checkin.startDate ? new Date(checkin.startDate) : today;
    const dayDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const currentDay = dayDiff + 1;

    if (currentDay < 1 || currentDay > 7) {
      return res.status(400).json({ message: 'Invalid checkin day' });
    }

    // 检查是否已经打卡
    const existingCheckin = checkin.checkins.find(c => c.day === currentDay);
    if (existingCheckin) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    // 添加打卡记录（这里只是记录，不包含图片）
    await checkin.addCheckin(currentDay, null, null);

    res.json({
      message: 'Checkin successful',
      day: currentDay,
      currentStreak: checkin.checkins.length
    });
  } catch (error) {
    console.error('Error during checkin:', error);
    res.status(500).json({ message: 'Checkin failed' });
  }
});

module.exports = router;

