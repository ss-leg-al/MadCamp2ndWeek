const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 사용자 정보(req.user)에 저장
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};