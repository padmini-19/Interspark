const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for our secure cookie token
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token found'));
  }

  try {
    // Verify token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    // Attach user record to request context (excluding hashed password data)
    req.user = await User.findById(decoded.id).select('-password');
    
    // Explicitly call next middleware link
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, invalid token verification failed'));
  }
};

module.exports = protect;