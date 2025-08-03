import axios from 'axios';
import { API_URL } from '../config';
import authService from './authService';

// Types
export interface Report {
  _id: string;
  product: {
    _id: string;
    name: string;
    description?: string;
  };
  filename: string;
  filepath: string;
  created_by: {
    _id: string;
    name: string;
    email: string;
  };
  report_type: 'product_details' | 'transparency' | 'certification' | 'custom';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GenerateReportParams {
  productId: string;
  report_type?: 'product_details' | 'transparency' | 'certification' | 'custom';
  metadata?: Record<string, any>;
}

export interface GenerateReportResponse {
  report_id: string;
  filename: string;
  report_url: string;
  report_type: string;
}

/**
 * Report Service
 * Handles report generation and management
 */
const reportService = {
  /**
   * Generate a report for a product
   * @param params Report generation parameters
   * @returns Generated report data
   */
  async generateReport(params: GenerateReportParams): Promise<GenerateReportResponse> {
    try {
      console.log('reportService.generateReport called with params:', params);
      const { productId, ...data } = params;
      console.log('Making API request to generate report for product:', productId);
      console.log('Request data:', data);
      console.log('Request headers:', authService.authHeader());
      
      const response = await axios.post(
        `${API_URL}/reports/generate/${productId}`,
        data,
        {
          headers: authService.authHeader(),
        }
      );

      console.log('Report generation API response:', response.data);

      if (response.data.success) {
        console.log('Report generated successfully:', response.data.data);
        return response.data.data;
      }
      console.error('API returned success=false:', response.data);
      throw new Error('Failed to generate report');
    } catch (error: any) {
      console.error('Error generating report:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to generate report');
    }
  },

  /**
   * Get all reports (admin only)
   * @returns List of all reports
   */
  async getAllReports(): Promise<Report[]> {
    try {
      console.log('reportService.getAllReports called');
      console.log('Request headers:', authService.authHeader());
      
      const response = await axios.get(`${API_URL}/reports`, {
        headers: authService.authHeader(),
      });

      console.log('getAllReports API response:', response.data);

      if (response.data.success) {
        console.log('All reports fetched successfully, count:', response.data.data.length);
        return response.data.data;
      }
      console.error('API returned success=false:', response.data);
      throw new Error('Failed to get reports');
    } catch (error: any) {
      console.error('Error fetching all reports:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to get reports');
    }
  },

  /**
   * Get reports created by the current user
   * @returns List of user's reports
   */
  async getUserReports(): Promise<Report[]> {
    try {
      console.log('reportService.getUserReports called');
      console.log('Request headers:', authService.authHeader());
      
      const response = await axios.get(`${API_URL}/reports/user`, {
        headers: authService.authHeader(),
      });

      console.log('getUserReports API response:', response.data);

      if (response.data.success) {
        console.log('User reports fetched successfully, count:', response.data.data.length);
        return response.data.data;
      }
      console.error('API returned success=false:', response.data);
      throw new Error('Failed to get user reports');
    } catch (error: any) {
      console.error('Error fetching user reports:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to get user reports');
    }
  },

  /**
   * Get reports by product ID
   * @param productId Product ID
   * @returns List of reports for the specified product
   */
  async getReportsByProduct(productId: string): Promise<Report[]> {
    try {
      console.log('reportService.getReportsByProduct called with productId:', productId);
      console.log('Request headers:', authService.authHeader());
      
      const response = await axios.get(`${API_URL}/reports/product/${productId}`, {
        headers: authService.authHeader(),
      });

      console.log('getReportsByProduct API response:', response.data);

      if (response.data.success) {
        console.log('Product reports fetched successfully, count:', response.data.data.length);
        return response.data.data;
      }
      console.error('API returned success=false:', response.data);
      throw new Error('Failed to get product reports');
    } catch (error: any) {
      console.error('Error fetching product reports:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to get product reports');
    }
  },

  /**
   * Get report by ID
   * @param reportId Report ID
   * @returns Report data
   */
  async getReportById(reportId: string): Promise<Report> {
    try {
      console.log('reportService.getReportById called with reportId:', reportId);
      console.log('Request headers:', authService.authHeader());
      
      const response = await axios.get(`${API_URL}/reports/${reportId}`, {
        headers: authService.authHeader(),
      });

      console.log('getReportById API response:', response.data);

      if (response.data.success) {
        console.log('Report fetched successfully:', response.data.data);
        return response.data.data;
      }
      console.error('API returned success=false:', response.data);
      throw new Error('Failed to get report');
    } catch (error: any) {
      console.error('Error fetching report by ID:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to get report');
    }
  },

  /**
   * Delete report
   * @param reportId Report ID
   * @returns Success message
   */
  async deleteReport(reportId: string): Promise<string> {
    try {
      console.log('reportService.deleteReport called with reportId:', reportId);
      console.log('Request headers:', authService.authHeader());
      
      const response = await axios.delete(`${API_URL}/reports/${reportId}`, {
        headers: authService.authHeader(),
      });

      console.log('deleteReport API response:', response.data);

      if (response.data.success) {
        console.log('Report deleted successfully:', response.data.message);
        return response.data.message;
      }
      console.error('API returned success=false:', response.data);
      throw new Error('Failed to delete report');
    } catch (error: any) {
      console.error('Error deleting report:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to delete report');
    }
  },

  /**
   * Get report download URL
   * @param filename Report filename
   * @returns Full URL to download the report
   */
  getReportDownloadUrl(filename: string): string {
    return `${API_URL}/public/reports/${filename}`;
  },
};

export default reportService;