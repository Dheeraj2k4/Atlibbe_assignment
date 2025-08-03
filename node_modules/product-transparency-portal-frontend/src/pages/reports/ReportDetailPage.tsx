import React from 'react';
import ReportDetail from '../../components/reports/ReportDetail';

/**
 * Report Detail Page
 * Page for viewing a specific report
 */
const ReportDetailPage: React.FC = () => {
  return (
    <div className="page-container report-detail-page">
      <div className="page-content">
        <ReportDetail />
      </div>
    </div>
  );
};

export default ReportDetailPage;