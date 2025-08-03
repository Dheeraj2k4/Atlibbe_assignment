const express = require('express');
const { check } = require('express-validator');
const questionController = require('../controllers/questionController');
const { validate } = require('../middleware/validationMiddleware');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Public (optional auth)
 */
router.post(
  '/',
  optionalProtect,
  [
    check('product_id', 'Product ID is required').isMongoId(),
    check('question_text', 'Question text is required').not().isEmpty(),
    check('answer', 'Answer is optional').optional(),
    check('question_type', 'Question type is optional').optional(),
    check('is_ai_generated', 'Is AI generated flag is optional').optional().isBoolean()
  ],
  validate,
  questionController.createQuestion
);

/**
 * @route   POST /api/questions/many
 * @desc    Create multiple questions
 * @access  Public (optional auth)
 */
router.post(
  '/many',
  optionalProtect,
  [
    check('product_id', 'Product ID is required').isMongoId(),
    check('questions', 'Questions must be an array').isArray(),
    check('questions.*.question_text', 'Question text is required').not().isEmpty(),
    check('questions.*.answer', 'Answer is optional').optional(),
    check('questions.*.question_type', 'Question type is optional').optional(),
    check('questions.*.is_ai_generated', 'Is AI generated flag is optional').optional().isBoolean()
  ],
  validate,
  questionController.createManyQuestions
);

/**
 * @route   GET /api/questions/product/:product_id
 * @desc    Get questions by product ID
 * @access  Public
 */
router.get('/product/:product_id', questionController.getQuestionsByProductId);

/**
 * @route   PUT /api/questions/:id/answer
 * @desc    Update a question's answer
 * @access  Public (optional auth)
 */
router.put(
  '/:id/answer',
  optionalProtect,
  [
    check('answer', 'Answer is required').not().isEmpty()
  ],
  validate,
  questionController.updateQuestionAnswer
);

/**
 * @route   POST /api/questions/generate/:product_id
 * @desc    Generate AI questions for a product
 * @access  Public (optional auth)
 */
router.post(
  '/generate/:product_id',
  optionalProtect,
  questionController.generateAIQuestions
);

module.exports = router;