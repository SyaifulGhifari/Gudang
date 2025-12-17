'use client';

import { Product } from '@/data/mockData';
import Link from 'next/link';

interface ProductTableProps {
  products: Product[];
  onArchive?: (productId: string) => void;
  isLoading?: boolean;
}

/**
 * Table component untuk display daftar produk
 */
export function ProductTable({ products, onArchive, isLoading = false }: ProductTableProps) {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="mt-4 text-gray-500">Tidak ada produk ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table" aria-label="Daftar produk">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">SKU</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Nama Produk</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Kategori</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900" scope="col">Harga</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900" scope="col">Stok</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900" scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-mono text-gray-900">{product.sku}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <Link href={`/products/${product.id}`} className="font-medium text-blue-600 hover:text-blue-800" aria-label={`Lihat detail ${product.name}`}>
                  {product.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(product.price)}</td>
              <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900" aria-label={`Stok ${product.name}: ${product.current_stock}`}>{product.current_stock}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`} role="status" aria-label={`Status: ${getStatusLabel(product.status)}`}>
                  {getStatusLabel(product.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-3">
                  <Link href={`/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium" aria-label={`Edit produk ${product.name}`}>
                    Edit
                  </Link>
                  {onArchive && (
                    <button
                      onClick={() => onArchive(product.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      aria-label={`Arsipkan produk ${product.name}`}
                    >
                      Arsip
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
