'use client';

import { useState } from 'react';
import { useMovementReport } from '@/hooks/useReports';
import { ReportCard } from './ReportCard';
import { ReportTable } from './ReportTable';

export function MovementReportTab() {
  const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '' });
  const { report, isLoading, refresh } = useMovementReport(filters);

  const handleExport = () => {
    const csv = [
      ['Tanggal', 'Produk', 'Tipe', 'Jumlah', 'Referensi', 'Catatan'].join(','),
      ...(report?.transactions || []).map((t: any) =>
        [t.date, t.product_name, t.type, t.quantity, t.reference, t.notes].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movement-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportCard
          title="Total Barang Masuk"
          value={report?.summary?.total_in || 0}
          icon="📥"
          color="green"
        />
        <ReportCard
          title="Total Barang Keluar"
          value={report?.summary?.total_out || 0}
          icon="📤"
          color="red"
        />
        <ReportCard
          title="Net Change"
          value={report?.summary?.net_change || 0}
          icon="📊"
          color="blue"
        />
        <ReportCard
          title="Total Transaksi"
          value={report?.summary?.total_transactions || 0}
          icon="📋"
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Semua Tipe</option>
              <option value="in">Barang Masuk</option>
              <option value="out">Barang Keluar</option>
              <option value="adjustment">Penyesuaian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={refresh}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Detail Pergerakan Stok</h3>
        <ReportTable
          columns={[
            { key: 'date', label: 'Tanggal' },
            { key: 'product_name', label: 'Produk' },
            { key: 'type', label: 'Tipe' },
            { key: 'quantity', label: 'Jumlah', align: 'right' },
            { key: 'reference', label: 'Referensi' },
            { key: 'notes', label: 'Catatan' },
          ]}
          data={report?.transactions || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
