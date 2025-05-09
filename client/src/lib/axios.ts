import axios from 'axios';

export const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
      },
})
// Request interceptor (optional: add token if needed)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles token expiration)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and request wasn't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Request new access token
        const { data } = await axios.post(
          'http://localhost:8000/auth/refresh-token',
          { refreshToken },
          { withCredentials: true }
        );

        // Save new tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/sign-in'; // or navigate in app
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);
export default API;