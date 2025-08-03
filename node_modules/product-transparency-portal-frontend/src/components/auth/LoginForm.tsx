import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Login Form Component
 * Allows users to log in to the application
 */
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  /**
   * Handle form submission
   * @param e Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Validate form
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      // Attempt login
      await login({ email, password });
      // Redirect to previous page or home
      navigate(from, { replace: true });
    } catch (err: any) {
      setFormError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2>Login</h2>
        
        {/* Display errors */}
        {(error || formError) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;