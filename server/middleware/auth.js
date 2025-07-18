const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret'; // 最好用 process.env.JWT_SECRET

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: '未提供授权token' });
  }

  const token = authHeader.split(' ')[1]; // Bearer xxx

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // 添加user信息
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token 无效或过期' });
  }
}

module.exports = authMiddleware;
