import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Gudang</h1>
        <p className="text-gray-600 mt-2">Sistem Manajemen Inventori</p>
      </div>

      <div className="mb-8">
        <LoginForm />
      </div>

      <div className="text-center space-y-2">
        <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
          Lupa password?
        </a>
      </div>
    </div>
  );
}
