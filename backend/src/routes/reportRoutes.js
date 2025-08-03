const express = require('express');
const router = express.Router();
const { 
  generateReport, 
  getAllReports, 
  getReportsByProduct, 
  getUserReports, 
  getReportById, 
  deleteReport 
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  generateReportValidation,
  reportIdValidation,
  productIdValidation
} = require('../validators/reportValidators');

// All routes are protected
router.use(protect);

// Generate report for a product
router.post('/generate/:productId', generateReportValidation, validate, generateReport);

// Get all reports (admin only)
router.get('/', isAdmin, getAllReports);

// Get reports by product ID
router.get('/product/:productId', productIdValidation, validate, getReportsByProduct);

// Get reports created by the logged-in user
router.get('/user', getUserReports);

// Get report by ID
router.get('/:id', reportIdValidation, validate, getReportById);

// Delete report
router.delete('/:id', reportIdValidation, validate, deleteReport);

module.exports = router;