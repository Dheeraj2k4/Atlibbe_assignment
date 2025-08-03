import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../../contexts/ReportContext';
import ReportList from '../../components/reports/ReportList';

/**
 * Admin Dashboard Page
 * Dashboard for administrators with overview of system data
 */
const AdminDashboardPage: React.FC = () => {
  const { reports, isLoading } = useReports();
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [reportCount, setReportCount] = useState<number>(0);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // In a real application, you would fetch these counts from an API
        // For now, we'll just use some placeholder values
        setUserCount(10);
        setProductCount(25);
        setReportCount(reports.length);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    loadDashboardData();
  }, [reports.length]);

  return (
    <div className="page-container admin-dashboard-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of system data and management options</p>
      </div>

      <div className="page-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Users</h3>
            <div className="stat-value">{userCount}</div>
            <Link to="/admin/users" className="stat-link">
              Manage Users
            </Link>
          </div>

          <div className="stat-card">
            <h3>Products</h3>
            <div className="stat-value">{productCount}</div>
            <Link to="/products" className="stat-link">
              View Products
            </Link>
          </div>

          <div className="stat-card">
            <h3>Reports</h3>
            <div className="stat-value">{reportCount}</div>
            <Link to="/reports" className="stat-link">
              View Reports
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Reports</h2>
          {isLoading ? (
            <div className="loading">Loading reports...</div>
          ) : (
            <ReportList limit={5} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;