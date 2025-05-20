import axios from 'axios';
import { setAccessToken, getAccessToken } from './token';

const API_URL = 'http://localhost:8000';

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
});
// Request interceptor (optional: add token if needed)
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handles token expiration)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and request wasn't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.message === 'Access token expired' && !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const response = await API.post('/auth/refresh', {withCredentials:true});
        const newToken = response.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        window.location.href = '/auth/sign-in';
         setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default API;
