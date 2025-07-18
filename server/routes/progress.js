// server/routes/progress.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.userId;
    const day = req.body.day;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `day-${day}-${userId}-${timestamp}${ext}`);
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
router.get('/day-images', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const images = {};
  
  // Check for existing images for each day (1-7)
  for (let day = 1; day <= 7; day++) {
    const pattern = new RegExp(`^day-${day}-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
    const files = fs.readdirSync(uploadDir);
    const dayFile = files.find(f => pattern.test(f));
    
    if (dayFile) {
      images[day] = `http://localhost:5000/uploads/${dayFile}`;
    } else {
      images[day] = null;
    }
  }
  
  res.json({ images });
});

// Upload image for specific day
router.post('/upload-day-image', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file selected' });
    }
    
    const day = req.body.day;
    if (!day || day < 1 || day > 7) {
      return res.status(400).json({ message: 'Invalid day number' });
    }
    
    const userId = req.user.userId;
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    // Save day image info to a JSON file for tracking
    const dayImageInfo = {
      userId,
      day: parseInt(day),
      imageUrl,
      filename: req.file.filename,
      uploadedAt: new Date().toISOString()
    };
    
    const infoFilename = `day-${day}-${userId}-info.json`;
    const infoPath = path.join(uploadDir, infoFilename);
    fs.writeFileSync(infoPath, JSON.stringify(dayImageInfo, null, 2));
    
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl,
      day: parseInt(day)
    });
    
  } catch (error) {
    console.error('Failed to upload image:', error);
    res.status(500).json({ message: 'Upload failed, please try again' });
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

