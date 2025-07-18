// server/routes/checkMissed.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const Goal = require('../models/Goal');
const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');

router.get('/check-missed', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().slice(0, 10);
    const logPath = path.join(uploadDir, `${today}.json`);

    if (fs.existsSync(logPath)) {
      res.json({ status: 'checked', message: '✅ Checked in today' });
    } else {
      // Get user punishment settings
      const userGoal = await Goal.findOne({ userId });
      
      if (userGoal && userGoal.punishment && userGoal.punishment.amount > 0) {
        const { amount, type, friendContact } = userGoal.punishment;
        
        // Execute punishment logic
        if (type === 'platform') {
          console.log(`❌ Missed check-in today, simulated transfer ¥${amount} to platform`);
          res.json({ 
            status: 'missed', 
            message: `❌ Missed check-in today, transferred ¥${amount} to platform`,
            punishment: { amount, type }
          });
        } else if (type === 'friend' && friendContact) {
          console.log(`❌ Missed check-in today, simulated transfer ¥${amount} to friend ${friendContact}`);
          res.json({ 
            status: 'missed', 
            message: `❌ Missed check-in today, transferred ¥${amount} to friend`,
            punishment: { amount, type, friendContact }
          });
        } else {
          res.json({ 
            status: 'missed', 
            message: '❌ Missed check-in today',
            punishment: null
          });
        }
      } else {
        res.json({ 
          status: 'missed', 
          message: '❌ Missed check-in today',
          punishment: null
        });
      }
    }
  } catch (error) {
    console.error('Error checking check-in status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


