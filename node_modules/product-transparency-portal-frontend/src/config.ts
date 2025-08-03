/**
 * API Configuration
 */

// API base URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Other configuration constants
export const APP_NAME = 'Product Transparency Portal';

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;