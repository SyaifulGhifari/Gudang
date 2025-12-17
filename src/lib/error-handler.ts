import { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
  type: 'validation' | 'auth' | 'permission' | 'not_found' | 'conflict' | 'error';
  details?: Record<string, string[]>;
}

export function handleApiError(error: AxiosError): ErrorResponse {
  const status = error.response?.status;
  const data = error.response?.data as any;

  switch (status) {
    case 400:
      return {
        message: data.error?.message || 'Request tidak valid',
        type: 'validation',
      };
    case 401:
      return {
        message: 'Username atau password salah',
        type: 'auth',
      };
    case 403:
      return {
        message: 'Anda tidak memiliki akses',
        type: 'permission',
      };
    case 404:
      return {
        message: 'Data tidak ditemukan',
        type: 'not_found',
      };
    case 409:
      return {
        message: data.error?.message || 'Data sudah ada',
        type: 'conflict',
      };
    case 422:
      return {
        message: 'Validation error',
        type: 'validation',
        details: data.error?.details,
      };
    default:
      return {
        message: error.message || 'Terjadi kesalahan pada server',
        type: 'error',
      };
  }
}
