const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const Report = require('../models/reportModel');
const Product = require('../models/productModel');

/**
 * @desc    Generate and save a product report PDF
 * @route   POST /api/reports/generate/:productId
 * @access  Private
 */
const generateReport = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { report_type = 'product_details', metadata = {} } = req.body;

    // Get product data
    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Create a unique filename
    const filename = `${product.name.replace(/\s+/g, '_')}_${report_type}_${uuidv4()}.pdf`;
    
    // Define the file path
    const reportsDir = path.join(__dirname, '..', '..', process.env.PDF_STORAGE_PATH || './public/reports');
    const filepath = path.join(reportsDir, filename);

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe PDF to file
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Add content to PDF based on report type
    generatePDFContent(doc, product, report_type, metadata);

    // Finalize PDF
    doc.end();

    // Wait for the stream to finish
    stream.on('finish', async () => {
      try {
        console.log('PDF generation completed, saving report to database...');
        console.log('Report data:', {
          product: productId,
          filename,
          filepath,
          created_by: req.user._id,
          report_type,
          metadata
        });
        
        // Save report to database
        const report = await Report.create({
          product: productId,
          filename,
          filepath,
          created_by: req.user._id,
          report_type,
          metadata
        });

        console.log('Report saved to database successfully:', report);

        // Generate public URL for the report
        const reportUrl = `${req.protocol}://${req.get('host')}/public/reports/${filename}`;
        console.log('Generated report URL:', reportUrl);

        res.status(201).json({
          success: true,
          data: {
            report_id: report._id,
            filename,
            report_url: reportUrl,
            report_type
          }
        });
        console.log('Response sent to client successfully');
      } catch (error) {
        console.error('Error saving report to database:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        
        // Try to delete the file if database save fails
        try {
          console.log('Attempting to delete PDF file due to database save failure:', filepath);
          fs.unlinkSync(filepath);
          console.log('PDF file deleted successfully');
        } catch (unlinkError) {
          console.error('Error deleting file after database save failure:', unlinkError);
          console.error('Unlink error details:', unlinkError.message);
        }
        next(error);
      }
    });

    stream.on('error', (error) => {
      console.error('Error writing PDF file:', error);
      next(error);
    });
  } catch (error) {
    console.error('Error generating report:', error);
    next(error);
  }
};

/**
 * Helper function to generate PDF content based on report type
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} product - Product data
 * @param {string} reportType - Type of report
 * @param {Object} metadata - Additional metadata
 */
const generatePDFContent = (doc, product, reportType, metadata) => {
  // Add logo or header
  doc.fontSize(25).text('Product Transparency Portal', { align: 'center' });
  doc.moveDown();

  // Add report title
  let reportTitle = 'Product Report';
  switch (reportType) {
    case 'transparency':
      reportTitle = 'Transparency Report';
      break;
    case 'certification':
      reportTitle = 'Certification Report';
      break;
    case 'custom':
      reportTitle = metadata.title || 'Custom Report';
      break;
    default:
      reportTitle = 'Product Details Report';
  }

  doc.fontSize(18).text(reportTitle, { align: 'center' });
  doc.moveDown();

  // Add date
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
  doc.moveDown(2);

  // Add product name and basic info
  doc.fontSize(16).text(`Product: ${product.name}`, { underline: true });
  doc.moveDown();

  // Add product details based on report type
  switch (reportType) {
    case 'transparency':
      addTransparencyContent(doc, product);
      break;
    case 'certification':
      addCertificationContent(doc, product);
      break;
    case 'custom':
      addCustomContent(doc, product, metadata);
      break;
    default:
      addProductDetailsContent(doc, product);
  }

  // Add footer
  doc.fontSize(10).text('This report is generated by Product Transparency Portal', {
    align: 'center',
    bottom: 30
  });
};

/**
 * Add product details content to PDF
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} product - Product data
 */
const addProductDetailsContent = (doc, product) => {
  doc.fontSize(12);

  if (product.description) {
    doc.text('Description:', { underline: true });
    doc.text(product.description);
    doc.moveDown();
  }

  if (product.category) {
    doc.text('Category:', { underline: true });
    doc.text(product.category);
    doc.moveDown();
  }

  if (product.ingredients) {
    doc.text('Ingredients:', { underline: true });
    doc.text(product.ingredients);
    doc.moveDown();
  }

  if (product.manufacturing_process) {
    doc.text('Manufacturing Process:', { underline: true });
    doc.text(product.manufacturing_process);
    doc.moveDown();
  }

  if (product.country_of_origin) {
    doc.text('Country of Origin:', { underline: true });
    doc.text(product.country_of_origin);
    doc.moveDown();
  }

  // Add Q&A section if available
  if (product.question_answers && product.question_answers.length > 0) {
    doc.moveDown();
    doc.fontSize(14).text('Frequently Asked Questions', { underline: true });
    doc.moveDown();

    product.question_answers.forEach((qa, index) => {
      doc.fontSize(12).text(`Q${index + 1}: ${qa.question}`, { bold: true });
      doc.text(`A: ${qa.answer}`);
      doc.moveDown();
    });
  }
};

/**
 * Add transparency content to PDF
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} product - Product data
 */
const addTransparencyContent = (doc, product) => {
  doc.fontSize(12);

  // Add transparency score if available
  if (product.transparency_score !== undefined && product.transparency_score !== null) {
    doc.text('Transparency Score:', { underline: true });
    doc.text(`${product.transparency_score}/10`);
    doc.moveDown();
  }

  // Add other transparency related information
  if (product.manufacturing_process) {
    doc.text('Manufacturing Process:', { underline: true });
    doc.text(product.manufacturing_process);
    doc.moveDown();
  }

  if (product.ingredients) {
    doc.text('Ingredients Transparency:', { underline: true });
    doc.text(product.ingredients);
    doc.moveDown();
  }

  // Add any additional transparency information
  doc.text('Transparency Commitment:', { underline: true });
  doc.text('This product follows our commitment to transparency in manufacturing and sourcing.');
  doc.moveDown();
};

/**
 * Add certification content to PDF
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} product - Product data
 */
const addCertificationContent = (doc, product) => {
  doc.fontSize(12);

  // Add certifications if available
  if (product.certifications && product.certifications.length > 0) {
    doc.text('Certifications:', { underline: true });
    product.certifications.forEach(cert => {
      doc.text(`• ${cert}`);
    });
    doc.moveDown();
  } else {
    doc.text('No certifications available for this product.');
    doc.moveDown();
  }

  // Add certification verification information
  doc.text('Certification Verification:', { underline: true });
  doc.text('All certifications can be verified through our official website or by contacting the certification authorities directly.');
  doc.moveDown();
};

/**
 * Add custom content to PDF based on metadata
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} product - Product data
 * @param {Object} metadata - Custom metadata
 */
const addCustomContent = (doc, product, metadata) => {
  doc.fontSize(12);

  // Add custom sections from metadata
  if (metadata.sections && Array.isArray(metadata.sections)) {
    metadata.sections.forEach(section => {
      if (section.title && section.content) {
        doc.text(section.title, { underline: true });
        doc.text(section.content);
        doc.moveDown();
      }
    });
  } else {
    // Default custom content if no sections provided
    doc.text('Custom Report Information:', { underline: true });
    doc.text('This is a custom report generated for this product.');
    doc.moveDown();

    // Add basic product info
    addProductDetailsContent(doc, product);
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/reports
 * @access  Private/Admin
 */
const getAllReports = async (req, res, next) => {
  try {
    console.log('Controller: Getting all reports');
    const reports = await Report.getAll();
    console.log(`Controller: Found ${reports.length} reports, sending response`);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Controller: Error getting all reports:', error);
    next(error);
  }
};

/**
 * @desc    Get reports by product ID
 * @route   GET /api/reports/product/:productId
 * @access  Private
 */
const getReportsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reports = await Report.getByProductId(productId);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reports created by user
 * @route   GET /api/reports/user
 * @access  Private
 */
const getUserReports = async (req, res, next) => {
  try {
    const reports = await Report.getByUserId(req.user._id);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get report by ID
 * @route   GET /api/reports/:id
 * @access  Private
 */
const getReportById = async (req, res, next) => {
  try {
    console.log('Controller: Getting report by ID:', req.params.id);
    const report = await Report.getById(req.params.id);
    console.log('Controller: Report retrieval result:', report ? 'Found' : 'Not found');

    if (!report) {
      console.log('Controller: Report not found, sending 404 response');
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    console.log('Controller: Sending report data in response');
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Controller: Error getting report by ID:', error);
    next(error);
  }
};

/**
 * @desc    Delete report
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
const deleteReport = async (req, res, next) => {
  try {
    console.log('Controller: Deleting report with ID:', req.params.id);
    console.log('Controller: User requesting deletion:', { id: req.user._id, role: req.user.role });
    
    const report = await Report.model.findById(req.params.id);
    console.log('Controller: Report found?', !!report);

    if (!report) {
      console.log('Controller: Report not found, sending 404 response');
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    console.log('Controller: Report creator:', report.created_by.toString());
    
    // Check if user is authorized to delete (admin or report creator)
    if (req.user.role !== 'admin' && report.created_by.toString() !== req.user._id.toString()) {
      console.log('Controller: User not authorized to delete this report');
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this report'
      });
    }

    console.log('Controller: User authorized to delete, calling Report.delete');
    const deleted = await Report.delete(req.params.id);
    console.log('Controller: Report deletion result:', deleted);

    console.log('Controller: Sending success response');
    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Controller: Error deleting report:', error);
    next(error);
  }
};

module.exports = {
  generateReport,
  getAllReports,
  getReportsByProduct,
  getUserReports,
  getReportById,
  deleteReport
};