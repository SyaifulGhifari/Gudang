'use client';

interface ProductFilterPanelProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  selectedCategory?: string;
  selectedStatus?: string;
}

/**
 * Filter panel untuk produk berdasarkan kategori dan status stok
 */
export function ProductFilterPanel({
  categories,
  onCategoryChange,
  onStatusChange,
  selectedCategory = '',
  selectedStatus = '',
}: ProductFilterPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status Stok
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Status</option>
          <option value="available">Tersedia</option>
          <option value="low-stock">Stok Rendah</option>
          <option value="out-of-stock">Stok Habis</option>
        </select>
      </div>
    </div>
  );
}
