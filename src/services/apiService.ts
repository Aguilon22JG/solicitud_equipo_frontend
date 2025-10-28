import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.api(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const { refreshToken } = useAuthStore.getState();
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.refreshToken(refreshToken);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
            
            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
            
            this.processQueue(null);
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            useAuthStore.getState().clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  private handleError(error: any) {
    let message = ERROR_MESSAGES.GENERIC_ERROR;

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          message = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          message = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 404:
          message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
          message = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          message = error.response.data?.message || ERROR_MESSAGES.GENERIC_ERROR;
      }
    } else if (error.request) {
      message = ERROR_MESSAGES.NETWORK_ERROR;
    }

    toast.error(message);
  }

  private async refreshToken(refreshToken: string) {
    return axios.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      refreshToken,
    });
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<{success: boolean; message: string; data: T}>(endpoint, config);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<{success: boolean; message: string; data: T}>(endpoint, data, config);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<{success: boolean; message: string; data: T}>(endpoint, data, config);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<{success: boolean; message: string; data: T}>(endpoint, data, config);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<{success: boolean; message: string}>(endpoint, config);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data as T;
  }

  // File upload
  async upload<T>(endpoint: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(endpoint, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }

  // Download file
  async download(endpoint: string, filename: string, config?: AxiosRequestConfig): Promise<void> {
    const response = await this.api.get(endpoint, {
      ...config,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Get API instance for custom requests
  getApi(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();