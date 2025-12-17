'use client';

import { useRouter } from 'next/navigation';
import { useProductMutation } from '@/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import { CreateProductInput } from '@/schemas/product.schema';

/**
 * Create Product Page - /products/create
 */
export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct } = useProductMutation();

  const handleSubmit = async (data: CreateProductInput) => {
    await createProduct(data);
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
        <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
        <p className="mt-2 text-gray-600">Isi formulir di bawah untuk menambahkan produk ke gudang</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
