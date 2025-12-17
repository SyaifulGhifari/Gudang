'use client';

import { UserForm } from '@/components/users';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateUserPage() {
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tambah User Baru</h1>
        <p className="text-gray-600 mt-2">Buat akun user baru untuk sistem gudang</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
        <UserForm />
      </div>
    </div>
  );
}
