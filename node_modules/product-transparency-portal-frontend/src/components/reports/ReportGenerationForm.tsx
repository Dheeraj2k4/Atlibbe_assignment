import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../contexts/ReportContext';

interface ReportGenerationFormProps {
  productId: string;
  productName?: string;
}

/**
 * Report Generation Form Component
 * Allows users to generate reports for a specific product
 */
const ReportGenerationForm: React.FC<ReportGenerationFormProps> = ({ productId, productName }) => {
  const [reportType, setReportType] = useState('standard');
  const [includeTransparency, setIncludeTransparency] = useState(true);
  const [includeCertification, setIncludeCertification] = useState(true);
  const [includeCustomContent, setIncludeCustomContent] = useState(false);
  const [customContent, setCustomContent] = useState('');
  const [formError, setFormError] = useState('');
  const { generateReport, error, clearError, isLoading } = useReports();
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param e Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setFormError('');
    clearError();
    console.log('Form state:', { reportType, includeTransparency, includeCertification, includeCustomContent, customContent });

    // Validate form
    if (includeCustomContent && !customContent) {
      console.log('Form validation failed: Missing custom content');
      setFormError('Please provide custom content or disable the custom content option');
      return;
    }

    try {
      // Prepare metadata
      const metadata: Record<string, any> = {
        includeTransparency,
        includeCertification,
      };

      // Add custom content if enabled
      if (includeCustomContent) {
        metadata.customContent = customContent;
      }
      
      console.log('Calling generateReport with:', { productId, reportType, metadata });

      // Generate report
      const report = await generateReport({
        productId,
        report_type: reportType as 'product_details' | 'transparency' | 'certification' | 'custom',
        metadata,
      });

      console.log('Report generated successfully:', report);
      console.log('Navigating to:', `/reports/${report.report_id}`);

      // Navigate to report details
      navigate(`/reports/${report.report_id}`);
    } catch (err: any) {
      console.error('Error generating report:', err);
      setFormError(err.message || 'Failed to generate report');
    }
  };

  return (
    <div className="report-generation-form-container">
      <div className="report-generation-form-card">
        <h2>Generate Report{productName ? ` for ${productName}` : ''}</h2>
        
        {/* Display errors */}
        {(error || formError) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reportType">Report Type</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              disabled={isLoading}
            >
              <option value="standard">Standard Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="summary">Summary Report</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={includeTransparency}
                onChange={(e) => setIncludeTransparency(e.target.checked)}
                disabled={isLoading}
              />
              Include Transparency Information
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={includeCertification}
                onChange={(e) => setIncludeCertification(e.target.checked)}
                disabled={isLoading}
              />
              Include Certification Information
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={includeCustomContent}
                onChange={(e) => setIncludeCustomContent(e.target.checked)}
                disabled={isLoading}
              />
              Include Custom Content
            </label>
          </div>
          
          {includeCustomContent && (
            <div className="form-group">
              <label htmlFor="customContent">Custom Content</label>
              <textarea
                id="customContent"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                disabled={isLoading}
                placeholder="Enter custom content for the report"
                rows={4}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="generate-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportGenerationForm;