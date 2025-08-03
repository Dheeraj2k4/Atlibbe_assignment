import axios from 'axios';
import { API_URL } from '../config';

// Types
export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
}

// Local storage key
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Authentication Service
 * Handles user authentication, registration, and profile management
 */
const authService = {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns User data with token
   */
  async register(userData: RegisterData): Promise<UserData> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.success) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data);
        return response.data.data;
      }
      throw new Error('Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  /**
   * Login user
   * @param credentials User login credentials
   * @returns User data with token
   */
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.success) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data);
        return response.data.data;
      }
      throw new Error('Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get user profile
   * @returns User profile data
   */
  async getProfile(): Promise<UserData> {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: this.authHeader(),
      });
      if (response.data.success) {
        // Update stored user data with latest profile
        const userData = { ...this.getUser(), ...response.data.data };
        this.setUser(userData);
        return userData;
      }
      throw new Error('Failed to get profile');
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
      }
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  },

  /**
   * Update user profile
   * @param updateData Profile update data
   * @returns Updated user data
   */
  async updateProfile(updateData: UpdateProfileData): Promise<UserData> {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, updateData, {
        headers: this.authHeader(),
      });
      if (response.data.success) {
        // Update stored user data with updated profile
        const userData = { ...this.getUser(), ...response.data.data };
        this.setUser(userData);
        return userData;
      }
      throw new Error('Failed to update profile');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  /**
   * Check if user is logged in
   * @returns True if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if user is admin
   * @returns True if user is admin
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  },

  /**
   * Get authentication header
   * @returns Authentication header object
   */
  authHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * Set authentication token
   * @param token JWT token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Get authentication token
   * @returns JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Set user data
   * @param user User data
   */
  setUser(user: UserData): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get user data
   * @returns User data
   */
  getUser(): UserData | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Get all users (admin only)
   * @returns List of all users
   */
  async getUsers(): Promise<UserData[]> {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: this.authHeader(),
      });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to get users');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get users');
    }
  },

  /**
   * Delete a user (admin only)
   * @param userId User ID to delete
   * @returns Success message
   */
  async deleteUser(userId: string): Promise<string> {
    try {
      const response = await axios.delete(`${API_URL}/auth/users/${userId}`, {
        headers: this.authHeader(),
      });
      if (response.data.success) {
        return response.data.message;
      }
      throw new Error('Failed to delete user');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  },
};

export default authService;