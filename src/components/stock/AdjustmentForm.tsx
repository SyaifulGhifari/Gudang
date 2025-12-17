'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adjustmentSchema, AdjustmentInput } from '@/schemas/stock.schema';
import { useNotification } from '@/hooks/useNotification';
import { useProducts } from '@/hooks/useProducts';
import { useStockMutation } from '@/hooks/useStock';

interface AdjustmentFormProps {
  onSuccess?: () => void;
}

const ADJUSTMENT_REASONS = [
  { value: 'stock_opname', label: 'Stock Opname' },
  { value: 'kerusakan', label: 'Kerusakan' },
  { value: 'kadaluarsa', label: 'Kadaluarsa' },
  { value: 'selisih_fisik', label: 'Selisih Fisik' },
  { value: 'koreksi_sistem', label: 'Koreksi Sistem' },
  { value: 'lainnya', label: 'Lainnya' },
];

export function AdjustmentForm({ onSuccess }: AdjustmentFormProps) {
  const { success, error: showError } = useNotification();
  const { products } = useProducts();
  const { recordAdjustment } = useStockMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AdjustmentInput>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      transaction_date: new Date(),
    },
  });

  const selectedProductId = watch('product_id');
  const quantity = watch('quantity');
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const newStock = selectedProduct ? selectedProduct.current_stock + (quantity || 0) : 0;
  const willBeNegative = newStock < 0;

  const onSubmitHandler = async (data: AdjustmentInput) => {
    try {
      await recordAdjustment(data);
      success('Penyesuaian stok berhasil dicatat');
      reset();
      onSuccess?.();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Gagal mencatat penyesuaian stok');
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

      {/* Alasan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alasan Penyesuaian <span className="text-red-500">*</span>
        </label>
        <select
          {...register('reason')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Alasan --</option>
          {ADJUSTMENT_REASONS.map(reason => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
        {(errors as any).reason && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).reason.message}</p>
        )}
      </div>

      {/* Jumlah Penyesuaian */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jumlah Penyesuaian <span className="text-red-500">*</span>
          <span className="text-xs font-normal text-gray-500"> (positif/negatif)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Contoh: +5 atau -3"
            {...register('quantity', { valueAsNumber: true })}
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              willBeNegative ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {selectedProduct && <span className="text-gray-600">{selectedProduct.unit}</span>}
        </div>
        {(errors as any).quantity && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).quantity.message}</p>
        )}
        {selectedProduct && quantity !== undefined && (
          <p className={`mt-2 text-sm font-medium ${willBeNegative ? 'text-red-600' : 'text-green-600'}`}>
            Stok Baru: {newStock} {selectedProduct.unit}
            {willBeNegative && ' ⚠️ (Negatif!)'}
          </p>
        )}
      </div>

      {/* Catatan (Required) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan Penyesuaian <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Jelaskan detail alasan penyesuaian (min 10 karakter)"
          rows={3}
          {...register('notes')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(errors as any).notes && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).notes.message}</p>
        )}
      </div>

      {/* Referensi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referensi Dokumen
        </label>
        <input
          type="text"
          placeholder="Contoh: SO-2025-001, Invoice #123"
          {...register('reference')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(errors as any).reference && (
          <p className="mt-1 text-sm text-red-500">{(errors as any).reference.message}</p>
        )}
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Penyesuaian <span className="text-red-500">*</span>
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

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || willBeNegative}
          className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Penyesuaian'}
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
