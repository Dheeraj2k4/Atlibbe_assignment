export type ThemeType = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    lightText: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    border: string;
    lightBg: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  transitions: {
    default: string;
    slow: string;
    fast: string;
  };
  borderRadius: {
    small: string;
    default: string;
    large: string;
    round: string;
  };
};

export const theme: ThemeType = {
  colors: {
    primary: '#2E7D32', // Green - representing health and transparency
    secondary: '#1565C0', // Blue - representing trust and wisdom
    accent: '#6A1B9A', // Purple - representing virtue
    background: '#FFFFFF',
    text: '#333333',
    lightText: '#666666',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FFA000',
    info: '#0288D1',
    border: '#E0E0E0',
    lightBg: '#F5F5F5',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: '0.3s ease',
    slow: '0.5s ease',
    fast: '0.15s ease',
  },
  borderRadius: {
    small: '4px',
    default: '8px',
    large: '12px',
    round: '50%',
  },
};