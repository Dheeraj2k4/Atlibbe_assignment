import React, { useState, useEffect } from 'react';
import authService, { UserData } from '../../services/authService';

/**
 * Admin Users Page
 * Page for administrators to manage users
 */
const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const usersData = await authService.getUsers();
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
        console.error('Error loading users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  /**
   * Handle user deletion
   * @param userId User ID to delete
   */
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsDeleting((prev) => ({ ...prev, [userId]: true }));
      try {
        await authService.deleteUser(userId);
        // Remove user from state
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
        console.error('Error deleting user:', err);
      } finally {
        setIsDeleting((prev) => ({ ...prev, [userId]: false }));
      }
    }
  };

  if (isLoading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="page-container admin-users-page">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View and manage user accounts</p>
      </div>

      <div className="page-content">
        {error && <div className="error-message">{error}</div>}

        <div className="users-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={isDeleting[user._id]}
                    >
                      {isDeleting[user._id] ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !isLoading && (
            <div className="no-users">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;