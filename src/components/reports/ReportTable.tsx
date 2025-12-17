'use client';

interface ReportTableProps {
  columns: Array<{ key: string; label: string; align?: 'left' | 'center' | 'right' }>;
  data: Array<Record<string, any>>;
  isLoading?: boolean;
}

export function ReportTable({ columns, data, isLoading = false }: ReportTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tidak ada data</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 text-sm font-semibold text-gray-700 text-${col.align || 'left'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
              {columns.map(col => (
                <td
                  key={`${idx}-${col.key}`}
                  className={`px-4 py-3 text-sm text-gray-900 text-${col.align || 'left'}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
