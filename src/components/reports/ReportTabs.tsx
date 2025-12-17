'use client';

import { useAuth } from '@/hooks/useAuth';

interface ReportTabsProps {
  activeTab: 'stock' | 'movement' | 'inventory' | 'audit';
  onTabChange: (tab: 'stock' | 'movement' | 'inventory' | 'audit') => void;
}

export function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const { user } = useAuth();

  const baseTabs = [
    { id: 'stock', label: '📊 Laporan Stok' },
    { id: 'movement', label: '📈 Laporan Pergerakan' },
    { id: 'inventory', label: '💰 Laporan Nilai Inventory' },
  ];

  const tabs =
    user?.role === 'superadmin'
      ? [...baseTabs, { id: 'audit', label: '🔍 Audit Log' }]
      : baseTabs;

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
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
