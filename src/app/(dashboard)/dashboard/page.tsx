'use client';

import { useAuth } from '@/hooks/useAuth';
import { MOCK_DASHBOARD_SUMMARY, MOCK_PRODUCTS } from '@/data/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const dashboardData = MOCK_DASHBOARD_SUMMARY;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang, <span className="font-semibold">{user?.username}</span>!{' '}
          <span className="text-sm text-gray-500">(Role: {user?.role})</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Produk</h3>
              <p className="text-3xl font-bold mt-2 text-gray-900">{dashboardData.total_products}</p>
            </div>
            <svg className="w-12 h-12 text-blue-500 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11a2 2 0 012-2z" />
            </svg>
          </div>
          <Link href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
            Lihat produk →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Stok (Item)</h3>
              <p className="text-3xl font-bold mt-2 text-gray-900">{dashboardData.total_stock_items}</p>
            </div>
            <svg className="w-12 h-12 text-green-500 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Nilai Inventory</h3>
              <p className="text-lg font-bold mt-2 text-gray-900">{formatCurrency(dashboardData.total_stock_value)}</p>
            </div>
            <svg className="w-12 h-12 text-purple-500 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Stok Kritis</h3>
              <p className="text-3xl font-bold mt-2">
                <span className="text-red-600">{dashboardData.low_stock_count + dashboardData.out_of_stock_count}</span>
              </p>
            </div>
            <svg className="w-12 h-12 text-red-500 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m6-2a2 2 0 11-4 0 2 2 0 014 0zM7 20a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          {dashboardData.low_stock_count + dashboardData.out_of_stock_count > 0 && (
            <Link href="/products" className="mt-4 inline-block text-red-600 hover:text-red-800 text-sm font-medium">
              Lihat produk →
            </Link>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {dashboardData.low_stock_products.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ Produk Dengan Stok Kritis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.low_stock_products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white p-4 rounded-lg border border-yellow-300 hover:border-yellow-500 transition"
              >
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.sku}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    product.status === 'out-of-stock' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status === 'out-of-stock' ? 'Habis' : 'Rendah'}
                  </span>
                  <span className="font-semibold text-gray-900">{product.current_stock}/{product.min_stock}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/products/create"
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </Link>
        <Link
          href="/stock"
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Barang Masuk
        </Link>
        <Link
          href="/stock"
          className="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-center font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          Barang Keluar
        </Link>
        <Link
          href="/stock"
          className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-center font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Penyesuaian Stok
        </Link>
      </div>
    </div>
  );
}
