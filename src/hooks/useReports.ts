'use client';

import useSWR from 'swr';
import apiClient from '@/lib/api-client';
import { MOCK_AUDIT_LOGS } from '@/data/mockData';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useStockReport(filters: any = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);

  const url = `/v1/reports/stock?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  return {
    report: data?.data || null,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

export function useMovementReport(filters: any = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);

  const url = `/v1/reports/movement?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  return {
    report: data?.data || null,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

export function useInventoryValueReport(filters: any = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);

  const url = `/v1/reports/inventory-value?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  return {
    report: data?.data || null,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

export function useAuditLogs(filters: any = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    `/v1/audit-logs`,
    async () => {
      await delay(500);
      let filtered = [...MOCK_AUDIT_LOGS];

      if (filters.action) {
        filtered = filtered.filter(log => log.action === filters.action);
      }

      if (filters.user) {
        const userMap: any = {
          'user-001': 'admin',
          'user-002': 'superadmin',
          'user-003': 'admin2',
        };
        filtered = filtered.filter(log => 
          userMap[log.user_id]?.toLowerCase().includes(filters.user.toLowerCase())
        );
      }

      if (filters.startDate) {
        const startDate = new Date(filters.startDate).getTime();
        filtered = filtered.filter(log => new Date(log.created_at).getTime() >= startDate);
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate).getTime();
        filtered = filtered.filter(log => new Date(log.created_at).getTime() <= endDate);
      }

      return { data: filtered };
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000,
    }
  );

  return {
    logs: data?.data || [],
    isLoading,
    error,
    refresh: () => mutate(),
  };
}
