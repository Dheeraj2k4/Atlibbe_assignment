import React from 'react';
import ProfileForm from '../../components/user/ProfileForm';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Profile Page
 * Page for viewing and editing user profile
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-container profile-page">
      <div className="page-header">
        <h1>Your Profile</h1>
      </div>
      <div className="page-content">
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;