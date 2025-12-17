'use client';

import { StockTransaction } from '@/data/mockData';
import { Pagination } from '@/components/products/Pagination';

interface StockHistoryTableProps {
  history: StockTransaction[];
  isLoading?: boolean;
  pagination?: any;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function StockHistoryTable({
  history,
  isLoading = false,
  pagination,
  onPageChange,
  onLimitChange,
}: StockHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Belum ada history transaksi</p>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      in: 'Barang Masuk',
      out: 'Barang Keluar',
      adjustment: 'Penyesuaian',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      in: 'bg-green-100 text-green-800',
      out: 'bg-red-100 text-red-800',
      adjustment: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipe</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Jumlah</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Referensi</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {history.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                    {getTypeLabel(transaction.type)}
                  </span>
                </td>
                <td className={`px-4 py-3 text-sm font-semibold text-right ${
                  transaction.type === 'out' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'out' ? '-' : '+'}{transaction.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {transaction.reference || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span title={transaction.notes}>{transaction.notes?.substring(0, 30)}...</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
