const Question = require('../models/questionModel');
const Product = require('../models/productModel');
const axios = require('axios');

/**
 * Question Controller
 * Handles question-related HTTP requests
 */
const questionController = {
  /**
   * Create a new question
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response
   */
  async createQuestion(req, res) {
    try {
      const questionData = req.body;
      
      // Check if product exists
      const product = await Product.getById(questionData.product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      // Create question
      const question = await Question.create(questionData);
      
      res.status(201).json({
        success: true,
        data: question,
        message: 'Question created successfully'
      });
    } catch (error) {
      console.error('Error in createQuestion:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create question'
      });
    }
  },

  /**
   * Create multiple questions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response
   */
  async createManyQuestions(req, res) {
    try {
      const { product_id, questions } = req.body;
      
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Questions must be a non-empty array'
        });
      }
      
      // Check if product exists
      const product = await Product.getById(product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      // Prepare questions data
      const questionsData = questions.map(q => ({
        product_id,
        question_text: q.question_text,
        answer: q.answer,
        question_type: q.question_type || 'text',
        is_ai_generated: q.is_ai_generated || false
      }));
      
      // Create questions
      const createdQuestions = await Question.createMany(questionsData);
      
      res.status(201).json({
        success: true,
        data: createdQuestions,
        message: 'Questions created successfully'
      });
    } catch (error) {
      console.error('Error in createManyQuestions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create questions'
      });
    }
  },

  /**
   * Get questions by product ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response
   */
  async getQuestionsByProductId(req, res) {
    try {
      const { product_id } = req.params;
      
      // Validate product_id format
      if (!product_id || !require('mongoose').Types.ObjectId.isValid(product_id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID format'
        });
      }
      
      // Get questions
      const questions = await Question.getByProductId(product_id);
      
      res.status(200).json({
        success: true,
        data: questions
      });
    } catch (error) {
      console.error('Error in getQuestionsByProductId:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get questions'
      });
    }
  },

  /**
   * Update a question's answer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response
   */
  async updateQuestionAnswer(req, res) {
    try {
      const { id } = req.params;
      const { answer } = req.body;
      
      // Update question
      const question = await Question.updateAnswer(id, answer);
      
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: question,
        message: 'Question answer updated successfully'
      });
    } catch (error) {
      console.error('Error in updateQuestionAnswer:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update question answer'
      });
    }
  },

  /**
   * Generate AI questions for a product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response
   */
  async generateAIQuestions(req, res) {
    try {
      const { product_id } = req.params;
      
      // Validate product_id format
      if (!product_id || !require('mongoose').Types.ObjectId.isValid(product_id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID format'
        });
      }
      
      // Check if product exists
      const product = await Product.getById(product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      // Call AI service to generate questions
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      
      const aiResponse = await axios.post(`${aiServiceUrl}/api/generate-questions`, {
        product: {
          name: product.name,
          description: product.description,
          category: product.category,
          ingredients: product.ingredients,
          manufacturing_process: product.manufacturing_process,
          country_of_origin: product.country_of_origin
        }
      });
      
      if (!aiResponse.data.questions || !Array.isArray(aiResponse.data.questions)) {
        return res.status(500).json({
          success: false,
          error: 'Failed to generate questions from AI service'
        });
      }
      
      // Prepare questions data
      const questionsData = aiResponse.data.questions.map(q => ({
        product_id,
        question_text: q,
        answer: null,
        question_type: 'text',
        is_ai_generated: true
      }));
      
      // Create questions
      const createdQuestions = await Question.createMany(questionsData);
      
      res.status(201).json({
        success: true,
        data: createdQuestions,
        message: 'AI questions generated successfully'
      });
    } catch (error) {
      console.error('Error in generateAIQuestions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate AI questions'
      });
    }
  }
};

module.exports = questionController;