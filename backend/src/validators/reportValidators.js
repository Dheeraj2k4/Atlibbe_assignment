const { check, param } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Validation rules for generating a report
 */
const generateReportValidation = [
  param('productId')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid product ID');
      }
      return true;
    }),
  
  check('report_type')
    .optional()
    .isIn(['product_details', 'transparency', 'certification', 'custom'])
    .withMessage('Report type must be one of: product_details, transparency, certification, custom'),
  
  check('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
];

/**
 * Validation rules for getting a report by ID
 */
const reportIdValidation = [
  param('id')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid report ID');
      }
      return true;
    })
];

/**
 * Validation rules for getting reports by product ID
 */
const productIdValidation = [
  param('productId')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid product ID');
      }
      return true;
    })
];

module.exports = {
  generateReportValidation,
  reportIdValidation,
  productIdValidation
};