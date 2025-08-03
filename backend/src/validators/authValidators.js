const { check } = require('express-validator');

/**
 * Validation rules for user registration
 */
const registerValidation = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for profile update
 */
const updateProfileValidation = [
  check('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  check('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  check('password')
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation
};