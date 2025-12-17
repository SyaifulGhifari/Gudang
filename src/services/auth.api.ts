import apiClient from '@/lib/api-client';
import { LoginRequest, LoginResponse } from '@/types/auth';

export const authAPI = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/v1/auth/login', data),

  refresh: (refreshToken: string) =>
    apiClient.post<{ token: string; expires_in: number }>(
      '/v1/auth/refresh',
      { refresh_token: refreshToken }
    ),

  logout: () =>
    apiClient.post('/v1/auth/logout', {}),

  getCurrentUser: () =>
    apiClient.get('/v1/auth/me'),
};
