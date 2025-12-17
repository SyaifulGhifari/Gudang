'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProductDetail, useProductMutation } from '@/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import { EditProductInput } from '@/schemas/product.schema';
import Link from 'next/link';

/**
 * Edit Product Page - /products/[id]/edit
 */
export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { product, isLoading, error } = useProductDetail(productId);
  const { updateProduct } = useProductMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>)}
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

  const handleSubmit = async (data: EditProductInput) => {
    await updateProduct(productId, data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
        <p className="mt-2 text-gray-600">Perbarui informasi produk</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Catatan:</strong> SKU tidak dapat diubah untuk menjaga integritas data transaksi. 
          Untuk mengubah stok produk, gunakan fitur Manajemen Stok (Barang Masuk/Keluar/Penyesuaian).
        </p>
      </div>
    </div>
  );
}
