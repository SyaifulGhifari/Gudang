'use client';

import { useState } from 'react';
import { StockTabs, InTransactionForm, OutTransactionForm, AdjustmentForm, TransactionList } from '@/components/stock';
import { useStockTransactions } from '@/hooks/useStock';

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<'in' | 'out' | 'adjustment' | 'history'>('in');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { transactions, isLoading } = useStockTransactions(undefined, 1, 10);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Stok</h1>
        <p className="text-gray-600 mt-1">Catat semua perubahan stok produk Anda</p>
      </div>

      {/* Tabs */}
      <StockTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {activeTab === 'in' && <InTransactionForm onSuccess={handleSuccess} />}
            {activeTab === 'out' && <OutTransactionForm onSuccess={handleSuccess} />}
            {activeTab === 'adjustment' && <AdjustmentForm onSuccess={handleSuccess} />}
            {activeTab === 'history' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Lihat history di tab "History Transaksi"</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaksi Terbaru</h2>
          <TransactionList transactions={transactions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
