import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Register Form Component
 * Allows users to create a new account
 */
const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param e Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      // Attempt registration
      await register({ name, email, password });
      // Redirect to home page
      navigate('/');
    } catch (err: any) {
      setFormError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form-card">
        <h2>Create an Account</h2>
        
        {/* Display errors */}
        {(error || formError) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your name"
              required
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;