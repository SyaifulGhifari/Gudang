'use client';

import { useNotificationStore } from '@/stores/notificationStore';

export function useNotification() {
  const { addNotification } = useNotificationStore();

  return {
    success: (message: string) =>
      addNotification({
        message,
        type: 'success',
        duration: 3000,
      }),
    error: (message: string) =>
      addNotification({
        message,
        type: 'error',
        duration: 5000,
      }),
    warning: (message: string) =>
      addNotification({
        message,
        type: 'warning',
        duration: 4000,
      }),
    info: (message: string) =>
      addNotification({
        message,
        type: 'info',
        duration: 3000,
      }),
  };
}
