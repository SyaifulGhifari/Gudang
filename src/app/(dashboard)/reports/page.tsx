'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  ReportTabs,
  StockReportTab,
  MovementReportTab,
  InventoryValueReportTab,
} from '@/components/reports';
import { AuditLogsTab } from '@/components/reports/AuditLogsTab';

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stock' | 'movement' | 'inventory' | 'audit'>('stock');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Monitor inventory trends, movements, and financial metrics</p>
      </div>

      {/* Reports Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'stock' && <StockReportTab />}
          {activeTab === 'movement' && <MovementReportTab />}
          {activeTab === 'inventory' && <InventoryValueReportTab />}
          {activeTab === 'audit' && user?.role === 'superadmin' && <AuditLogsTab />}
        </div>
      </div>
    </div>
  );
}
