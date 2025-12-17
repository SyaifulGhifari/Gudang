'use client';

export function StockTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: 'in' | 'out' | 'adjustment' | 'history';
  onTabChange: (tab: 'in' | 'out' | 'adjustment' | 'history') => void;
}) {
  const tabs = [
    { id: 'in', label: '📥 Barang Masuk', color: 'text-green-600' },
    { id: 'out', label: '📤 Barang Keluar', color: 'text-red-600' },
    { id: 'adjustment', label: '⚙️ Penyesuaian Stok', color: 'text-orange-600' },
    { id: 'history', label: '📋 History Transaksi', color: 'text-blue-600' },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? `border-b-2 border-blue-600 ${tab.color} bg-blue-50`
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
