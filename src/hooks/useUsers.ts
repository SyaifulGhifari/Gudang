'use client';

import useSWR from 'swr';
import apiClient from '@/lib/api-client';
import { MOCK_USERS } from '@/data/mockData';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useUsers(page: number = 1, limit: number = 20, filters: any = {}) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (filters.role) params.append('role', filters.role);
  if (filters.search) params.append('search', filters.search);

  const url = `/v1/users?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(
    url,
    async () => {
      await delay(500);
      let filtered = [...MOCK_USERS];
      
      if (filters.role) {
        filtered = filtered.filter(u => u.role === filters.role);
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(u => 
          u.username.toLowerCase().includes(search) || 
          u.email.toLowerCase().includes(search)
        );
      }

      const total = filtered.length;
      const start = (page - 1) * limit;
      const paginatedData = filtered.slice(start, start + limit);

      return {
        data: {
          data: paginatedData,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      };
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    users: data?.data?.data || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

export function useUserDetail(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/v1/users/${userId}`,
    async () => {
      await delay(300);
      const user = MOCK_USERS.find(u => u.id === userId);
      return { data: user };
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    user: data?.data,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

export async function createUser(data: any) {
  // Mock: add to MOCK_USERS
  const newUser: any = {
    id: `user-${Date.now()}`,
    ...data,
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: null,
  };
  MOCK_USERS.push(newUser);
  await delay(500);
  return { data: newUser };
}

export async function updateUser(userId: string, data: any) {
  // Mock: update in MOCK_USERS
  const user = MOCK_USERS.find(u => u.id === userId);
  if (user) {
    Object.assign(user, data);
  }
  await delay(500);
  return { data: user };
}

export async function deleteUser(userId: string) {
  // Mock: remove from MOCK_USERS
  const index = MOCK_USERS.findIndex(u => u.id === userId);
  if (index > -1) {
    MOCK_USERS.splice(index, 1);
  }
  await delay(500);
  return { data: { success: true } };
}

export async function resetUserPassword(userId: string) {
  // Mock: simulate password reset
  await delay(500);
  return { data: { message: 'Password reset email sent' } };
}
