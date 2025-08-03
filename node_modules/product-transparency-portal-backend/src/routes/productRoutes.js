const express = require('express');
const { check } = require('express-validator');
const productController = require('../controllers/productController');
const { validate } = require('../middleware/validationMiddleware');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (optional auth)
 */
router.post(
  '/',
  optionalProtect,
  [
    check('name', 'Product name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    // Make these fields optional
    check('ingredients').optional(),
    check('manufacturing_process').optional(),
    check('country_of_origin').optional(),
    check('questions', 'Questions must be an array').optional().isArray()
  ],
  validate,
  productController.createProduct
);

/**
 * @route   GET /api/products/:id
 * @desc    Get a product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   PUT /api/products/:id/transparency-score
 * @desc    Update a product's transparency score
 * @access  Private
 */
router.put(
  '/:id/transparency-score',
  protect,
  [
    check('transparency_score', 'Transparency score is required and must be between 0 and 10')
      .isFloat({ min: 0, max: 10 })
  ],
  validate,
  productController.updateTransparencyScore
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;