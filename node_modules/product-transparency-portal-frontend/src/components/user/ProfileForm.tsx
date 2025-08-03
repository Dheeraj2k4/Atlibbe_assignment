import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Profile Form Component
 * Allows users to view and update their profile information
 */
const ProfileForm: React.FC = () => {
  const { user, updateProfile, error, clearError, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  /**
   * Handle form submission
   * @param e Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    clearError();

    // Check if passwords match when updating password
    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    // Check password length if provided
    if (password && password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      // Only include fields that have changed
      const updateData: { name?: string; email?: string; password?: string } = {};
      
      if (name !== user?.name) updateData.name = name;
      if (email !== user?.email) updateData.email = email;
      if (password) updateData.password = password;

      // Only update if there are changes
      if (Object.keys(updateData).length === 0) {
        setFormError('No changes to update');
        return;
      }

      // Update profile
      await updateProfile(updateData);
      
      // Clear password fields
      setPassword('');
      setConfirmPassword('');
      
      // Show success message
      setSuccessMessage('Profile updated successfully');
    } catch (err: any) {
      setFormError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-card">
        <h2>Your Profile</h2>
        
        {/* Display errors */}
        {(error || formError) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}
        
        {/* Display success message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
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
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter new password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirm new password"
            />
          </div>
          
          <button 
            type="submit" 
            className="update-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;