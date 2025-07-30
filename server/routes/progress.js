// server/routes/progress.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const Checkin = require('../models/Checkin');

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

// Delete image for specific day
router.delete('/day-image/:day', authMiddleware, (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (day < 1 || day > 7) {
      return res.status(400).json({ message: 'Invalid day number' });
    }
    
    const userId = req.user.userId;
    const pattern = new RegExp(`^day-${day}-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
    const files = fs.readdirSync(uploadDir);
    const dayFile = files.find(f => pattern.test(f));
    
    if (dayFile) {
      const filePath = path.join(uploadDir, dayFile);
      fs.unlinkSync(filePath);
      
      // Also delete the info file if it exists
      const infoFilename = `day-${day}-${userId}-info.json`;
      const infoPath = path.join(uploadDir, infoFilename);
      if (fs.existsSync(infoPath)) {
        fs.unlinkSync(infoPath);
      }
      
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image for this day not found' });
    }
    
  } catch (error) {
    console.error('Failed to delete image:', error);
    res.status(500).json({ message: 'Delete failed, please try again' });
  }
});

module.exports = router;

