const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.userId;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 限制2MB
  },
  fileFilter: function (req, file, cb) {
    // 检查文件类型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// 头像上传接口
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    const userId = req.user.userId;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // 删除旧头像（如果存在）
    const oldAvatarPath = path.join(uploadDir, `${userId}-*`);
    const oldFiles = fs.readdirSync(uploadDir).filter(file => file.startsWith(`${userId}-`));
    oldFiles.forEach(file => {
      if (file !== req.file.filename) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    res.json({
      message: '头像上传成功',
      avatarUrl: avatarUrl
    });
  } catch (error) {
    console.error('头像上传错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 静态文件服务
router.use('/uploads/avatars', express.static(uploadDir));

module.exports = router; 