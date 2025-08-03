const Product = require('../models/productModel');
const QuestionModel = require('../models/questionModel');


const productController = {
  async createProduct(req, res) {
    try {
      const productData = req.body;

      // Add user_id if available
      if (req.user) {
        productData.user_id = req.user.id;
      }

      // Create product
      const product = await Product.create(productData);

      // Create questions if provided
      if (productData.questions && Array.isArray(productData.questions)) {
        for (const q of productData.questions) {
          await QuestionModel.create({
            product: product._id, // ✅ This should match the schema field name
            question_text: q.question_text,
            answer: q.answer,
            question_type: q.question_type || 'text',
            is_ai_generated: q.is_ai_generated || false,
          });
        }
      }

      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully',
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create product',
      });
    }
  },

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);

      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // 👇 Update this query to use { product: id }
      const questions = await Question.find({ product: id });

      res.status(200).json({
        success: true,
        data: {
          product,
          questions,
        },
      });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get product',
      });
    }
  },

  async getAllProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;

      const products = await Product.getAll(limit, offset);

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          offset,
        },
      });
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get products',
      });
    }
  },

  async updateTransparencyScore(req, res) {
    try {
      const { id } = req.params;
      const { transparency_score } = req.body;

      if (transparency_score === undefined || transparency_score < 0 || transparency_score > 10) {
        return res.status(400).json({
          success: false,
          error: 'Invalid transparency score. Must be between 0 and 10.',
        });
      }

      const product = await Product.updateTransparencyScore(id, transparency_score);

      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        data: product,
        message: 'Transparency score updated successfully',
      });
    } catch (error) {
      console.error('Error in updateTransparencyScore:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update transparency score',
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      if (req.user && product.user && req.user.id !== product.user.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this product',
        });
      }

      await Product.delete(id);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete product',
      });
    }
  },
};

module.exports = productController;
