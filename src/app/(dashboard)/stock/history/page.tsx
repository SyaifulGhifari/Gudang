'use client';

import { useState } from 'react';
import { useStockHistory, usePagination } from '@/hooks/useStock';
import { useProducts } from '@/hooks/useProducts';
import { StockHistoryTable } from '@/components/stock';
import Link from 'next/link';

export default function StockHistoryPage() {
  const { products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  const { page, limit, setPage, setLimit } = usePagination(1, 20);
  const { history, pagination, isLoading } = useStockHistory(selectedProductId, page, limit);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">History Transaksi Stok</h1>
          <p className="text-gray-600 mt-1">Lihat semua riwayat perubahan stok per produk</p>
        </div>
        <Link
          href="/stock"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          ← Kembali
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Produk untuk Melihat History
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => {
            setSelectedProductId(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Produk --</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.sku} - {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* History Table */}
      {selectedProductId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {selectedProduct && (
            <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{selectedProduct.name}</span>
                <br />
                SKU: {selectedProduct.sku} | Stok Saat Ini: <span className="font-semibold text-blue-700">{selectedProduct.current_stock}</span>
              </p>
            </div>
          )}
          <StockHistoryTable
            history={history}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      )}

      {!selectedProductId && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Silakan pilih produk untuk melihat history transaksi</p>
        </div>
      )}
    </div>
  );
}
