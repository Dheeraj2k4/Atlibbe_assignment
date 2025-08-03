/**
 * Error Handler Middleware
 * Handles errors in the application
 */

/**
 * Not Found Middleware
 * Handles 404 errors for routes that don't exist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error Handler Middleware
 * Handles all errors in the application
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };