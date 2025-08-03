import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import reportService, { Report, GenerateReportParams, GenerateReportResponse } from '../services/reportService';
import { useAuth } from './AuthContext';

// Context interface
interface ReportContextType {
  reports: Report[];
  userReports: Report[];
  isLoading: boolean;
  error: string | null;
  generateReport: (params: GenerateReportParams) => Promise<GenerateReportResponse>;
  getReportsByProduct: (productId: string) => Promise<Report[]>;
  getReportById: (reportId: string) => Promise<Report>;
  deleteReport: (reportId: string) => Promise<void>;
  refreshReports: () => Promise<void>;
  clearError: () => void;
}

// Create context with default values
const ReportContext = createContext<ReportContextType>({
  reports: [],
  userReports: [],
  isLoading: false,
  error: null,
  generateReport: async () => ({ report_id: '', filename: '', report_url: '', report_type: '' }),
  getReportsByProduct: async () => [],
  getReportById: async () => ({
    _id: '',
    product: {
      _id: '',
      name: '',
    },
    filename: '',
    filepath: '',
    created_by: {
      _id: '',
      name: '',
      email: '',
    },
    report_type: 'product_details',
    metadata: {},
    created_at: '',
    updated_at: '',
  }),
  deleteReport: async () => {},
  refreshReports: async () => {},
  clearError: () => {},
});

// Props interface
interface ReportProviderProps {
  children: ReactNode;
}

/**
 * Report Provider Component
 * Provides report state and methods to the app
 */
export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin, isAuthenticated } = useAuth();

  // Load reports when user changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshReports();
    }
  }, [isAuthenticated, user?._id]);

  /**
   * Refresh reports data
   */
  const refreshReports = async () => {
    console.log('refreshReports called, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping report refresh');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching user reports...');
      // Get user reports
      const userReportsData = await reportService.getUserReports();
      console.log('User reports fetched successfully:', userReportsData);
      setUserReports(userReportsData);
      
      // Get all reports for admin users
      if (isAdmin) {
        console.log('User is admin, fetching all reports...');
        const allReports = await reportService.getAllReports();
        console.log('All reports fetched successfully:', allReports);
        setReports(allReports);
      } else {
        console.log('User is not admin, using user reports for reports state');
        setReports(userReportsData);
      }
      console.log('Reports state updated successfully');
    } catch (err: any) {
      console.error('Error refreshing reports:', err);
      setError(err.message || 'Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setIsLoading(false);
      console.log('refreshReports completed, isLoading set to false');
    }
  };

  /**
   * Generate a new report
   * @param params Report generation parameters
   */
  const generateReport = async (params: GenerateReportParams) => {
    console.log('Generating report with params:', params);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling reportService.generateReport');
      const newReport = await reportService.generateReport(params);
      console.log('Report generated successfully:', newReport);
      
      console.log('Refreshing reports after generation');
      await refreshReports();
      console.log('Reports refreshed successfully');
      
      return newReport;
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get reports by product ID
   * @param productId Product ID
   */
  const getReportsByProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await reportService.getReportsByProduct(productId);
    } catch (err: any) {
      setError(err.message || 'Failed to get reports');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get report by ID
   * @param reportId Report ID
   */
  const getReportById = async (reportId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await reportService.getReportById(reportId);
    } catch (err: any) {
      setError(err.message || 'Failed to get report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a report
   * @param reportId Report ID
   */
  const deleteReport = async (reportId: string) => {
    console.log('ReportContext: Deleting report with ID:', reportId);
    setIsLoading(true);
    setError(null);
    console.log('ReportContext: Set loading state, cleared errors');
    
    try {
      console.log('ReportContext: Calling reportService.deleteReport');
      await reportService.deleteReport(reportId);
      console.log('ReportContext: Report deleted successfully');
      
      console.log('ReportContext: Refreshing reports after deletion');
      await refreshReports();
      console.log('ReportContext: Reports refreshed successfully');
    } catch (err: any) {
      console.error('ReportContext: Error deleting report:', err);
      setError(err.message || 'Failed to delete report');
      throw err;
    } finally {
      setIsLoading(false);
      console.log('ReportContext: Loading state set to false');
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    reports,
    userReports,
    isLoading,
    error,
    generateReport,
    getReportsByProduct,
    getReportById,
    deleteReport,
    refreshReports,
    clearError,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

/**
 * Custom hook to use report context
 * @returns Report context
 */
export const useReports = () => useContext(ReportContext);