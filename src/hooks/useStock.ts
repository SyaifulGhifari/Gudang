'use client';

import useSWR from 'swr';
import { useCallback, useState } from 'react';
import apiClient from '@/lib/api-client';
import { InTransactionInput, OutTransactionInput, AdjustmentInput } from '@/schemas/stock.schema';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

/**
 * Hook untuk fetch stock transactions
 */
export function useStockTransactions(type?: 'in' | 'out' | 'adjustment', page: number = 1, limit: number = 20) {
  const url = `/v1/stock/transactions?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    transactions: data?.data?.data || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

/**
 * Hook untuk fetch stock history per produk
 */
export function useStockHistory(productId: string, page: number = 1, limit: number = 20) {
  const url = productId ? `/v1/stock/history/${productId}?page=${page}&limit=${limit}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    history: data?.data?.data || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

/**
 * Hook untuk pagination state
 */
export function usePagination(defaultPage = 1, defaultLimit = 20) {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);

  const prevPage = () => setPage(p => Math.max(1, p - 1));
  const nextPage = (totalPages: number) => setPage(p => Math.min(totalPages, p + 1));

  return {
    page,
    limit,
    setPage,
    setLimit,
    prevPage,
    nextPage,
  };
}

/**
 * Hook untuk record barang masuk, keluar, dan penyesuaian stok
 */
export function useStockMutation() {
  const recordIn = useCallback(async (data: InTransactionInput) => {
    const response = await apiClient.post('/v1/stock/in', data);
    return response.data;
  }, []);

  const recordOut = useCallback(async (data: OutTransactionInput) => {
    const response = await apiClient.post('/v1/stock/out', data);
    return response.data;
  }, []);

  const recordAdjustment = useCallback(async (data: AdjustmentInput) => {
    const response = await apiClient.post('/v1/stock/adjustment', data);
    return response.data;
  }, []);

  return {
    recordIn,
    recordOut,
    recordAdjustment,
  };
}
