const mongoose = require('mongoose');

/**
 * Subdocument Schema: AI-generated question-answer pairs
 */
const questionAnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

/**
 * Product Schema
 */
const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  ingredients: {
    type: String,
    trim: true
  },
  manufacturing_process: {
    type: String,
    trim: true
  },
  certifications: {
    type: [String],
    default: []
  },
  country_of_origin: {
    type: String,
    trim: true
  },
  transparency_score: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  /**
   * New Field: Stores AI-generated Q&A pairs
   */
  question_answers: {
    type: [questionAnswerSchema],
    default: []
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Product = mongoose.model('Product', productSchema);

/**
 * Product Model Methods
 */
module.exports = {
  /**
   * Create a new product
   * @param {Object} productData - Product data (including question_answers)
   * @returns {Promise<Object>} - Created product
   */
  async create(productData) {
    try {
      const product = new Product({
        user: productData.user_id,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        ingredients: productData.ingredients,
        manufacturing_process: productData.manufacturing_process,
        certifications: productData.certifications,
        country_of_origin: productData.country_of_origin,
        question_answers: productData.question_answers || []
      });
      return await product.save();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Get a product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} - Product
   */
  async getById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  },

  /**
   * Update a product's transparency score
   * @param {string} id - Product ID
   * @param {number} score - Transparency score
   * @returns {Promise<Object>} - Updated product
   */
  async updateTransparencyScore(id, score) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { transparency_score: score },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating transparency score:', error);
      throw error;
    }
  },

  /**
   * Get all products
   * @param {number} limit - Number of products to return
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Array of products
   */
  async getAll(limit = 10, skip = 0) {
    try {
      return await Product.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  },

  /**
   * Get products by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of products
   */
  async getByUserId(userId) {
    try {
      return await Product.find({ user: userId }).sort({ created_at: -1 });
    } catch (error) {
      console.error('Error getting products by user ID:', error);
      throw error;
    }
  },

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
