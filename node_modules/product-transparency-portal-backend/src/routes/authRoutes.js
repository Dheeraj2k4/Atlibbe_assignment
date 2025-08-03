const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  getUsers, 
  deleteUser 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation
} = require('../validators/authValidators');

// Public routes
router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfileValidation, validate, updateUserProfile);

// Admin routes
router.get('/users', protect, isAdmin, getUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);

module.exports = router;