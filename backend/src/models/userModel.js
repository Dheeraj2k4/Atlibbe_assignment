const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '30d' }
  );
};

const User = mongoose.model('User', userSchema);

/**
 * User Model Methods
 */
module.exports = {
  model: User, // in case you need direct access to the model

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user and token
   */
  async register(userData) {
    try {
      const { name, email, password, role } = userData;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
      });

      // Generate token
      const token = user.generateToken();

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      // Generate token
      const token = user.generateToken();

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} - User data
   */
  async getById(id) {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - User update data
   * @returns {Promise<Object>} - Updated user
   */
  async update(id, updateData) {
    try {
      // If updating email, check if it's already taken
      if (updateData.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser && existingUser._id.toString() !== id) {
          const error = new Error('Email already in use');
          error.statusCode = 400;
          throw error;
        }
      }

      // If updating password, hash it
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - True if deleted
   */
  async delete(id) {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};