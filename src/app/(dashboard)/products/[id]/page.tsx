'use client';

import { useParams } from 'next/navigation';
import { useProductDetail, useProductMutation } from '@/hooks/useProducts';
import { useNotification } from '@/hooks/useNotification';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_STOCK_TRANSACTIONS } from '@/data/mockData';

/**
 * Product Detail Page - /products/[id]
 */
export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { product, isLoading, error, refresh } = useProductDetail(productId);
  const { archiveProduct } = useProductMutation();
  const { success, error: showError } = useNotification();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">{error || 'Produk tidak ditemukan'}</p>
        <Link href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          ← Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'available': 'Tersedia',
      'low-stock': 'Stok Rendah',
      'out-of-stock': 'Stok Habis',
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const productTransactions = MOCK_STOCK_TRANSACTIONS.filter(t => t.product_id === productId);

  const handleArchive = async () => {
    if (!confirm('Apakah Anda yakin ingin mengarsipkan produk ini? Data transaksi akan tetap tersimpan.')) return;

    try {
      await archiveProduct(productId);
      success('Produk berhasil diarsipkan');
      router.push('/products');
    } catch (err: any) {
      showError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/products" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-1 text-gray-500">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/products/${productId}/edit`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={handleArchive}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-3 4h.01M8 12h.01" />
            </svg>
            Arsip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detail Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Produk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="text-lg font-medium text-gray-900">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit</p>
                <p className="text-lg font-medium text-gray-900">{product.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Harga Satuan</p>
                <p className="text-lg font-medium text-gray-900">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Minimum Stok</p>
                <p className="text-lg font-medium text-gray-900">{product.min_stock}</p>
              </div>
            </div>
            {product.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Deskripsi</p>
                <p className="text-gray-900">{product.description}</p>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Transaksi</h2>
            {productTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada transaksi untuk produk ini</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Tanggal</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Jenis</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-900">Jumlah</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{formatDate(txn.created_at)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            txn.type === 'in' ? 'bg-green-100 text-green-800' :
                            txn.type === 'out' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {txn.type === 'in' ? 'Barang Masuk' : txn.type === 'out' ? 'Barang Keluar' : 'Penyesuaian'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {txn.type === 'in' ? '+' : txn.type === 'out' ? '-' : ''}{txn.quantity}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{txn.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Stock Card */}
        <div className="space-y-6">
          {/* Current Stock */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">Stok Saat Ini</p>
            <div className="text-4xl font-bold text-gray-900 mb-2">{product.current_stock}</div>
            <p className="text-xs text-gray-500 mb-4">{product.unit}</p>
            
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
              {getStatusLabel(product.status)}
            </span>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Minimum Stok</p>
              <p className="text-lg font-semibold text-gray-900">{product.min_stock}</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    product.current_stock <= product.min_stock ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min((product.current_stock / Math.max(product.min_stock, 1)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link
                href={`/stock/in?product_id=${productId}`}
                className="block w-full bg-green-600 text-white text-center py-2 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Barang Masuk
              </Link>
              <Link
                href={`/stock/out?product_id=${productId}`}
                className="block w-full bg-red-600 text-white text-center py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Barang Keluar
              </Link>
              <Link
                href={`/stock/adjustment?product_id=${productId}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Penyesuaian
              </Link>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-2">
            <p>Dibuat: {formatDate(product.created_at)}</p>
            <p>Diperbarui: {formatDate(product.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  );
}
