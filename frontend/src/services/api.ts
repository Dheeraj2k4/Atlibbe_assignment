// src/services/api.ts
import axios, { AxiosResponse } from 'axios';
import {
  Product,
  Report,
  ApiResponse,
  GenerateQuestionsResponse,
  TransparencyScoreRequest,
  TransparencyScoreResponse,
  GenerateQuestionsRequest,
  Question,
} from '../types';

// Helper function to validate MongoDB ObjectId format
const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

// Axios instances
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

const aiService = axios.create({
  baseURL: process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptors to attach token if present
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Reattempt request if 401 and retry not already set
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const productApi = {
  // Create new product with question-answer pairs
  createProduct: async (productData: Product & { questions?: Question[] }) => {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await api.post(
        '/api/products',
        productData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create product',
      };
    }
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, error: 'Invalid product ID format' };
      }

      const response: AxiosResponse<ApiResponse<Product>> = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch product',
      };
    }
  },
};

export const reportApi = {
  getReport: async (id: string): Promise<ApiResponse<Report>> => {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, error: 'Invalid product ID format' };
      }

      const response: AxiosResponse<ApiResponse<Report>> = await api.get(`/api/report/product/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching report:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch report',
      };
    }
  },

  downloadReport: async (id: string): Promise<Blob> => {
    try {
      if (!isValidObjectId(id)) {
        throw new Error('Invalid product ID format');
      }

      const response = await api.get(`/api/report/download/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },

  previewReport: async (id: string): Promise<string> => {
    try {
      if (!isValidObjectId(id)) {
        throw new Error('Invalid product ID format');
      }

      return `${api.defaults.baseURL}/api/report/preview/${id}`;
    } catch (error: any) {
      console.error('Error generating preview URL:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate preview URL');
    }
  },

  generateReport: async (
    payload: { product: Product }
  ): Promise<ApiResponse<{ pdf_url: string; report: Report }>> => {
    try {
      const response: AxiosResponse<ApiResponse<{ pdf_url: string; report: Report }>> = await api.post(
        '/api/report/generate',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate report',
      };
    }
  },
};

export const aiApi = {
  generateQuestions: async (
    request: GenerateQuestionsRequest
  ): Promise<ApiResponse<GenerateQuestionsResponse>> => {
    try {
      const response: AxiosResponse<GenerateQuestionsResponse> = await aiService.post(
        '/api/generate-questions',
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error generating questions:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate questions',
      };
    }
  },

  getTransparencyScore: async (
    request: TransparencyScoreRequest
  ): Promise<ApiResponse<TransparencyScoreResponse>> => {
    try {
      const response: AxiosResponse<ApiResponse<TransparencyScoreResponse>> = await aiService.post(
        '/api/transparency-score',
        request
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to calculate transparency score',
      };
    }
  },
};

export default api;
