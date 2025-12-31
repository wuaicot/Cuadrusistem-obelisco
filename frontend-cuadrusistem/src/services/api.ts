import axios, { type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging interceptors for development
if (import.meta.env.DEV) {
  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      console.log(
        `%c>> API Request: ${config.method?.toUpperCase()} ${config.url}`,
        'color: #007bff; font-weight: bold;',
        config.data ? config.data : ''
      );
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => {
      console.log(
        `%c<< API Response: ${response.status} ${response.config.url}`,
        'color: #28a745; font-weight: bold;',
        response.data
      );
      return response;
    },
    (error: AxiosError) => {
      console.error(
        `%c<< API Error: ${error.response?.status} ${error.config?.url}`,
        'color: #dc3545; font-weight: bold;',
        error.response?.data
      );
      return Promise.reject(error);
    }
  );
}


export default api;

