import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports } from '../../contexts/ReportContext';
import reportService, { Report } from '../../services/reportService';

/**
 * Report Detail Component
 * Displays detailed information about a specific report
 */
const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteReport } = useReports();
  const navigate = useNavigate();

  // Load report data
  useEffect(() => {
    const loadReport = async () => {
      console.log('ReportDetail: Loading report with id:', id);
      if (!id) {
        console.log('ReportDetail: No report ID provided');
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log('ReportDetail: Set loading state, cleared errors');

      try {
        console.log('ReportDetail: Calling reportService.getReportById');
        const reportData = await reportService.getReportById(id);
        console.log('ReportDetail: Report data received:', reportData);
        setReport(reportData);
        console.log('ReportDetail: Report state updated');
      } catch (err: any) {
        console.error('ReportDetail: Error loading report:', err);
        setError(err.message || 'Failed to load report');
        console.error('ReportDetail: Error state set');
      } finally {
        setIsLoading(false);
        console.log('ReportDetail: Loading state set to false');
      }
    };

    loadReport();
  }, [id]);

  /**
   * Handle report deletion
   */
  const handleDelete = async () => {
    if (!id || !report) return;

    if (window.confirm('Are you sure you want to delete this report?')) {
      setIsDeleting(true);
      try {
        await deleteReport(id);
        navigate('/reports');
      } catch (err: any) {
        setError(err.message || 'Failed to delete report');
        console.error('Error deleting report:', err);
      } finally {
        setIsDeleting(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (isLoading) {
    return <div className="loading">Loading report...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/reports" className="button">Back to Reports</Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="not-found-container">
        <div className="not-found-message">Report not found</div>
        <Link to="/reports" className="button">Back to Reports</Link>
      </div>
    );
  }

  return (
    <div className="report-detail-container">
      <div className="report-detail-card">
        <h2>Report Details</h2>
        
        <div className="report-info">
          <div className="info-group">
            <label>Report Type:</label>
            <span>{getReportTypeDisplay(report.report_type)}</span>
          </div>
          
          <div className="info-group">
            <label>Created:</label>
            <span>{formatDate(report.created_at)}</span>
          </div>
          
          <div className="info-group">
            <label>Filename:</label>
            <span>{report.filename}</span>
          </div>
          
          <div className="info-group">
            <label>Product ID:</label>
            <span>
              <Link to={`/products/${report.product._id}`}>{report.product.name}</Link>
            </span>
          </div>
          
          {report.metadata && (
            <div className="metadata-section">
              <h3>Report Metadata</h3>
              <div className="metadata-content">
                {Object.entries(report.metadata).map(([key, value]) => (
                  <div key={key} className="metadata-item">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
                    <span>
                      {typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="report-actions">
          <a 
            href={reportService.getReportDownloadUrl(report.filename)} 
            className="download-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Report
          </a>
          
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Report'}
          </button>
          
          <Link to="/reports" className="back-button">
            Back to Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;