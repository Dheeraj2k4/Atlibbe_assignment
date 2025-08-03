import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../config';

/**
 * Footer Component
 * Displays footer information and links
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{APP_NAME}</h3>
          <p>Providing transparency and traceability for products</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;