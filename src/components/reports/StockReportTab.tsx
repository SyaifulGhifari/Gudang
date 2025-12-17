'use client';

import { useState } from 'react';
import { useStockReport } from '@/hooks/useReports';
import { ReportCard } from './ReportCard';
import { ReportTable } from './ReportTable';

export function StockReportTab() {
  const [filters, setFilters] = useState({ category: '', status: '' });
  const { report, isLoading, refresh } = useStockReport(filters);

  const handleExport = () => {
    const csv = [
      ['SKU', 'Nama Produk', 'Kategori', 'Stok Saat Ini', 'Min Stok', 'Status'].join(','),
      ...(report?.products || []).map((p: any) =>
        [p.sku, p.name, p.category, p.current_stock, p.min_stock, p.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportCard
          title="Total Produk"
          value={report?.summary?.total_products || 0}
          icon="📦"
          color="blue"
        />
        <ReportCard
          title="Total Stok"
          value={report?.summary?.total_stock_items || 0}
          icon="📦"
          color="green"
        />
        <ReportCard
          title="Produk Stok Rendah"
          value={report?.summary?.low_stock_count || 0}
          icon="⚠️"
          color="orange"
        />
        <ReportCard
          title="Produk Habis"
          value={report?.summary?.out_of_stock_count || 0}
          icon="❌"
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Semua Kategori</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Cables">Cables</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Semua Status</option>
              <option value="available">Available</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
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
        <h3 className="text-lg font-semibold mb-4">Detail Stok Produk</h3>
        <ReportTable
          columns={[
            { key: 'sku', label: 'SKU' },
            { key: 'name', label: 'Nama Produk' },
            { key: 'category', label: 'Kategori' },
            { key: 'current_stock', label: 'Stok Saat Ini', align: 'right' },
            { key: 'min_stock', label: 'Min Stok', align: 'right' },
            { key: 'status', label: 'Status' },
          ]}
          data={report?.products || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
