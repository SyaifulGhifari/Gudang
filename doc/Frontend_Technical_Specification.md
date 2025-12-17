# Frontend Technical Specification
## Gudang - Sistem Manajemen Gudang

**Version:** 1.1 (Refinement)  
**Based on:** PRD_Gudang.md v1.0  
**Target Audience:** Frontend Development Team  
**Last Updated:** Desember 2025

---

## 1. Introduction

Dokumen ini adalah technical specification detail untuk implementasi frontend Gudang. Semua requirement di sini bersumber dari PRD dan diterjemahkan menjadi actionable tasks untuk frontend team.

**v1.1 Updates:**
- ✅ Removed all remaining "real-time" terminology
- ✅ Clarified state management strategy (Zustand UI state only, SWR for data fetching)
- ✅ Standardized "computed field from backend" terminology
- ✅ Simplified data fetching pattern recommendations

---

## 2. Project Overview

### 2.1 Tech Stack
- **Framework:** Next.js 14+
- **Styling:** Tailwind CSS
- **State Management:** 
  - **Context API** untuk global state (auth, notifications)
  - **Zustand** untuk UI state (selected filters, pagination, modal states)
- **Data Fetching:** SWR atau React Query (bukan Zustand)
- **Form Handling:** React Hook Form + Zod Validation
- **HTTP Client:** Axios
- **UI Components:** Shadcn/ui atau Headless UI
- **Charts/Analytics:** Recharts atau Chart.js

### 2.2 Architecture Pattern
- **App Router** untuk routing (Next.js 14+)
- **Custom Hooks** untuk auth & data fetching logic
- **Context API** untuk global state (auth, user, notifications)
- **Zustand Stores** untuk UI state saja (filters, selections, pagination)
- **SWR/React Query** untuk data fetching & caching
- **API Client wrapper** dengan interceptors untuk auth

**State Management Strategy:**
- ❌ JANGAN cache data berat (products, stock, reports) di Zustand
- ✅ Gunakan SWR/React Query untuk data fetching (auto-revalidation, fresh data)
- ✅ Zustand untuk UI state yang jarang berubah (selected entity, filters)

---

## 3. Pages & Routes Structure

### 3.1 Public Routes (No Authentication Required)

**Route: `/login`**
- **Component Path:** `src/app/(auth)/login/page.tsx`
- **Purpose:** User login page
- **Features:**
  - Form dengan fields: username, password
  - "Remember me" checkbox (optional)
  - "Forgot password?" link
  - Submit button dengan loading state
  - Error message display
  - Redirect ke dashboard jika sudah login
- **API Call:** POST `/v1/auth/login`
- **Success Action:** Store token → Redirect ke dashboard
- **Error Handling:** Show error toast/inline message

**Route: `/forgot-password`**
- **Component Path:** `src/app/(auth)/forgot-password/page.tsx`
- **Purpose:** Password reset request page
- **Features:**
  - Form dengan email input
  - Submit button
  - Success message dengan instruction
- **API Call:** POST `/v1/auth/forgot-password` (optional, jika backend support)

---

### 3.2 Protected Routes (Authentication Required)

Semua route di bawah memerlukan:
- Token authentication check
- Protected route wrapper component
- Redirect ke login jika tidak authenticated

#### **Route: `/dashboard`**
- **Component Path:** `src/app/(dashboard)/dashboard/page.tsx`
- **Purpose:** Main dashboard dengan overview statistik
- **Permissions:** Admin, Superadmin
- **Components:**
  - `DashboardHeader` - Title dan filter periode (jika ada)
  - `StatCard` (4 cards) untuk:
    1. Total Produk
    2. Total Stok (value)
    3. Nilai Inventory
    4. Produk Low Stock
  - `StockAlertWidget` - List produk dengan stok < minimum
  - `RecentActivityLog` - Activity terbaru dari audit log
  - `QuickActionsBar` - Button untuk: Tambah Produk, Barang Masuk, Penyesuaian Stok
- **API Calls:**
  - GET `/v1/dashboard/summary`
- **Refresh:** Manual refresh button. Data diambil dari server saat page load atau user klik refresh button
- **Responsive:** Full width di desktop, stack di mobile

---

#### **Route: `/products`**
- **Component Path:** `src/app/(dashboard)/products/page.tsx`
- **Purpose:** List semua produk aktif (tidak diarsipkan)
- **Permissions:** Admin, Superadmin
- **Components:**
  - `ProductSearchBar` - Search by SKU, nama, kategori
  - `ProductFilterPanel` - Filter by kategori, status stok, harga range
  - `ProductTable` - Columns:
    - Checkbox (select multiple)
    - SKU
    - Nama Produk
    - Kategori
    - Harga
    - Current Stock (computed field from backend)
    - Status (available/low-stock/out-of-stock)
    - Actions (View, Edit, Archive)
  - `Pagination` - 10/20/50 items per halaman
  - `BulkActions` - Delete/Archive selected (jika ada)
  - Add Product Button (top right)
- **API Calls:**
  - GET `/v1/products?page=1&limit=20&search=...&category=...&status=...`
- **Features:**
  - Search with debounce 300ms (fetches from server, not real-time)
  - Sort by column (click header)
  - Export to CSV button (top right)
  - Responsive table (horizontal scroll di mobile)
- **Loading State:** Skeleton table
- **Empty State:** Icon + message "Tidak ada produk"

---

#### **Route: `/products/[id]`**
- **Component Path:** `src/app/(dashboard)/products/[id]/page.tsx`
- **Purpose:** Detail produk dengan transaction history
- **Permissions:** Admin, Superadmin
- **Layout:**
  - **Header Section:**
    - Product image / placeholder
    - SKU (read-only)
    - Product name
    - Edit button, Archive button
  - **Info Section:**
    - Nama, Kategori, Deskripsi
    - Harga satuan, Unit, Min Stock
    - Status (available/low-stock/out-of-stock)
    - Created at, Updated at
  - **Stock Section:**
    - Current Stock (big number)
    - Stock gauge/indicator
    - Min Stock value
  - **Transaction History:**
    - Table dengan columns: Type, Quantity, Reference, Created By, Date, Actions
    - Filter by transaction type
    - View transaction detail
  - **Quick Actions:**
    - Barang Masuk button
    - Barang Keluar button
    - Penyesuaian Stok button
- **API Calls:**
  - GET `/v1/products/{productId}` (includes current_stock as computed field from backend)
  - GET `/v1/stock/history/{productId}?page=1&limit=20`
- **Refresh:** Manual refresh button untuk fetch latest stock data dari server

---

#### **Route: `/products/create`**
- **Component Path:** `src/app/(dashboard)/products/create/page.tsx`
- **Purpose:** Form untuk tambah produk baru
- **Permissions:** Admin, Superadmin
- **Form Fields:**
  ```
  SKU (text) - required, unique validation
  Nama Produk (text) - required
  Kategori (select) - required, loadable dari API atau predefined
  Deskripsi (textarea) - optional
  Harga Satuan (number) - required, min=0, decimal places=2
  Minimum Stok (number) - required, min=0, integer
  Unit (select) - required (pcs, box, kg, dll)
  Foto Produk (file upload) - optional, accept image only
  ```
- **Validations:**
  - All required fields
  - SKU unique check (async validation via backend endpoint)
  - Price > 0
  - Min stock >= 0
  - File size < 5MB, image format only
- **API Calls:**
  - POST `/v1/products` (multipart/form-data jika ada file)
  - Validasi SKU: GET `/v1/products/check-sku/{sku}` (optional)
- **Success:** Redirect ke product detail page
- **Error:** Show error message, keep form data
- **Layout:** Single column, max-width 600px, centered

---

#### **Route: `/products/[id]/edit`**
- **Component Path:** `src/app/(dashboard)/products/[id]/edit/page.tsx`
- **Purpose:** Edit metadata produk
- **Permissions:** Admin, Superadmin
- **Form Fields:** (sama dengan create, tapi tanpa SKU)
  ```
  SKU (text, disabled/read-only) - TIDAK BISA DIEDIT
  Nama Produk (text) - required
  Kategori (select) - required
  Deskripsi (textarea) - optional
  Harga Satuan (number) - required
  Minimum Stok (number) - required
  Unit (select) - required
  Foto Produk (file upload) - optional, preview current image
  ```
- **Important:** NO STOCK FIELD - stock hanya via transaksi
- **API Calls:**
  - GET `/v1/products/{productId}` - Pre-fill form
  - PUT `/v1/products/{productId}` - Submit changes
- **Audit:** Change akan dicatat otomatis di backend
- **Success:** Show success toast, navigate back to detail
- **Error:** Show validation errors inline

---

#### **Route: `/stock`**
- **Component Path:** `src/app/(dashboard)/stock/page.tsx`
- **Purpose:** Main stock management hub
- **Permissions:** Admin, Superadmin
- **Layout:**
  - **Tab Navigation:**
    1. Barang Masuk
    2. Barang Keluar
    3. Penyesuaian Stok
    4. History
- **Common Features:**
  - Search by product SKU/name
  - Filter by date range
  - Filter by status (pending, completed, etc - jika ada)

---

#### **Route: `/stock/in` (Tab atau Nested Route)**
- **Component Path:** `src/app/(dashboard)/stock/in/page.tsx`
- **Purpose:** Record barang masuk transaksi
- **Components:**
  - `InTransactionForm` - Form untuk barang masuk
  - `InTransactionList` - Recent barang masuk transactions
- **Form Fields:**
  ```
  Produk (select/autocomplete) - required, hanya produk aktif (not archived)
  Jumlah (number) - required, min=1
  Tanggal Masuk (date) - required, default=today
  Referensi (text) - optional (PO number, invoice, dll)
  Catatan (textarea) - optional
  ```
- **API Calls:**
  - GET `/v1/products` - untuk select options (hanya produk aktif)
  - POST `/v1/stock/in` - submit barang masuk transaksi
- **Validasi:**
  - Produk harus aktif (not archived)
  - Jumlah > 0
  - Date tidak bisa di masa depan
- **API Response:** Backend menghitung current_stock setelah transaksi
- **Success:** Clear form, show success message, refresh list

---

#### **Route: `/stock/out` (Tab atau Nested Route)**
- **Component Path:** `src/app/(dashboard)/stock/out/page.tsx`
- **Purpose:** Record barang keluar transaksi
- **Components:**
  - `OutTransactionForm` - Form untuk barang keluar
  - `OutTransactionList` - Recent barang keluar transactions
- **Form Fields:**
  ```
  Produk (select/autocomplete) - required, hanya produk aktif
  Jumlah (number) - required, min=1, max=current_stock
  Tanggal Keluar (date) - required, default=today
  Referensi (text) - optional (SO number, invoice, dll)
  Catatan (textarea) - optional
  ```
- **API Calls:**
  - GET `/v1/products` - untuk select options (hanya produk aktif)
  - POST `/v1/stock/out` - submit barang keluar transaksi
- **Frontend Validasi (UX Prevention Only):**
  - Produk harus aktif (not archived)
  - Jumlah > 0
  - Date tidak bisa di masa depan
  - Display current stock dari server untuk user reference
- **Backend Validasi (Critical & Authoritative):**
  - Server MUST validate bahwa quantity <= current_stock sebelum membuat transaksi
  - Server adalah source of truth untuk stock availability
- **Error Handling:**
  - Jika jumlah > stok di frontend, show warning dan disable submit button
  - Jika backend reject, tampilkan error message dari server
- **Success:** Clear form, show success notification

---

#### **Route: `/stock/adjustment` (Tab atau Nested Route)**
- **Component Path:** `src/app/(dashboard)/stock/adjustment/page.tsx`
- **Purpose:** Penyesuaian stok (stock opname, koreksi, dll)
- **Components:**
  - `AdjustmentForm` - Form penyesuaian
  - `AdjustmentList` - History penyesuaian
- **Form Fields:**
  ```
  Produk (select/autocomplete) - required, hanya produk aktif
  Jumlah Adjustment (number) - required, bisa positif/negatif
  Alasan (select) - required, options:
    - Stock Opname
    - Kerusakan
    - Kadaluarsa
    - Perbedaan Inventory
    - Koreksi Data
    - Lainnya
  Catatan Detail (textarea) - required, penjelasan detail
  Referensi (text) - optional
  ```
- **API Calls:**
  - GET `/v1/products` - untuk select options (hanya produk aktif)
  - POST `/v1/stock/adjustment` - submit penyesuaian stok
- **Validasi:**
  - Alasan harus dipilih (not "Lainnya" saja)
  - Catatan tidak boleh kosong (wajib untuk audit trail)
  - Jumlah tidak 0
  - Adjustment negatif tidak boleh hasil dalam negative stock
- **IMPORTANT:** Setiap penyesuaian HARUS punya catatan alasan (untuk compliance & audit)
- **Success:** Show success notification dengan stock baru

---

#### **Route: `/stock/history`**
- **Component Path:** `src/app/(dashboard)/stock/history/page.tsx`
- **Purpose:** History semua transaksi stok per produk
- **Filters:**
  - Product (select or search)
  - Date range
  - Transaction type (in/out/adjustment)
- **Table Columns:**
  - Tanggal
  - Jenis Transaksi (badge)
  - Produk SKU
  - Jumlah (+ untuk in, - untuk out/adjustment)
  - Saldo Stok (cumulative)
  - Referensi
  - Dicatat Oleh (user)
  - Actions (View detail)
- **API Calls:**
  - GET `/v1/stock/history?product_id=...&start_date=...&end_date=...&type=...`
- **Pagination:** 50 items per page
- **Export:** Download CSV button

---

#### **Route: `/users`** (Superadmin Only)
- **Component Path:** `src/app/(dashboard)/users/page.tsx`
- **Purpose:** User management list
- **Permissions:** Superadmin only
- **Components:**
  - `UserSearchBar`
  - `UserTable` dengan columns: Username, Email, Role, Status, Created At, Actions (Edit, Delete)
  - Pagination
- **API Calls:**
  - GET `/v1/users?page=1&limit=20&role=...&search=...`
- **Add User Button:** Redirect ke `/users/create`
- **Actions:**
  - View: Show user detail
  - Edit: Edit user info & role
  - Delete: Soft delete user (disable)
- **Responsive:** Horizontal scroll di mobile

---

#### **Route: `/users/create`** (Superadmin Only)
- **Component Path:** `src/app/(dashboard)/users/create/page.tsx`
- **Purpose:** Form tambah user baru
- **Form Fields:**
  ```
  Username (text) - required, unique, min 3 chars
  Email (email) - required, unique, valid email
  Password (password) - required, min 8 chars, strong validation
  Confirm Password (password) - required, must match password
  Role (select) - required, options: admin, superadmin
  ```
- **Password Strength Indicator:** Visual feedback
- **API Calls:**
  - POST `/v1/users`
- **Validasi:**
  - Username unique
  - Email unique dan valid
  - Password strength
  - Password match
- **Success:** Redirect ke users list, show success toast

---

#### **Route: `/users/[id]`** (Superadmin Only)
- **Component Path:** `src/app/(dashboard)/users/[id]/page.tsx`
- **Purpose:** User detail dan edit
- **Permissions:** Superadmin only
- **Components:**
  - User info (read-only): Username, Email, Role, Created At, Last Login
  - Edit button → modal atau separate page
  - Activity log: Recent actions oleh user ini
  - Actions: Reset password button, Delete button
- **API Calls:**
  - GET `/v1/users/{userId}`
  - GET `/v1/audit-logs?user_id={userId}&limit=20`

---

#### **Route: `/reports`**
- **Component Path:** `src/app/(dashboard)/reports/page.tsx`
- **Purpose:** Reports dashboard
- **Permissions:** Admin, Superadmin
- **Tabs:**
  1. Stock Report
  2. Movement Report
  3. Inventory Value Report
- **Common Features:**
  - Date range filter
  - Export button (PDF, CSV)
  - Refresh button

---

##### **Stock Report Tab**
- **Components:**
  - Summary cards: Total products, Total stock value, Low stock count, Out of stock count
  - Chart: Stock by category (bar chart)
  - Table: Products with current stock, min stock, status
- **Filters:** Category, status
- **API Calls:**
  - GET `/v1/reports/stock?category=...&status=...&start_date=...&end_date=...`

---

##### **Movement Report Tab**
- **Components:**
  - Summary cards: Total in, Total out, Net change
  - Chart: Daily movement (line chart)
  - Table: Transaction detail per date
- **Filters:** Transaction type, date range
- **API Calls:**
  - GET `/v1/reports/stock-movement?start_date=...&end_date=...&type=...`

---

##### **Inventory Value Report Tab**
- **Components:**
  - Summary: Total value, value by category
  - Chart: Value distribution by category (pie chart)
  - Table: Per-product value (current_stock × price)
- **Filters:** Category
- **API Calls:**
  - GET `/v1/reports/inventory-value?category=...`

---

#### **Route: `/audit-logs`** (Superadmin Only)
- **Component Path:** `src/app/(dashboard)/audit-logs/page.tsx`
- **Purpose:** Full audit log viewing
- **Permissions:** Superadmin only
- **Filters:**
  - User (select)
  - Action type (select)
  - Entity type (select)
  - Date range
  - Entity ID (search)
- **Table Columns:**
  - Timestamp
  - User
  - Action
  - Entity Type
  - Entity ID
  - Status (success/error)
  - IP Address
  - Actions (View detail)
- **API Calls:**
  - GET `/v1/audit-logs?page=1&limit=50&user_id=...&action=...&start_date=...&end_date=...`
- **Pagination:** 50 items per page
- **Detail View:** Modal dengan full JSON old_values & new_values

---

## 4. Component Architecture

### 4.1 Layout Components

```
src/components/layout/
├── Header.tsx
│   ├── Logo
│   ├── User Profile Dropdown
│   ├── Notification Bell (optional)
│   └── Logout Button
├── Sidebar.tsx
│   ├── Navigation Items (based on role)
│   ├── Collapse/Expand Toggle
│   └── Mobile Hamburger Logic
├── DashboardLayout.tsx (wrapper untuk semua protected pages)
│   ├── Header
│   ├── Sidebar
│   ├── Main Content Area
│   └── Toast Notification Container
└── Footer.tsx (optional)
```

---

### 4.2 Product Components

```
src/components/products/
├── ProductList.tsx - Wrapper dengan search, filter, table
├── ProductTable.tsx - Table component
├── ProductCard.tsx - Card view (if needed)
├── ProductForm.tsx - Reusable form untuk create & edit
├── ProductSearchBar.tsx
├── ProductFilterPanel.tsx
├── ProductDetailView.tsx
├── ProductArchiveConfirmation.tsx
└── index.ts (barrel export)
```

---

### 4.3 Stock Components

```
src/components/stock/
├── StockTabs.tsx - Tab navigation untuk in/out/adjustment
├── InTransactionForm.tsx
├── OutTransactionForm.tsx
├── AdjustmentForm.tsx
├── TransactionList.tsx
├── StockHistoryTable.tsx
├── StockAlertWidget.tsx - Small widget untuk dashboard
├── StockStatusBadge.tsx - Reusable status indicator
└── index.ts
```

---

### 4.4 Common Components

```
src/components/common/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Textarea.tsx
├── Modal.tsx
├── Toast.tsx / useNotification hook
├── Table.tsx - Reusable table
├── Card.tsx
├── Badge.tsx
├── Pagination.tsx
├── LoadingSpinner.tsx
├── EmptyState.tsx
├── ConfirmDialog.tsx
├── DatePicker.tsx
├── FileUpload.tsx
└── index.ts
```

---

### 4.5 Form Components

```
src/components/forms/
├── LoginForm.tsx
├── ProductFormField.tsx (reusable field)
├── StockTransactionForm.tsx (base form)
└── index.ts
```

---

## 5. State Management

### 5.1 Global Context (Authentication)

```typescript
// src/context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Usage: useAuth hook
```

### 5.2 Zustand Stores

```typescript
// src/stores/productStore.ts
// Gunakan untuk UI state saja: selected product, filters, pagination
interface ProductStore {
  selectedProductId: string | null;
  filters: ProductFilters;
  currentPage: number;
  setSelectedProduct: (id: string) => void;
  setFilters: (filters: ProductFilters) => void;
  setCurrentPage: (page: number) => void;
  // Data fetching handle via SWR/React Query, jangan cache di Zustand
}

// src/stores/notificationStore.ts
interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

// NOTE: Untuk data fetching (products, stock, reports), gunakan SWR atau React Query
// Jangan cache data berat di Zustand, biarkan SWR handle it untuk fresh data & auto-revalidation
```

---

## 6. API Integration

### 6.1 API Client Setup

```typescript
// src/lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request Interceptor - Add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle errors & refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      // If refresh fails, redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 6.2 API Service Methods

```typescript
// src/services/product.api.ts
export const productAPI = {
  getAll: (page: number, filters: ...) => 
    apiClient.get('/v1/products', { params: { page, ...filters } }),
  
  getById: (id: string) => 
    apiClient.get(`/v1/products/${id}`),
  
  create: (data: FormData) => 
    apiClient.post('/v1/products', data, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  
  update: (id: string, data: FormData) => 
    apiClient.put(`/v1/products/${id}`, data),
  
  archive: (id: string) => 
    apiClient.delete(`/v1/products/${id}`),
};

// src/services/stock.api.ts
export const stockAPI = {
  recordIn: (data: InTransactionDTO) => 
    apiClient.post('/v1/stock/in', data),
  
  recordOut: (data: OutTransactionDTO) => 
    apiClient.post('/v1/stock/out', data),
  
  recordAdjustment: (data: AdjustmentDTO) => 
    apiClient.post('/v1/stock/adjustment', data),
  
  getHistory: (productId: string, page: number) => 
    apiClient.get(`/v1/stock/history/${productId}`, { params: { page } }),
};

// src/services/report.api.ts
export const reportAPI = {
  getStockReport: (filters: ...) => 
    apiClient.get('/v1/reports/stock', { params: filters }),
  
  getMovementReport: (filters: ...) => 
    apiClient.get('/v1/reports/stock-movement', { params: filters }),
  
  exportReport: (type: string, format: 'csv' | 'pdf', filters: ...) => 
    apiClient.get('/v1/reports/export', { 
      params: { type, format, ...filters },
      responseType: 'blob'
    }),
};
```

---

## 7. Form Validation

### 7.1 Validation Schema (Zod)

**IMPORTANT:** Frontend validation adalah untuk UX (prevent form submission, show warnings). Backend adalah penjaga utama. Semua validasi krusial (stock availability, business rules) HARUS ada di backend.

```typescript
// src/schemas/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string()
    .min(3, 'SKU minimal 3 karakter')
    .max(50, 'SKU maksimal 50 karakter')
    .regex(/^[A-Z0-9-]+$/, 'SKU hanya boleh huruf besar, angka, dan dash'),
  
  name: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  
  category: z.string().min(1, 'Kategori wajib dipilih'),
  
  description: z.string().optional(),
  
  price: z.number()
    .positive('Harga harus lebih dari 0')
    .refine(val => Number.isFinite(val), 'Harga harus angka')
    .refine(val => val.toString().split('.')[1]?.length <= 2, 'Max 2 desimal'),
  
  min_stock: z.number()
    .int('Minimum stok harus angka bulat')
    .min(0, 'Minimum stok tidak boleh negatif'),
  
  unit: z.string().min(1, 'Unit wajib dipilih'),
  
  image: z.instanceof(File).optional()
    .refine(file => !file || file.size < 5 * 1024 * 1024, 'File max 5MB')
    .refine(file => !file || file.type.startsWith('image/'), 'Harus file gambar'),
});

export const inTransactionSchema = z.object({
  product_id: z.string().uuid('Produk harus dipilih'),
  quantity: z.number()
    .int('Jumlah harus angka bulat')
    .min(1, 'Jumlah minimal 1'),
  reference: z.string().optional(),
  notes: z.string().optional(),
  transaction_date: z.date('Tanggal wajib diisi'),
});

export const outTransactionSchema = z.object({
  product_id: z.string().uuid('Produk harus dipilih'),
  quantity: z.number()
    .int('Jumlah harus angka bulat')
    .min(1, 'Jumlah minimal 1'),
  // Server akan validasi jangan exceed current stock
  reference: z.string().optional(),
  notes: z.string().optional(),
  transaction_date: z.date('Tanggal wajib diisi'),
});

export const adjustmentSchema = z.object({
  product_id: z.string().uuid('Produk harus dipilih'),
  quantity: z.number()
    .int('Jumlah harus angka bulat')
    .min(-999999, 'Minimum -999999')
    .max(999999, 'Maksimum 999999')
    .refine(val => val !== 0, 'Jumlah tidak boleh 0'),
  reason: z.enum([
    'stock_opname',
    'damage',
    'expired',
    'inventory_mismatch',
    'data_correction',
    'other'
  ], { errorMap: () => ({ message: 'Alasan wajib dipilih' }) }),
  notes: z.string()
    .min(10, 'Catatan minimal 10 karakter')
    .max(1000, 'Catatan maksimal 1000 karakter'),
  reference: z.string().optional(),
});
```

---

### 7.2 Form Implementation Pattern

```typescript
// Example: ProductForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '@/schemas/product.schema';

export function ProductForm({ onSubmit }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } 
    = useForm({
      resolver: zodResolver(createProductSchema),
    });

  const onSubmitHandler = async (data) => {
    try {
      await onSubmit(data);
      // Success toast
    } catch (error) {
      // Error toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Input 
        label="SKU" 
        {...register('sku')} 
        error={errors.sku?.message} 
      />
      {/* More fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
```

---

## 8. Custom Hooks

### 8.1 useAuth Hook

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isSuperadmin: user?.role === 'superadmin',
  };
}
```

### 8.2 Data Fetching Pattern (Recommended: SWR or React Query)

```typescript
// RECOMMENDED: Use SWR for data fetching (not useApi wrapper)
import useSWR from 'swr';

// src/hooks/useProducts.ts
export function useProducts(page: number, filters: any) {
  const { data, error, isLoading, mutate } = useSWR(
    [`/v1/products`, page, filters],
    ([url, page, filters]) => apiClient.get(url, { 
      params: { page, ...filters } 
    }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    products: data?.data.data || [],
    isLoading,
    error,
    refresh: () => mutate(), // manual refresh
  };
}

// ALTERNATIVE: useApi hook untuk simple cases (optional)
// Gunakan hanya untuk mutation, bukan data fetching
```

### 8.3 usePagination Hook

```typescript
// src/hooks/usePagination.ts
export function usePagination(defaultPage = 1, defaultLimit = 20) {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);

  return {
    page,
    limit,
    setPage,
    setLimit,
    offset: (page - 1) * limit,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1)),
  };
}
```

---

## 9. Error Handling Strategy

### 9.1 API Error Handling

```typescript
// src/lib/error-handler.ts
export function handleApiError(error: AxiosError) {
  const status = error.response?.status;
  const data = error.response?.data as any;

  switch (status) {
    case 400:
      return { message: data.error?.message || 'Request tidak valid', type: 'validation' };
    case 401:
      return { message: 'Sesi expired, silakan login kembali', type: 'auth' };
    case 403:
      return { message: 'Anda tidak memiliki akses', type: 'permission' };
    case 404:
      return { message: 'Data tidak ditemukan', type: 'not_found' };
    case 409:
      return { message: data.error?.message || 'Data sudah ada', type: 'conflict' };
    case 422:
      return { 
        message: 'Validasi data gagal', 
        type: 'validation',
        details: data.error?.details 
      };
    default:
      return { message: 'Terjadi kesalahan pada server', type: 'error' };
  }
}
```

### 9.2 Toast Notification System

```typescript
// src/hooks/useNotification.ts
export function useNotification() {
  const { addNotification } = useNotificationStore();

  return {
    success: (message: string) => addNotification({
      id: Date.now().toString(),
      message,
      type: 'success',
      duration: 3000,
    }),
    error: (message: string) => addNotification({
      id: Date.now().toString(),
      message,
      type: 'error',
      duration: 5000,
    }),
    warning: (message: string) => addNotification({
      id: Date.now().toString(),
      message,
      type: 'warning',
      duration: 4000,
    }),
    info: (message: string) => addNotification({
      id: Date.now().toString(),
      message,
      type: 'info',
      duration: 3000,
    }),
  };
}
```

---

## 10. Stock Display & Data Flow

**IMPORTANT:** Frontend TIDAK menghitung current_stock dari stockHistory. Backend adalah source of truth.

### 10.1 Display Current Stock

```typescript
// src/components/stock/CurrentStockDisplay.tsx
interface CurrentStockDisplayProps {
  productId: string;
  minStock: number;
  currentStock: number; // dari server/API, bukan hasil kalkulasi
}

export function CurrentStockDisplay({ productId, minStock, currentStock }: CurrentStockDisplayProps) {
  // currentStock sudah diterima dari backend sebagai computed field
  // Frontend hanya display, JANGAN recalculate dari transactions

  const status = currentStock === 0 
    ? 'out-of-stock' 
    : currentStock <= minStock 
    ? 'low-stock' 
    : 'available';

  return (
    <div className="stock-display">
      <div className="large-number">{currentStock}</div>
      <div className={`status ${status}`}>{getStatusLabel(status)}</div>
      <div className="min-stock">Min: {minStock}</div>
      <button onClick={refreshStockData}>Refresh</button>
    </div>
  );
}
```

**Data Flow:**
1. Backend endpoint returns product dengan `current_stock` sebagai computed field
2. Frontend menerima dan menampilkan nilai tersebut
3. stockHistory digunakan untuk audit trail & historical view saja
4. **CRITICAL:** JANGAN pernah kalkulasi current_stock di frontend dari history transactions
5. Jika perlu stock terbaru, refresh data dari server endpoint
```

---

## 11. Authentication & Protected Routes

### 11.1 ProtectedRoute Component

```typescript
// src/components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superadmin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(false);
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard'); // Redirect ke dashboard
    }
  }, [isAuthenticated, user, router, requiredRole]);

  if (isChecking) return <LoadingSpinner />;

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
```

### 11.2 Layout Wrapper

```typescript
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

---

## 12. Performance Optimization

### 12.1 Code Splitting

```typescript
// Use dynamic imports untuk heavy components
import dynamic from 'next/dynamic';

const StockChart = dynamic(
  () => import('@/components/charts/StockChart'),
  { loading: () => <ChartSkeleton /> }
);
```

### 12.2 Image Optimization

```typescript
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src || '/placeholder-product.png'}
      alt={alt}
      width={400}
      height={400}
      priority={false}
      loading="lazy"
    />
  );
}
```

### 12.3 Data Fetching Optimization

**Principle:** Use SWR or React Query, NOT custom useApi hooks + Zustand

```typescript
// ✅ RECOMMENDED: Use SWR untuk efficient data fetching & caching
import useSWR from 'swr';

export function useProducts(page: number, filters: any) {
  const { data, error, isLoading, mutate } = useSWR(
    [`/v1/products`, page, filters],
    ([url, page, filters]) => apiClient.get(url, { params: { page, ...filters } }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    products: data?.data.data || [],
    isLoading,
    error,
    refresh: () => mutate(), // manual refresh button
  };
}

// ❌ DON'T: Cache data di Zustand
// ❌ DON'T: Create separate useApi hook untuk data fetching
// ✅ DO: Let SWR handle caching, deduping, revalidation
```

---

## 13. Testing Requirements

### 13.1 Unit Tests

```typescript
// Test form validations
// Test custom hooks
// Test utility functions

// Example: __tests__/schemas/product.schema.test.ts
describe('Product Schema', () => {
  it('should validate valid product data', () => {
    const data = { sku: 'PROD001', name: 'Product', ... };
    expect(() => createProductSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid SKU', () => {
    expect(() => createProductSchema.parse({ sku: 'invalid-sku' }))
      .toThrow();
  });
});
```

### 13.2 Component Tests

```typescript
// Test rendering
// Test user interactions
// Test API integration

// Example: __tests__/components/ProductForm.test.tsx
describe('ProductForm', () => {
  it('should render form fields', () => {
    render(<ProductForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText('SKU')).toBeInTheDocument();
  });

  it('should show validation errors', async () => {
    render(<ProductForm onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByText('Simpan'));
    expect(await screen.findByText('SKU wajib diisi')).toBeInTheDocument();
  });
});
```

---

## 14. Development Checklist

### Phase 1: Setup & Auth
**Status:** ✅ COMPLETED & PROJECT CREATED

- [x] Project setup dengan Next.js 14 - ✅ DONE
- [x] Tailwind CSS configuration - ✅ DONE
- [x] API client setup dengan axios - ✅ DONE
- [x] Auth context & useAuth hook - ✅ DONE
- [x] Login page & form validation - ✅ DONE
- [x] Protected route wrapper - ✅ DONE
- [x] Token storage (localStorage / httpOnly cookie) - ✅ DONE

### Phase 2: Product Management
- [ ] Product list page dengan search/filter
- [ ] Product detail page
- [ ] Product create form
- [ ] Product edit form
- [ ] Archive product functionality
- [ ] Product table component
- [ ] Pagination component

### Phase 3: Stock Management
- [ ] Stock management hub / tabs
- [ ] Barang masuk form & list
- [ ] Barang keluar form & list
- [ ] Penyesuaian stok form & list
- [ ] Stock history view
- [ ] Display current_stock from backend & manual refresh handling
- [ ] Frontend validation untuk prevent UX mistakes (backend validates critical rules)

### Phase 4: Reports & Analytics
- [x] Reports dashboard with tabs
- [x] Stock report with charts
- [x] Movement report
- [x] Inventory value report
- [x] Export to CSV/PDF functionality
- [x] Audit logs view (Superadmin)

### Phase 5: User Management (Superadmin)
- [x] User list page
- [x] User create form
- [x] User edit form
- [x] User delete functionality
- [x] Permission-based view

### Phase 6: Polish & Optimization
- [x] Error handling & user feedback
- [x] Loading states
- [x] Responsive design mobile/tablet
- [x] Performance optimization
- [ ] Unit & component testing
- [ ] E2E testing (optional)
- [x] Accessibility compliance

---

## 15. Environment Variables

```bash
# .env.local

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Auth Configuration
NEXT_PUBLIC_AUTH_TOKEN_KEY=gudang_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY=gudang_refresh_token

# Features
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_STOCK_CALCULATION_DEBOUNCE=300
```

---

## 16. Key Implementation Notes

### 16.1 Stock Management
- **NEVER** calculate current_stock di frontend dari transaction history
- **ALWAYS** receive current_stock sebagai computed field dari backend
- **BACKEND** adalah authoritative source untuk stock calculations
- Frontend hanya display dan refresh saat diperlukan
- stockHistory digunakan untuk audit trail dan historical tracking saja

### 16.2 Validation Responsibility
- **Frontend:** Prevent UX mistakes (empty fields, invalid formats, client-side logic)
- **Backend:** Enforce all business rules dan critical validations:
  - Stock availability check (prevent over-deduction)
  - Archived product check
  - Data consistency & integrity
  - Audit logging
- **NEVER** assume frontend validation adalah sufficient. Backend MUST validate independently.

### 16.3 Audit Trail
- **EVERY** transaksi stok harus punya notes/alasan
- **VALIDATE** form tidak boleh submit tanpa alasan/notes (frontend UX)
- **BACKEND** logs semua transaksi ke audit log
- **SHOW** audit trail ke user setelah transaksi berhasil

### 16.4 Archive vs Delete
- **NO** hard delete di UI
- **ONLY** soft delete/archive untuk products
- **SHOW** confirmation warning sebelum archive
- **ALLOW** Superadmin restore dari archived

### 16.5 Refresh Strategy
- **NO** auto-refresh atau polling
- **REFRESH** manual: user klik button atau automatic saat navigate
- **AFTER** submit form sukses, refresh relevant data dari server
- **NAVIGATION:** saat navigate back dari form, re-fetch list data

### 16.6 Error Messages
- **SHOW** specific error messages dari backend (tidak generic)
- **HANDLE** network errors dengan retry logic
- **DISPLAY** validation errors inline di form
- **USE** toast untuk success/error notifications
- **BACKEND** errors adalah authoritative (backend tells frontend what went wrong)

---

## 17. References & Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Hook Form:** https://react-hook-form.com
- **Zod Validation:** https://zod.dev
- **Zustand:** https://zustand-demo.vercel.app
- **Axios:** https://axios-http.com/docs/intro
- **Recharts (for charts):** https://recharts.org
- **Headless UI:** https://headlessui.com

---

**Document Version:** 1.0  
**For:** Frontend Development Team  
**Last Updated:** Desember 2025  
**Next Review:** Januari 2026
