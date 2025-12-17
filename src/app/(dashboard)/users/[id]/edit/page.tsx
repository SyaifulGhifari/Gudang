'use client';

import { UserForm } from '@/components/users';
import { useAuth } from '@/hooks/useAuth';
import { useUserDetail } from '@/hooks/useUsers';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { user, isLoading } = useUserDetail(userId);

  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-600 mt-2">Update informasi user {user.username}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
        <UserForm initialData={user} isEditing={true} />
      </div>
    </div>
  );
}
