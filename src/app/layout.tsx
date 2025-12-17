import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationContainer } from '@/components/common/NotificationContainer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Gudang - Sistem Manajemen Inventori',
  description: 'Aplikasi manajemen gudang dengan kontrol stok real-time, tracking transaksi, dan reporting analytics',
  keywords: 'gudang, inventory, manajemen stok, warehouse management',
  authors: [{ name: 'Gudang Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
          <NotificationContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
