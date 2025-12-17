'use client';

import Link from 'next/link';
import { UserTable } from '@/components/users';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-600 mt-2">Kelola user dan role akses sistem</p>
        </div>
        <Link
          href="/users/create"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Tambah User
        </Link>
      </div>

      <UserTable />
    </div>
  );
}
