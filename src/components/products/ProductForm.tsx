'use client';

import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, editProductSchema, CreateProductInput, EditProductInput } from '@/schemas/product.schema';
import { Product } from '@/data/mockData';
import { useNotification } from '@/hooks/useNotification';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

interface ProductFormProps {
  initialData?: Product;
  isLoading?: boolean;
  onSubmit: (data: CreateProductInput | EditProductInput) => Promise<void>;
  categories?: string[];
}

const PRODUCT_UNITS = ['pcs', 'box', 'kg', 'liter', 'meter', 'pack'];
const DEFAULT_CATEGORIES = ['Electronics', 'Accessories', 'Cables', 'Software', 'Hardware', 'Other'];

/**
 * Form component untuk create dan edit produk
 */
export function ProductForm({
  initialData,
  isLoading = false,
  onSubmit,
  categories = DEFAULT_CATEGORIES,
}: ProductFormProps) {
  const isEdit = !!initialData;
  const { success, error: showError } = useNotification();
  const router = useRouter();

  const schema = isEdit ? editProductSchema : createProductSchema;
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          description: initialData.description || '',
          price: initialData.price,
          min_stock: initialData.min_stock,
          unit: initialData.unit,
          ...(isEdit ? {} : { sku: '' as any }),
        }
      : {},
  });

  const priceValue = watch('price') as number | undefined;

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      success(`Produk berhasil ${isEdit ? 'diperbarui' : 'dibuat'}`);
      router.push(isEdit ? `/products/${initialData?.id}` : '/products');
    } catch (err: any) {
      showError(err.message || `Gagal ${isEdit ? 'mengupdate' : 'membuat'} produk`);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* SKU */}
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: LAPTOP-HP-001"
            {...register('sku' as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {(errors as any).sku && <p className="mt-1 text-sm text-red-500">{(errors as any).sku.message}</p>}
        </div>
      )}

      {/* Nama Produk */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Masukkan nama produk"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Pilih kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          placeholder="Masukkan deskripsi produk (opsional)"
          rows={3}
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* Harga */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Harga Satuan <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
          <input
            type="number"
            placeholder="0"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
        {priceValue && (
          <p className="mt-2 text-sm text-gray-600">
            Format: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(priceValue)}
          </p>
        )}
      </div>

      {/* Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unit <span className="text-red-500">*</span>
        </label>
        <select
          {...register('unit')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Pilih unit</option>
          {PRODUCT_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        {errors.unit && <p className="mt-1 text-sm text-red-500">{errors.unit.message}</p>}
      </div>

      {/* Minimum Stok */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Stok <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="Contoh: 10"
          {...register('min_stock', { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.min_stock && <p className="mt-1 text-sm text-red-500">{errors.min_stock.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting || isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui Produk' : 'Buat Produk'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
