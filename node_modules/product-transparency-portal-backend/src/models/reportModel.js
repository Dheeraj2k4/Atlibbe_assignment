const mongoose = require('mongoose');
const path = require('path');

/**
 * Report Schema
 */
const reportSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  report_type: {
    type: String,
    enum: ['product_details', 'transparency', 'certification', 'custom'],
    default: 'product_details'
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Report = mongoose.model('Report', reportSchema);

/**
 * Report Model Methods
 */
module.exports = {
  model: Report, // in case you need direct access to the model

  /**
   * Create a new report
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} - Created report
   */
  async create(reportData) {
    try {
      console.log('Creating report in database with data:', reportData);
      
      const report = new Report({
        product: reportData.product,
        filename: reportData.filename,
        filepath: reportData.filepath,
        created_by: reportData.created_by,
        report_type: reportData.report_type || 'product_details',
        metadata: reportData.metadata || {}
      });
      
      console.log('Report model instance created:', report);
      
      const savedReport = await report.save();
      console.log('Report saved successfully:', savedReport);
      
      return savedReport;
    } catch (error) {
      console.error('Error creating report:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  /**
   * Get report by ID
   * @param {string} id - Report ID
   * @returns {Promise<Object>} - Report data
   */
  async getById(id) {
    try {
      console.log('Report model: Getting report by ID:', id);
      const report = await Report.findById(id)
        .populate('product', 'name description')
        .populate('created_by', 'name email');
      
      console.log('Report model: Report found?', !!report);
      if (report) {
        console.log('Report model: Report details:', {
          id: report._id,
          product: report.product ? report.product.name : 'No product',
          filename: report.filename,
          created_by: report.created_by ? report.created_by.email : 'No user'
        });
      }
      
      return report;
    } catch (error) {
      console.error('Error getting report by ID:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  /**
   * Get reports by product ID
   * @param {string} productId - Product ID
   * @returns {Promise<Array>} - Array of reports
   */
  async getByProductId(productId) {
    try {
      return await Report.find({ product: productId })
        .populate('product', 'name description')
        .populate('created_by', 'name email')
        .sort({ created_at: -1 });
    } catch (error) {
      console.error('Error getting reports by product ID:', error);
      throw error;
    }
  },

  /**
   * Get reports by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of reports
   */
  async getByUserId(userId) {
    try {
      return await Report.find({ created_by: userId })
        .populate('product', 'name description')
        .sort({ created_at: -1 });
    } catch (error) {
      console.error('Error getting reports by user ID:', error);
      throw error;
    }
  },

  /**
   * Update report
   * @param {string} id - Report ID
   * @param {Object} updateData - Report update data
   * @returns {Promise<Object>} - Updated report
   */
  async update(id, updateData) {
    try {
      return await Report.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  /**
   * Delete report
   * @param {string} id - Report ID
   * @returns {Promise<boolean>} - True if deleted
   */
  async delete(id) {
    try {
      console.log('Report model: Deleting report with ID:', id);
      const report = await Report.findById(id);
      console.log('Report model: Report found?', !!report);
      
      if (!report) {
        console.log('Report model: Report not found, returning false');
        return false;
      }

      console.log('Report model: Report filepath:', report.filepath);
      
      // Delete the file from the filesystem
      const fs = require('fs');
      try {
        if (fs.existsSync(report.filepath)) {
          console.log('Report model: File exists, deleting from filesystem');
          fs.unlinkSync(report.filepath);
          console.log('Report model: File deleted successfully');
        } else {
          console.log('Report model: File does not exist in filesystem');
        }
      } catch (fsError) {
        console.error('Report model: Error deleting report file:', fsError);
        console.error('Report model: File error details:', fsError.message);
        // Continue with deletion from database even if file deletion fails
      }

      console.log('Report model: Deleting report from database');
      const result = await Report.findByIdAndDelete(id);
      console.log('Report model: Database deletion result:', !!result);
      return !!result;
    } catch (error) {
      console.error('Report model: Error deleting report:', error);
      console.error('Report model: Error details:', error.message);
      console.error('Report model: Error stack:', error.stack);
      throw error;
    }
  },
  
  /**
   * Get all reports
   * @returns {Promise<Array>} - Array of all reports
   */
  async getAll() {
    try {
      console.log('Report model: Getting all reports');
      const reports = await Report.find({})
        .populate('product', 'name description')
        .populate('created_by', 'name email')
        .sort({ created_at: -1 });
      console.log(`Report model: Found ${reports.length} reports`);
      return reports;
    } catch (error) {
      console.error('Error getting all reports:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
};