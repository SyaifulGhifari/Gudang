'use client';

import { useState } from 'react';
import { useInventoryValueReport } from '@/hooks/useReports';
import { ReportCard } from './ReportCard';
import { ReportTable } from './ReportTable';

export function InventoryValueReportTab() {
  const [filters, setFilters] = useState({ category: '' });
  const { report, isLoading, refresh } = useInventoryValueReport(filters);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = () => {
    const csv = [
      ['SKU', 'Nama Produk', 'Kategori', 'Stok', 'Harga Satuan', 'Nilai Total'].join(','),
      ...(report?.products || []).map((p: any) =>
        [p.sku, p.name, p.category, p.current_stock, p.price, p.total_value].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-value-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportCard
          title="Total Nilai Inventory"
          value={formatCurrency(report?.summary?.total_value || 0)}
          icon="💰"
          color="purple"
        />
        <ReportCard
          title="Total Produk"
          value={report?.summary?.total_products || 0}
          icon="📦"
          color="blue"
        />
        <ReportCard
          title="Rata-rata Nilai per Produk"
          value={formatCurrency(report?.summary?.average_value || 0)}
          icon="📊"
          color="green"
        />
      </div>

      {/* Value by Category */}
      {report?.category_breakdown && report.category_breakdown.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Nilai Inventory per Kategori</h3>
          <ReportTable
            columns={[
              { key: 'category', label: 'Kategori' },
              { key: 'total_products', label: 'Jumlah Produk', align: 'right' },
              { key: 'total_stock', label: 'Total Stok', align: 'right' },
              { key: 'total_value', label: 'Nilai Total', align: 'right' },
            ]}
            data={report.category_breakdown.map((c: any) => ({
              category: c.category,
              total_products: c.total_products,
              total_stock: c.total_stock,
              total_value: formatCurrency(c.total_value),
            }))}
            isLoading={false}
          />
        </div>
      )}

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
        <h3 className="text-lg font-semibold mb-4">Detail Nilai per Produk</h3>
        <ReportTable
          columns={[
            { key: 'sku', label: 'SKU' },
            { key: 'name', label: 'Nama Produk' },
            { key: 'category', label: 'Kategori' },
            { key: 'current_stock', label: 'Stok', align: 'right' },
            { key: 'price', label: 'Harga Satuan', align: 'right' },
            { key: 'total_value', label: 'Nilai Total', align: 'right' },
          ]}
          data={(report?.products || []).map((p: any) => ({
            ...p,
            price: formatCurrency(p.price),
            total_value: formatCurrency(p.total_value),
          }))}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
