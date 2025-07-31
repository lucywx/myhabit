// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret'; // 使用环境变量

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '未提供授权 token' });
  }

  const token = authHeader.split(' ')[1]; // Authorization: Bearer <token>

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'token 无效或已过期' });
    }

    req.user = decoded; // 添加用户信息到请求对象中
    next();
  });
}

module.exports = authMiddleware;
