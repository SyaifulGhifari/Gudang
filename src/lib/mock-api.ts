/**
 * Mock API Client
 * 
 * Gunakan file ini untuk development tanpa backend
 * Set NEXT_PUBLIC_USE_MOCK_API=true di .env.local
 */

import {
  MOCK_PRODUCTS,
  MOCK_USERS,
  MOCK_STOCK_TRANSACTIONS,
  MOCK_AUDIT_LOGS,
  MOCK_DASHBOARD_SUMMARY,
  MOCK_STOCK_REPORT,
  MOCK_MOVEMENT_REPORT,
  getPaginatedData,
  searchProducts,
  filterProducts,
  getProductById,
  getProductStockHistory,
  Product,
  StockTransaction,
} from '@/data/mockData';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface ProductFilters extends PaginationParams {
  search?: string;
  category?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
}

/**
 * Mock Auth API
 */
export const mockAuthAPI = {
  login: async (username: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> => {
    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Accept any username/password untuk testing
    if (!username || !password) {
      return {
        success: false,
        data: {} as any,
        error: 'Username dan password wajib diisi',
      };
    }

    const user = MOCK_USERS.find(u => u.username === username) || MOCK_USERS[0];

    return {
      success: true,
      data: {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    };
  },

  refresh: async (token: string): Promise<ApiResponse<{ token: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: {
        token: `mock-jwt-token-${Date.now()}`,
      },
    };
  },

  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: MOCK_USERS[0],
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      data: null,
    };
  },
};

/**
 * Mock Product API
 */
export const mockProductAPI = {
  getAll: async (filters: ProductFilters = {}): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const { page = 1, limit = 20, search = '', category, status, priceMin, priceMax } = filters;

    // Search
    let products = search ? searchProducts(search) : MOCK_PRODUCTS;

    // Filter
    products = filterProducts(products, { category, status, priceMin, priceMax });

    // Paginate
    const result = getPaginatedData(products, page, limit);

    return {
      success: true,
      data: result,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const product = getProductById(id);
    if (!product) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk tidak ditemukan',
      };
    }

    return {
      success: true,
      data: product,
    };
  },

  create: async (data: any): Promise<ApiResponse<Product>> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validasi
    if (!data.sku || !data.name || !data.category) {
      return {
        success: false,
        data: {} as any,
        error: 'SKU, nama, dan kategori wajib diisi',
      };
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: data.sku,
      name: data.name,
      category: data.category,
      description: data.description || '',
      price: parseFloat(data.price) || 0,
      unit: data.unit || 'pcs',
      min_stock: parseInt(data.min_stock) || 0,
      current_stock: 0, // New product starts with 0 stock
      status: 'available',
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'user-001',
    };

    // Tambah ke mock data (hanya di memory, tidak persistent)
    MOCK_PRODUCTS.push(newProduct);

    return {
      success: true,
      data: newProduct,
      message: 'Produk berhasil dibuat',
    };
  },

  update: async (id: string, data: any): Promise<ApiResponse<Product>> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const product = getProductById(id);
    if (!product) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk tidak ditemukan',
      };
    }

    const updated: Product = {
      ...product,
      name: data.name || product.name,
      category: data.category || product.category,
      description: data.description || product.description,
      price: data.price ? parseFloat(data.price) : product.price,
      unit: data.unit || product.unit,
      min_stock: data.min_stock ? parseInt(data.min_stock) : product.min_stock,
      updated_at: new Date().toISOString(),
    };

    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS[index] = updated;
    }

    return {
      success: true,
      data: updated,
      message: 'Produk berhasil diperbarui',
    };
  },

  archive: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const product = getProductById(id);
    if (!product) {
      return {
        success: false,
        data: null as any,
        error: 'Produk tidak ditemukan',
      };
    }

    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS[index].is_archived = true;
    }

    return {
      success: true,
      data: null,
      message: 'Produk berhasil diarsipkan',
    };
  },
};

/**
 * Mock Stock API
 */
export const mockStockAPI = {
  recordIn: async (data: any): Promise<ApiResponse<StockTransaction>> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    if (!data.product_id || !data.quantity) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk dan jumlah wajib diisi',
      };
    }

    const product = getProductById(data.product_id);
    if (!product) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk tidak ditemukan',
      };
    }

    const transaction: StockTransaction = {
      id: `txn-${Date.now()}`,
      product_id: data.product_id,
      type: 'in',
      quantity: parseInt(data.quantity),
      reference: data.reference || '',
      notes: data.notes || '',
      created_by: 'user-001',
      created_at: new Date().toISOString(),
    };

    // Update product stock
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === data.product_id);
    if (productIndex !== -1) {
      MOCK_PRODUCTS[productIndex].current_stock += parseInt(data.quantity);
      MOCK_PRODUCTS[productIndex].updated_at = new Date().toISOString();
    }

    MOCK_STOCK_TRANSACTIONS.push(transaction);

    return {
      success: true,
      data: transaction,
      message: 'Barang masuk berhasil dicatat',
    };
  },

  recordOut: async (data: any): Promise<ApiResponse<StockTransaction>> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    if (!data.product_id || !data.quantity) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk dan jumlah wajib diisi',
      };
    }

    const product = getProductById(data.product_id);
    if (!product) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk tidak ditemukan',
      };
    }

    // IMPORTANT: Backend validates stock availability
    if (product.current_stock < data.quantity) {
      return {
        success: false,
        data: {} as any,
        error: `Stok tidak cukup. Stok tersedia: ${product.current_stock}`,
      };
    }

    const transaction: StockTransaction = {
      id: `txn-${Date.now()}`,
      product_id: data.product_id,
      type: 'out',
      quantity: parseInt(data.quantity),
      reference: data.reference || '',
      notes: data.notes || '',
      created_by: 'user-001',
      created_at: new Date().toISOString(),
    };

    // Update product stock
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === data.product_id);
    if (productIndex !== -1) {
      MOCK_PRODUCTS[productIndex].current_stock -= parseInt(data.quantity);
      MOCK_PRODUCTS[productIndex].updated_at = new Date().toISOString();
    }

    MOCK_STOCK_TRANSACTIONS.push(transaction);

    return {
      success: true,
      data: transaction,
      message: 'Barang keluar berhasil dicatat',
    };
  },

  recordAdjustment: async (data: any): Promise<ApiResponse<StockTransaction>> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    if (!data.product_id || data.quantity === undefined || data.quantity === null) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk, jumlah, dan alasan wajib diisi',
      };
    }

    if (!data.reason || data.quantity === 0) {
      return {
        success: false,
        data: {} as any,
        error: 'Alasan penyesuaian wajib dipilih dan jumlah tidak boleh 0',
      };
    }

    const product = getProductById(data.product_id);
    if (!product) {
      return {
        success: false,
        data: {} as any,
        error: 'Produk tidak ditemukan',
      };
    }

    const quantity = parseInt(data.quantity);

    // Prevent negative stock
    if (product.current_stock + quantity < 0) {
      return {
        success: false,
        data: {} as any,
        error: `Penyesuaian tidak bisa membuat stok menjadi negatif`,
      };
    }

    const transaction: StockTransaction = {
      id: `txn-${Date.now()}`,
      product_id: data.product_id,
      type: 'adjustment',
      quantity,
      reference: data.reference || '',
      notes: data.notes,
      reason: data.reason,
      created_by: 'user-001',
      created_at: new Date().toISOString(),
    };

    // Update product stock
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === data.product_id);
    if (productIndex !== -1) {
      MOCK_PRODUCTS[productIndex].current_stock += quantity;
      MOCK_PRODUCTS[productIndex].updated_at = new Date().toISOString();
    }

    MOCK_STOCK_TRANSACTIONS.push(transaction);

    return {
      success: true,
      data: transaction,
      message: 'Penyesuaian stok berhasil dicatat',
    };
  },

  getHistory: async (productId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const history = getProductStockHistory(productId);
    const result = getPaginatedData(history, page, limit);

    return {
      success: true,
      data: result,
    };
  },
};

/**
 * Mock Dashboard API
 */
export const mockDashboardAPI = {
  getSummary: async (): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      data: MOCK_DASHBOARD_SUMMARY,
    };
  },
};

/**
 * Mock Report API
 */
export const mockReportAPI = {
  getStockReport: async (filters: any = {}): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      data: MOCK_STOCK_REPORT,
    };
  },

  getMovementReport: async (filters: any = {}): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      data: MOCK_MOVEMENT_REPORT,
    };
  },

  exportReport: async (type: string, format: string, filters: any = {}): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return dummy CSV/PDF
    const content = `Report ${type} - ${format}`;
    return new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  },
};

/**
 * Mock User API
 */
export const mockUserAPI = {
  getAll: async (page: number = 1, limit: number = 20): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = getPaginatedData(MOCK_USERS, page, limit);

    return {
      success: true,
      data: result,
    };
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) {
      return {
        success: false,
        data: {} as any,
        error: 'User tidak ditemukan',
      };
    }

    return {
      success: true,
      data: user,
    };
  },
};

/**
 * Mock Audit Log API
 */
export const mockAuditLogAPI = {
  getAll: async (page: number = 1, limit: number = 50): Promise<ApiResponse<any>> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = getPaginatedData(MOCK_AUDIT_LOGS, page, limit);

    return {
      success: true,
      data: result,
    };
  },
};
