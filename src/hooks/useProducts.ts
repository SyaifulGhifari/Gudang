import useSWR from 'swr';
import { mockProductAPI } from '@/lib/mock-api';

const useMockAPI = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

/**
 * Hook untuk fetch products dengan SWR
 * Handles caching, deduping, dan manual refresh
 */
export function useProducts(filters: ProductFilters = {}) {
  const { page = 1, limit = 20, search = '', category = '', status = '' } = filters;

  const { data, error, isLoading, mutate } = useSWR(
    ['/v1/products', page, limit, search, category, status],
    async () => {
      if (useMockAPI) {
        const response = await mockProductAPI.getAll({
          page,
          limit,
          search,
          category: category || undefined,
          status: status || undefined,
        });
        if (!response.success) {
          throw new Error(response.error || 'Gagal memuat produk');
        }
        return response.data;
      }
      // TODO: Integrate real API
      throw new Error('Real API not implemented');
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error: error?.message,
    refresh: () => mutate(),
    isEmpty: !isLoading && data?.data?.length === 0,
  };
}

/**
 * Hook untuk fetch single product by ID
 */
export function useProductDetail(productId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    productId ? ['/v1/products', productId] : null,
    async () => {
      if (!productId) return null;
      if (useMockAPI) {
        const response = await mockProductAPI.getById(productId);
        if (!response.success) {
          throw new Error(response.error || 'Produk tidak ditemukan');
        }
        return response.data;
      }
      throw new Error('Real API not implemented');
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    product: data || null,
    isLoading,
    error: error?.message,
    refresh: () => mutate(),
  };
}

/**
 * Hook untuk create/update product
 */
export function useProductMutation() {
  return {
    createProduct: async (data: any) => {
      if (useMockAPI) {
        const response = await mockProductAPI.create(data);
        if (!response.success) {
          throw new Error(response.error || 'Gagal membuat produk');
        }
        return response.data;
      }
      throw new Error('Real API not implemented');
    },
    updateProduct: async (productId: string, data: any) => {
      if (useMockAPI) {
        const response = await mockProductAPI.update(productId, data);
        if (!response.success) {
          throw new Error(response.error || 'Gagal mengupdate produk');
        }
        return response.data;
      }
      throw new Error('Real API not implemented');
    },
    archiveProduct: async (productId: string) => {
      if (useMockAPI) {
        const response = await mockProductAPI.archive(productId);
        if (!response.success) {
          throw new Error(response.error || 'Gagal mengarsipkan produk');
        }
        return response.data;
      }
      throw new Error('Real API not implemented');
    },
  };
}
