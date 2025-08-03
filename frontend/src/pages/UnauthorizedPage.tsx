import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Unauthorized Page
 * Displayed when a user tries to access a page they don't have permission for
 */
const UnauthorizedPage: React.FC = () => {
  return (
    <div className="page-container unauthorized-page">
      <div className="page-content">
        <div className="error-container">
          <h1>Access Denied</h1>
          <div className="error-icon">🔒</div>
          <p>You don't have permission to access this page.</p>
          <p>Please contact an administrator if you believe this is an error.</p>
          <div className="action-buttons">
            <Link to="/" className="button">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;