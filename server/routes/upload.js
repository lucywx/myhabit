// ✅ 修改后的 Upload 接口，路径：server/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const today = new Date().toISOString().slice(0, 10);
    cb(null, `${Date.now()}-${today}.${file.originalname.split('.').pop()}`);
  }
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('photo'), (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const userId = req.user.userId;
  const logPath = path.join(uploadDir, `${today}-${userId}.json`);

  try {
    // 保存打卡记录，包含物品数量（默认为1）
    const logData = {
      date: today,
      userId: userId,
      uploaded: true,
      itemsCount: req.body.itemsCount || 1,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(logPath, JSON.stringify(logData));
    console.log(`✅ [${userId}] 打卡成功：${logPath}`);
    res.json({ message: 'File uploaded successfully!' });
  } catch (err) {
    console.error('❌ 写入打卡记录失败', err);
    res.status(500).json({ message: '上传成功但写入记录失败' });
  }
});

module.exports = router;





