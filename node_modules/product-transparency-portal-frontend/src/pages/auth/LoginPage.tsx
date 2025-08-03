import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

/**
 * Login Page
 * Page for user login
 */
const LoginPage: React.FC = () => {
  return (
    <div className="page-container login-page">
      <div className="page-content">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;