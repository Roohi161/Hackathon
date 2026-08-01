import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const rawTokens = localStorage.getItem('hc_auth_tokens');
      if (rawTokens) {
        const tokens = JSON.parse(rawTokens);
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
      }
    } catch {
      // Ignore token parse error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap API Response & Handle 401
apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps response in { success: true, data: ..., timestamp: ... }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 if refresh fails or unauthenticated
      localStorage.removeItem('hc_auth_user');
      localStorage.removeItem('hc_auth_tokens');
      localStorage.removeItem('hc_auth_role');
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
