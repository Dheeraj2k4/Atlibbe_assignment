import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserData, LoginCredentials, RegisterData, UpdateProfileData } from '../services/authService';

// Context interface
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updateData: UpdateProfileData) => Promise<void>;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  clearError: () => {},
});

// Props interface
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Provides authentication state and methods to the app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isLoggedIn()) {
          const userData = authService.getUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   * @param credentials User login credentials
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register user
   * @param userData User registration data
   */
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Update user profile
   * @param updateData Profile update data
   */
  const updateProfile = async (updateData: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(updateData);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  // Compute derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Context value
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * @returns Auth context
 */
export const useAuth = () => useContext(AuthContext);