/**
 * Mock Data for Frontend Development
 * Gunakan file ini untuk testing tanpa backend API
 * 
 * Update .env.local dengan NEXT_PUBLIC_USE_MOCK_API=true untuk enable mock API
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  min_stock: number;
  current_stock: number;
  status: 'available' | 'low-stock' | 'out-of-stock';
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface StockTransaction {
  id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference: string;
  notes: string;
  reason?: string;
  created_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  ip_address: string;
  status: 'success' | 'error';
  created_at: string;
}

// ==================== MOCK USERS ====================
export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    username: 'admin',
    email: 'admin@gudang.local',
    role: 'admin',
    is_active: true,
    created_at: '2025-01-01T08:00:00Z',
    last_login: '2025-12-16T13:00:00Z',
  },
  {
    id: 'user-002',
    username: 'superadmin',
    email: 'superadmin@gudang.local',
    role: 'superadmin',
    is_active: true,
    created_at: '2024-12-01T08:00:00Z',
    last_login: '2025-12-16T09:30:00Z',
  },
  {
    id: 'user-003',
    username: 'admin2',
    email: 'admin2@gudang.local',
    role: 'admin',
    is_active: true,
    created_at: '2025-01-15T08:00:00Z',
    last_login: '2025-12-15T14:20:00Z',
  },
];

// ==================== MOCK PRODUCTS ====================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'LAPTOP-HP-001',
    name: 'HP Pavilion 15-ec2078ax',
    category: 'Electronics',
    description: 'Laptop dengan processor AMD Ryzen 5, RAM 8GB DDR4, SSD 512GB NVMe',
    price: 7500000,
    unit: 'pcs',
    min_stock: 5,
    current_stock: 12,
    status: 'available',
    is_archived: false,
    created_at: '2025-10-15T08:00:00Z',
    updated_at: '2025-12-16T10:30:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-002',
    sku: 'MOUSE-LOG-001',
    name: 'Logitech MX Master 3',
    category: 'Accessories',
    description: 'Wireless mouse professional dengan scroll wheel presisi',
    price: 850000,
    unit: 'pcs',
    min_stock: 20,
    current_stock: 8,
    status: 'low-stock',
    is_archived: false,
    created_at: '2025-10-20T08:00:00Z',
    updated_at: '2025-12-16T11:15:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-003',
    sku: 'KEYBOARD-MECH-001',
    name: 'Keychron K2 Pro',
    category: 'Accessories',
    description: 'Mechanical keyboard wireless dengan switch hot-swap',
    price: 1200000,
    unit: 'pcs',
    min_stock: 15,
    current_stock: 0,
    status: 'out-of-stock',
    is_archived: false,
    created_at: '2025-11-01T08:00:00Z',
    updated_at: '2025-12-15T16:45:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-004',
    sku: 'MONITOR-DELL-001',
    name: 'Dell UltraSharp 27" 4K',
    category: 'Electronics',
    description: 'Monitor 4K dengan color accuracy 99% DCI-P3',
    price: 4500000,
    unit: 'pcs',
    min_stock: 3,
    current_stock: 6,
    status: 'available',
    is_archived: false,
    created_at: '2025-11-05T08:00:00Z',
    updated_at: '2025-12-16T09:00:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-005',
    sku: 'HEADPHONE-SONY-001',
    name: 'Sony WH-1000XM5',
    category: 'Accessories',
    description: 'Wireless headphones dengan noise cancellation terbaik',
    price: 2800000,
    unit: 'pcs',
    min_stock: 10,
    current_stock: 25,
    status: 'available',
    is_archived: false,
    created_at: '2025-11-10T08:00:00Z',
    updated_at: '2025-12-16T13:20:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-006',
    sku: 'CABLE-HDMI-001',
    name: 'HDMI 2.1 Cable 2m',
    category: 'Cables',
    description: 'HDMI cable dengan support 8K@60Hz',
    price: 150000,
    unit: 'pcs',
    min_stock: 50,
    current_stock: 120,
    status: 'available',
    is_archived: false,
    created_at: '2025-11-12T08:00:00Z',
    updated_at: '2025-12-16T14:30:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-007',
    sku: 'POWERBANK-ANKER-001',
    name: 'Anker PowerCore 26800mAh',
    category: 'Accessories',
    description: 'Power bank dengan dual USB port dan USB-C',
    price: 650000,
    unit: 'pcs',
    min_stock: 15,
    current_stock: 42,
    status: 'available',
    is_archived: false,
    created_at: '2025-11-15T08:00:00Z',
    updated_at: '2025-12-16T10:00:00Z',
    created_by: 'user-001',
  },
  {
    id: 'prod-008',
    sku: 'WEBCAM-LOGITECH-001',
    name: 'Logitech StreamCam',
    category: 'Electronics',
    description: 'Webcam 1080p 60fps dengan auto-focus',
    price: 1500000,
    unit: 'pcs',
    min_stock: 5,
    current_stock: 3,
    status: 'low-stock',
    is_archived: false,
    created_at: '2025-11-20T08:00:00Z',
    updated_at: '2025-12-16T12:15:00Z',
    created_by: 'user-001',
  },
];

// ==================== MOCK STOCK TRANSACTIONS ====================
export const MOCK_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'txn-001',
    product_id: 'prod-001',
    type: 'in',
    quantity: 5,
    reference: 'PO-2025-001',
    notes: 'Pembelian dari supplier utama',
    created_by: 'user-001',
    created_at: '2025-12-16T08:00:00Z',
  },
  {
    id: 'txn-002',
    product_id: 'prod-001',
    type: 'out',
    quantity: 2,
    reference: 'SO-2025-015',
    notes: 'Penjualan ke customer ABC',
    created_by: 'user-001',
    created_at: '2025-12-16T09:30:00Z',
  },
  {
    id: 'txn-003',
    product_id: 'prod-002',
    type: 'in',
    quantity: 15,
    reference: 'PO-2025-002',
    notes: 'Pengiriman dari distributor',
    created_by: 'user-001',
    created_at: '2025-12-16T10:15:00Z',
  },
  {
    id: 'txn-004',
    product_id: 'prod-002',
    type: 'out',
    quantity: 10,
    reference: 'SO-2025-016',
    notes: 'Penjualan ke customer DEF',
    created_by: 'user-001',
    created_at: '2025-12-16T10:45:00Z',
  },
  {
    id: 'txn-005',
    product_id: 'prod-003',
    type: 'out',
    quantity: 5,
    reference: 'SO-2025-014',
    notes: 'Penjualan customer GHI',
    created_by: 'user-001',
    created_at: '2025-12-15T14:20:00Z',
  },
  {
    id: 'txn-006',
    product_id: 'prod-005',
    type: 'in',
    quantity: 20,
    reference: 'PO-2025-003',
    notes: 'Stock replenishment',
    created_by: 'user-001',
    created_at: '2025-12-14T08:00:00Z',
  },
  {
    id: 'txn-007',
    product_id: 'prod-006',
    type: 'out',
    quantity: 30,
    reference: 'SO-2025-013',
    notes: 'Bulk order',
    created_by: 'user-001',
    created_at: '2025-12-13T11:00:00Z',
  },
  {
    id: 'txn-008',
    product_id: 'prod-007',
    type: 'in',
    quantity: 25,
    reference: 'PO-2025-004',
    notes: 'New stock arrived',
    created_by: 'user-001',
    created_at: '2025-12-12T09:30:00Z',
  },
  {
    id: 'txn-009',
    product_id: 'prod-004',
    type: 'adjustment',
    quantity: -1,
    reference: '',
    notes: 'Damage correction dari stock opname',
    reason: 'damage',
    created_by: 'user-001',
    created_at: '2025-12-11T15:00:00Z',
  },
  {
    id: 'txn-010',
    product_id: 'prod-008',
    type: 'out',
    quantity: 5,
    reference: 'SO-2025-012',
    notes: 'Customer order',
    created_by: 'user-001',
    created_at: '2025-12-10T10:30:00Z',
  },
];

// ==================== MOCK AUDIT LOGS ====================
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    user_id: 'user-001',
    action: 'CREATE',
    entity_type: 'product',
    entity_id: 'prod-001',
    old_values: {},
    new_values: {
      sku: 'LAPTOP-HP-001',
      name: 'HP Pavilion 15-ec2078ax',
      price: 7500000,
    },
    ip_address: '192.168.1.100',
    status: 'success',
    created_at: '2025-10-15T08:00:00Z',
  },
  {
    id: 'audit-002',
    user_id: 'user-001',
    action: 'UPDATE',
    entity_type: 'product',
    entity_id: 'prod-001',
    old_values: {
      price: 7200000,
    },
    new_values: {
      price: 7500000,
    },
    ip_address: '192.168.1.100',
    status: 'success',
    created_at: '2025-12-01T10:30:00Z',
  },
  {
    id: 'audit-003',
    user_id: 'user-001',
    action: 'STOCK_IN',
    entity_type: 'stock_transaction',
    entity_id: 'txn-001',
    old_values: { current_stock: 7 },
    new_values: { current_stock: 12 },
    ip_address: '192.168.1.100',
    status: 'success',
    created_at: '2025-12-16T08:00:00Z',
  },
  {
    id: 'audit-004',
    user_id: 'user-001',
    action: 'STOCK_OUT',
    entity_type: 'stock_transaction',
    entity_id: 'txn-002',
    old_values: { current_stock: 12 },
    new_values: { current_stock: 10 },
    ip_address: '192.168.1.100',
    status: 'success',
    created_at: '2025-12-16T09:30:00Z',
  },
  {
    id: 'audit-005',
    user_id: 'user-001',
    action: 'LOGIN',
    entity_type: 'user',
    entity_id: 'user-001',
    old_values: {},
    new_values: { last_login: '2025-12-16T13:00:00Z' },
    ip_address: '192.168.1.100',
    status: 'success',
    created_at: '2025-12-16T13:00:00Z',
  },
];

// ==================== MOCK DASHBOARD DATA ====================
export const MOCK_DASHBOARD_SUMMARY = {
  total_products: MOCK_PRODUCTS.length,
  total_stock_value: MOCK_PRODUCTS.reduce((sum, p) => sum + (p.current_stock * p.price), 0),
  total_stock_items: MOCK_PRODUCTS.reduce((sum, p) => sum + p.current_stock, 0),
  low_stock_count: MOCK_PRODUCTS.filter(p => p.status === 'low-stock').length,
  out_of_stock_count: MOCK_PRODUCTS.filter(p => p.status === 'out-of-stock').length,
  low_stock_products: MOCK_PRODUCTS.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock'),
  recent_transactions: MOCK_STOCK_TRANSACTIONS.slice(0, 5),
};

// ==================== MOCK REPORT DATA ====================
export const MOCK_STOCK_REPORT = {
  total_products: MOCK_PRODUCTS.length,
  total_stock_value: MOCK_PRODUCTS.reduce((sum, p) => sum + (p.current_stock * p.price), 0),
  low_stock_count: MOCK_PRODUCTS.filter(p => p.status === 'low-stock').length,
  out_of_stock_count: MOCK_PRODUCTS.filter(p => p.status === 'out-of-stock').length,
  by_category: {
    Electronics: {
      count: MOCK_PRODUCTS.filter(p => p.category === 'Electronics').length,
      value: MOCK_PRODUCTS
        .filter(p => p.category === 'Electronics')
        .reduce((sum, p) => sum + (p.current_stock * p.price), 0),
    },
    Accessories: {
      count: MOCK_PRODUCTS.filter(p => p.category === 'Accessories').length,
      value: MOCK_PRODUCTS
        .filter(p => p.category === 'Accessories')
        .reduce((sum, p) => sum + (p.current_stock * p.price), 0),
    },
    Cables: {
      count: MOCK_PRODUCTS.filter(p => p.category === 'Cables').length,
      value: MOCK_PRODUCTS
        .filter(p => p.category === 'Cables')
        .reduce((sum, p) => sum + (p.current_stock * p.price), 0),
    },
  },
  products: MOCK_PRODUCTS.map(p => ({
    sku: p.sku,
    name: p.name,
    category: p.category,
    current_stock: p.current_stock,
    min_stock: p.min_stock,
    price: p.price,
    total_value: p.current_stock * p.price,
    status: p.status,
  })),
};

export const MOCK_MOVEMENT_REPORT = {
  total_in: MOCK_STOCK_TRANSACTIONS.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0),
  total_out: MOCK_STOCK_TRANSACTIONS.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0),
  total_adjustment: MOCK_STOCK_TRANSACTIONS.filter(t => t.type === 'adjustment').reduce((sum, t) => sum + t.quantity, 0),
  transactions: MOCK_STOCK_TRANSACTIONS,
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get paginated results
 */
export function getPaginatedData<T>(data: T[], page: number, limit: number) {
  const offset = (page - 1) * limit;
  const items = data.slice(offset, offset + limit);
  
  return {
    data: items,
    pagination: {
      total: data.length,
      page,
      limit,
      pages: Math.ceil(data.length / limit),
    },
  };
}

/**
 * Search products
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(p => 
    p.sku.toLowerCase().includes(lowerQuery) ||
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter products
 */
export function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    status?: string;
    priceMin?: number;
    priceMax?: number;
  }
): Product[] {
  return products.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.priceMin && p.price < filters.priceMin) return false;
    if (filters.priceMax && p.price > filters.priceMax) return false;
    return true;
  });
}

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | null {
  return MOCK_PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Get stock history for product
 */
export function getProductStockHistory(productId: string): StockTransaction[] {
  return MOCK_STOCK_TRANSACTIONS.filter(t => t.product_id === productId);
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | null {
  return MOCK_USERS.find(u => u.id === id) || null;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Get status label
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'available': 'Tersedia',
    'low-stock': 'Stok Rendah',
    'out-of-stock': 'Stok Habis',
    'in': 'Barang Masuk',
    'out': 'Barang Keluar',
    'adjustment': 'Penyesuaian',
  };
  return labels[status] || status;
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'available': 'bg-green-100 text-green-800',
    'low-stock': 'bg-yellow-100 text-yellow-800',
    'out-of-stock': 'bg-red-100 text-red-800',
    'success': 'bg-green-100 text-green-800',
    'error': 'bg-red-100 text-red-800',
    'warning': 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
