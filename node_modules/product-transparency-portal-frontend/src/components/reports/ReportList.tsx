import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../../contexts/ReportContext';
import { useAuth } from '../../contexts/AuthContext';
import { Report } from '../../services/reportService';
import reportService from '../../services/reportService';

interface ReportListProps {
  productId?: string;
  limit?: number;
}

/**
 * Report List Component
 * Displays a list of reports, optionally filtered by product ID
 */
const ReportList: React.FC<ReportListProps> = ({ productId, limit }) => {
  const { reports, userReports, refreshReports, deleteReport, isLoading, error } = useReports();
  const { isAdmin } = useAuth();
  const [displayReports, setDisplayReports] = useState<Report[]>([]);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  // Load reports on component mount and when productId changes
  useEffect(() => {
    const loadReports = async () => {
      try {
        if (productId) {
          const productReports = await reportService.getReportsByProduct(productId);
          setDisplayReports(productReports);
        } else {
          // Use reports from context
          setDisplayReports(isAdmin ? reports : userReports);
        }
      } catch (err) {
        console.error('Error loading reports:', err);
      }
    };

    loadReports();
  }, [productId, reports, userReports, isAdmin, refreshReports]);

  // Apply limit if specified
  const limitedReports = limit ? displayReports.slice(0, limit) : displayReports;

  /**
   * Handle report deletion
   * @param reportId Report ID to delete
   */
  const handleDelete = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setIsDeleting((prev) => ({ ...prev, [reportId]: true }));
      try {
        await deleteReport(reportId);
      } catch (err) {
        console.error('Error deleting report:', err);
      } finally {
        setIsDeleting((prev) => ({ ...prev, [reportId]: false }));
      }
    }
  };

  /**
   * Format date for display
   * @param date Date to format
   */
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Get report type display name
   * @param type Report type
   */
  const getReportTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      standard: 'Standard',
      detailed: 'Detailed',
      summary: 'Summary',
      custom: 'Custom',
    };
    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading && displayReports.length === 0) {
    return <div className="loading">Loading reports...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (displayReports.length === 0) {
    return (
      <div className="no-reports">
        <p>No reports found.</p>
        {productId && (
          <Link to={`/products/${productId}/generate-report`} className="button">
            Generate Report
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="report-list-container">
      <div className="report-list">
        <table>
          <thead>
            <tr>
              <th>Report Type</th>
              <th>Created Date</th>
              <th>Filename</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {limitedReports.map((report) => (
              <tr key={report._id}>
                <td>{getReportTypeDisplay(report.report_type)}</td>
                <td>{formatDate(report.created_at)}</td>
                <td>{report.filename}</td>
                <td className="actions">
                  <Link to={`/reports/${report._id}`} className="view-button">
                    View
                  </Link>
                  <a 
                    href={reportService.getReportDownloadUrl(report.filename)} 
                    className="download-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(report._id)}
                    disabled={isDeleting[report._id]}
                  >
                    {isDeleting[report._id] ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {productId && (
        <div className="report-actions">
          <Link to={`/products/${productId}/generate-report`} className="button">
            Generate New Report
          </Link>
        </div>
      )}
      
      {limit && displayReports.length > limit && (
        <div className="view-all">
          <Link to="/reports">View All Reports</Link>
        </div>
      )}
    </div>
  );
};

export default ReportList;