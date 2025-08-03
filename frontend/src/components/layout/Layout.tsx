import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout Component
 * Provides consistent layout structure for all pages
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;