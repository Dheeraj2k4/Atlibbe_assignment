import React from 'react';
import ReportList from '../../components/reports/ReportList';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Reports Page
 * Page for viewing all reports
 */
const ReportsPage: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="page-container reports-page">
      <div className="page-header">
        <h1>{isAdmin ? 'All Reports' : 'Your Reports'}</h1>
        <p>
          {isAdmin
            ? 'View and manage all reports in the system.'
            : 'View and manage your generated reports.'}
        </p>
      </div>
      <div className="page-content">
        <ReportList />
      </div>
    </div>
  );
};

export default ReportsPage;