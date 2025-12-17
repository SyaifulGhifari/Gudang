'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useProducts, useProductMutation } from '@/hooks/useProducts';
import { usePaginationState } from '@/hooks/usePagination';
import { useNotification } from '@/hooks/useNotification';
import { MOCK_PRODUCTS } from '@/data/mockData';
import { ProductSearchBar } from '@/components/products/ProductSearchBar';
import { ProductFilterPanel } from '@/components/products/ProductFilterPanel';
import { ProductTable } from '@/components/products/ProductTable';
import { Pagination } from '@/components/products/Pagination';

/**
 * Product List Page - /products
 */
export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const pagination = usePaginationState(1, 20);
  const { products, isLoading, error, refresh } = useProducts({
    page: pagination.page,
    limit: pagination.limit,
    search,
    category: selectedCategory,
    status: selectedStatus,
  });
  const { archiveProduct } = useProductMutation();
  const { success, error: showError } = useNotification();

  // Get unique categories dari data
  const categories = useMemo(() => {
    return Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));
  }, []);

  // Update total saat data berubah
  useMemo(() => {
    if (pagination.total !== products.length) {
      pagination.setTotal(products.length || 0);
    }
  }, [products]);

  const handleArchive = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin mengarsipkan produk ini?')) return;

    try {
      await archiveProduct(productId);
      success('Produk berhasil diarsipkan');
      refresh();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedStatus('');
    pagination.goToPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Produk</h1>
          <p className="mt-1 text-gray-500">Kelola semua produk gudang Anda</p>
        </div>
        <Link
          href="/products/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <ProductSearchBar onSearch={setSearch} />
        </div>
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <ProductFilterPanel
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ProductTable
          products={products}
          onArchive={handleArchive}
          isLoading={isLoading}
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        onLimitChange={pagination.setPageSize}
        limit={pagination.limit}
      />
    </div>
  );
}
