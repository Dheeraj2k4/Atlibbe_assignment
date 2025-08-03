import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { ReportProvider } from './contexts/ReportContext';

// Pages
import LandingPage from './pages/LandingPage';
import ProductForm from './pages/ProductForm';
import NotFound from './pages/NotFound';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';

// Report Pages
import ReportsPage from './pages/reports/ReportsPage';
import ReportDetailPage from './pages/reports/ReportDetailPage';
import GenerateReportPage from './pages/reports/GenerateReportPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <ReportProvider>
          <div className="app-container">
            <Header />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/submit" element={<ProductForm />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/reports/:id" element={<ReportDetailPage />} />
                  <Route path="/products/:productId/generate-report" element={<GenerateReportPage />} />
                </Route>
                
                {/* Admin routes */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                </Route>
                
                {/* Fallback routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ReportProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;