import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

/**
 * Register Page
 * Page for user registration
 */
const RegisterPage: React.FC = () => {
  return (
    <div className="page-container register-page">
      <div className="page-content">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;