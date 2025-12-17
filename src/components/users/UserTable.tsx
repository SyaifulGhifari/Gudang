'use client';

import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
import { useState } from 'react';

interface UserTableProps {
  page?: number;
  limit?: number;
}

export function UserTable({ page = 1, limit = 20 }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(page);
  const [filters, setFilters] = useState({ role: '', search: '' });
  const { users, pagination, isLoading } = useUsers(currentPage, limit, filters);

  const getRoleBadge = (role: string) => {
    if (role === 'superadmin') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            id="role-filter"
            value={filters.role}
            onChange={(e) => {
              setFilters({ ...filters, role: e.target.value });
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            aria-label="Filter berdasarkan role pengguna"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            id="search-filter"
            type="text"
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setCurrentPage(1);
            }}
            placeholder="Username atau email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            aria-label="Cari pengguna berdasarkan username atau email"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Daftar pengguna sistem">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700" scope="col">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700" scope="col">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700" scope="col">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700" scope="col">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700" scope="col">Dibuat</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700" scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                  </td>
                </tr>
              ) : users && users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`} role="status" aria-label={`Role: ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.is_active)}`} role="status" aria-label={`Status: ${user.is_active ? 'Aktif' : 'Nonaktif'}`}>
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <Link
                        href={`/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        aria-label={`Lihat detail pengguna ${user.username}`}
                      >
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600" role="status" aria-live="polite">
            Menampilkan {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, pagination.total)} dari {pagination.total} user
          </p>
          <div className="space-x-2" role="group" aria-label="Navigasi halaman">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
              aria-label="Halaman sebelumnya"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= pagination.pages}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
              aria-label="Halaman berikutnya"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
