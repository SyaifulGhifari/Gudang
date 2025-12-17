'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inTransactionSchema, InTransactionInput } from '@/schemas/stock.schema';
import { useNotification } from '@/hooks/useNotification';
import { useProducts } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { useStockMutation } from '@/hooks/useStock';

interface InTransactionFormProps {
  onSuccess?: () => void;
}

export function InTransactionForm({ onSuccess }: InTransactionFormProps) {
  const { success, error: showError } = useNotification();
  const router = useRouter();
  const { products } = useProducts();
  const { recordIn } = useStockMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<InTransactionInput>({
    resolver: zodResolver(inTransactionSchema),
    defaultValues: {
      transaction_date: new Date(),
    },
  });

  const selectedProductId = watch('product_id');
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const onSubmitHandler = async (data: InTransactionInput) => {
    try {
      await recordIn(data);
      success('Barang masuk berhasil dicatat');
      reset();
      onSuccess?.();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Gagal mencatat barang masuk');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Produk */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Produk <span className="text-red-500">*</span>
        </label>
        <select
          {...register('product_id')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Produk --</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.sku} - {product.name}
            </option>
          ))}
        </select>
        {(errors as any).product_id && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).product_id.message}</p>
        )}
        {selectedProduct && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-gray-600">
              Stok Saat Ini: <span className="font-semibold text-blue-700">{selectedProduct.current_stock} {selectedProduct.unit}</span>
            </p>
          </div>
        )}
      </div>

      {/* Jumlah */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jumlah <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="0"
            {...register('quantity', { valueAsNumber: true })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedProduct && <span className="text-gray-600">{selectedProduct.unit}</span>}
        </div>
        {(errors as any).quantity && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).quantity.message}</p>
        )}
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          {...register('transaction_date', {
            valueAsDate: true,
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(errors as any).transaction_date && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).transaction_date.message}</p>
        )}
      </div>

      {/* Referensi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referensi (PO, Invoice, dll)
        </label>
        <input
          type="text"
          placeholder="Contoh: PO-2025-001"
          {...register('reference')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(errors as any).reference && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).reference.message}</p>
        )}
      </div>

      {/* Catatan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan
        </label>
        <textarea
          placeholder="Catatan tambahan (optional)"
          rows={3}
          {...register('notes')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(errors as any).notes && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).notes.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Barang Masuk'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
