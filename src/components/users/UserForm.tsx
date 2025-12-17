'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, editUserSchema } from '@/schemas/user.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUser } from '@/hooks/useUsers';

interface UserFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const schema = isEditing ? editUserSchema : createUserSchema;

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isEditing) {
        await updateUser(initialData.id, {
          username: data.username,
          email: data.email,
          role: data.role,
        });
        router.push(`/users/${initialData.id}`);
      } else {
        await createUser({
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
        });
        router.push('/users');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error?.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input
          type="text"
          {...register('username')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan username"
        />
        {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username?.message?.toString()}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan email"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email?.message?.toString()}</p>}
      </div>

      {!isEditing && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Minimal 8 karakter, huruf besar, dan angka"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password?.message?.toString()}</p>}
            {password && (
              <div className="mt-2 text-sm">
                <p className={`${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                  {password.length >= 8 ? '✓' : '✗'} Minimal 8 karakter
                </p>
                <p className={`${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                  {/[A-Z]/.test(password) ? '✓' : '✗'} Mengandung huruf besar
                </p>
                <p className={`${/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                  {/[0-9]/.test(password) ? '✓' : '✗'} Mengandung angka
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ulangi password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword?.message?.toString()}</p>
            )}
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
        <select
          {...register('role')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Pilih role</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role?.message?.toString()}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Menyimpan...' : isEditing ? 'Update User' : 'Tambah User'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
