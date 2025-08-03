import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../config';

/**
 * Navigation Component
 * Main navigation bar for the application
 */
const Navigation: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">{APP_NAME}</Link>
        </div>
        
        <div className="nav-links">
          {/* Public links */}
          <Link to="/products" className="nav-link">Products</Link>
          
          {/* Authenticated user links */}
          {isAuthenticated && (
            <>
              <Link to="/reports" className="nav-link">Reports</Link>
              
              {/* Admin-only links */}
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
            </>
          )}
        </div>
        
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hello, {user?.name}</span>
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/reports" className="dropdown-item">My Reports</Link>
                {isAdmin && (
                  <Link to="/admin/users" className="dropdown-item">Manage Users</Link>
                )}
                <button onClick={handleLogout} className="dropdown-item logout-button">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;