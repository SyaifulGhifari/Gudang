'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    pathname.startsWith('/stock/') ? '/stock' : null
  );

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/products', label: 'Produk', icon: '📦' },
    {
      href: '/stock',
      label: 'Manajemen Stok',
      icon: '📈',
      submenu: [
        { href: '/stock', label: 'Barang Masuk/Keluar' },
        { href: '/stock/history', label: 'History Transaksi' },
      ],
    },
    { href: '/reports', label: 'Laporan', icon: '📋' },
  ];

  const adminMenuItems =
    user?.role === 'superadmin'
      ? [{ href: '/users', label: 'Pengguna', icon: '👥' }]
      : [];

  const allMenuItems = [...menuItems, ...adminMenuItems];

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isItemActive = (item: any) => {
    if (item.submenu) {
      return item.submenu.some((subitem: any) => subitem.href === pathname);
    }
    return isActive(item.href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-900 text-white overflow-auto transform transition-transform duration-200 z-40 md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>

        <nav className="p-4 space-y-2">
          {allMenuItems.map((item: any) => (
            <div key={item.href}>
              {item.submenu ? (
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.href ? null : item.href)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isItemActive(item)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-100 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <span className={`transition-transform ${expandedMenu === item.href ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-100 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={onClose}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}

              {/* Submenu */}
              {item.submenu && expandedMenu === item.href && (
                <div className="ml-4 mt-2 space-y-1 border-l border-gray-700 pl-4">
                  {item.submenu.map((subitem: any) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={`block px-4 py-2 rounded transition text-sm ${
                        isActive(subitem.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                      onClick={onClose}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
