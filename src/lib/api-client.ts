import axios, { AxiosError, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request Interceptor - Add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle errors & refresh token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(
          process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!
        );

        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const newToken = response.data.token;
          localStorage.setItem(
            process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!,
            newToken
          );

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
        localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
