'use client';

import { useUserDetail, deleteUser, resetUserPassword } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { user, isLoading, refresh } = useUserDetail(userId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    setIsDeleting(true);
    try {
      await deleteUser(userId);
      router.push('/users');
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Gagal menghapus user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!confirm('Kirim email reset password ke user?')) return;

    setIsResettingPassword(true);
    try {
      await resetUserPassword(userId);
      alert('Email reset password telah dikirim');
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Gagal mengirim email reset password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (currentUser?.role !== 'superadmin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User tidak ditemukan</p>
        <Link href="/users" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Kembali ke daftar user
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
        <p className="text-gray-600 mt-2">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Informasi User</h2>
          
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <p className="text-gray-900 font-medium">{user.username}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <p className={`font-medium px-3 py-1 rounded-full text-xs inline-block ${
              user.role === 'superadmin' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user.role}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <p className={`font-medium px-3 py-1 rounded-full text-xs inline-block ${
              user.is_active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {user.is_active ? 'Aktif' : 'Nonaktif'}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Dibuat</label>
            <p className="text-gray-900 font-medium">
              {new Date(user.created_at).toLocaleString('id-ID')}
            </p>
          </div>

          {user.last_login && (
            <div>
              <label className="text-sm text-gray-600">Terakhir Login</label>
              <p className="text-gray-900 font-medium">
                {new Date(user.last_login).toLocaleString('id-ID')}
              </p>
            </div>
          )}
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Aksi</h2>

          <Link
            href={`/users/${userId}/edit`}
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
          >
            Edit User
          </Link>

          <button
            onClick={handleResetPassword}
            disabled={isResettingPassword}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-medium"
          >
            {isResettingPassword ? 'Mengirim...' : 'Reset Password'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus User'}
          </button>

          <Link
            href="/users"
            className="block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 text-center font-medium"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
