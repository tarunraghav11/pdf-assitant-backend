const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'jwtSecret');
    req.user = decoded; // decoded contains user ID
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

module.exports = authMiddleware;
