const User = require('../models/userModel');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Register user
    const userData = await User.register({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Login user
    const userData = await User.login(email, password);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.getById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    // Only update fields that were sent
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const user = await User.update(req.user._id, updateData);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.model.find({}).select('-password');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/auth/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser
};