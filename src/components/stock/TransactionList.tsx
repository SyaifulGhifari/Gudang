'use client';

import { StockTransaction } from '@/data/mockData';

interface TransactionListProps {
  transactions: StockTransaction[];
  isLoading?: boolean;
}

const TYPE_COLORS: Record<'in' | 'out' | 'adjustment', { bg: string; text: string; label: string }> = {
  in: { bg: 'bg-green-100', text: 'text-green-800', label: 'Barang Masuk' },
  out: { bg: 'bg-red-100', text: 'text-red-800', label: 'Barang Keluar' },
  adjustment: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Penyesuaian' },
};

export function TransactionList({ transactions, isLoading = false }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map(transaction => {
        const typeConfig = TYPE_COLORS[transaction.type];
        const sign = transaction.type === 'out' ? '-' : '+';

        return (
          <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${typeConfig.bg} ${typeConfig.text}`}>
                    {typeConfig.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {transaction.reference && (
                  <p className="text-sm text-gray-600 mb-1">
                    Referensi: <span className="font-medium">{transaction.reference}</span>
                  </p>
                )}
                {transaction.notes && (
                  <p className="text-sm text-gray-600">
                    {transaction.notes}
                  </p>
                )}
                {transaction.reason && (
                  <p className="text-xs text-gray-500 mt-1">
                    Alasan: {transaction.reason}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${transaction.type === 'out' ? 'text-red-600' : 'text-green-600'}`}>
                  {sign}{transaction.quantity}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
