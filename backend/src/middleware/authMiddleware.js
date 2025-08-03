const jwt = require('jsonwebtoken');
const User = require('../models/userModel').model;

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key_here'
      );

      // Get user from token
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Not authorized, no token'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Verifies JWT token if present and attaches user to request
 * Does not require authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalProtect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key_here'
      );

      // Get user from token
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Invalid token, but we'll continue without user
      console.error('Invalid token in optional auth middleware:', error);
    }
  }

  // Continue regardless of token
  next();
};

module.exports = { protect, optionalProtect };