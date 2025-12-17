# Mock API Documentation

## Overview

Mock API digunakan untuk frontend development **tanpa perlu backend yang siap**. Semua data dummy sudah disediakan dan siap digunakan.

**Status:** ✅ Mock API ready untuk Phase 2 development

---

## Cara Menggunakan Mock API

### 1. Enable Mock API

Update `.env.local`:
```bash
NEXT_PUBLIC_USE_MOCK_API=true
```

### 2. Automatic Integration

Ketika `NEXT_PUBLIC_USE_MOCK_API=true`, frontend akan otomatis menggunakan mock API tanpa perubahan kode.

### 3. Switch ke Real Backend

Ketika backend sudah ready, ubah `.env.local`:
```bash
NEXT_PUBLIC_USE_MOCK_API=false
```

Tidak perlu mengubah kode apapun, hanya environment variable.

---

## Mock Data Tersedia

### 1. **Products** (8 items)
Kategori: Electronics, Accessories, Cables

```
- LAPTOP-HP-001: HP Pavilion (Rp7.5jt, stok: 12)
- MOUSE-LOG-001: Logitech MX Master 3 (Rp850k, stok: 8 - LOW STOCK)
- KEYBOARD-MECH-001: Keychron K2 Pro (Rp1.2jt, stok: 0 - OUT OF STOCK)
- MONITOR-DELL-001: Dell UltraSharp 27" (Rp4.5jt, stok: 6)
- HEADPHONE-SONY-001: Sony WH-1000XM5 (Rp2.8jt, stok: 25)
- CABLE-HDMI-001: HDMI 2.1 Cable (Rp150k, stok: 120)
- POWERBANK-ANKER-001: Anker PowerCore (Rp650k, stok: 42)
- WEBCAM-LOGITECH-001: Logitech StreamCam (Rp1.5jt, stok: 3 - LOW STOCK)
```

### 2. **Stock Transactions** (10 items)
Includes:
- Barang Masuk (In transactions)
- Barang Keluar (Out transactions)
- Penyesuaian Stok (Adjustments)

### 3. **Users** (3 items)
```
- admin / admin@gudang.local (role: admin)
- superadmin / superadmin@gudang.local (role: superadmin)
- admin2 / admin2@gudang.local (role: admin)
```

Password: Bebas, accept apapun (karena demo)

### 4. **Audit Logs** (5 items)
Semua aksi tercatat

### 5. **Dashboard Summary**
Total products, stock value, low stock alerts, recent transactions

### 6. **Reports**
- Stock Report (per category breakdown)
- Movement Report (in/out/adjustment trends)
- Inventory Value Report

---

## API Endpoints Tersedia

### Authentication

#### `mockAuthAPI.login(username, password)`
**Response:**
```typescript
{
  success: true,
  data: {
    token: "mock-jwt-token-...",
    user: {
      id: "user-001",
      username: "admin",
      email: "admin@gudang.local",
      role: "admin"
    }
  }
}
```

**Notes:**
- Accept any username/password kombinasi
- Otomatis simulasi delay 500ms (realistic network latency)

#### `mockAuthAPI.refresh(token)`
Refresh token (returns new token)

#### `mockAuthAPI.getCurrentUser()`
Get current user info

#### `mockAuthAPI.logout()`
Logout (clear session)

---

### Products

#### `mockProductAPI.getAll(filters)`
**Filters:**
```typescript
{
  page?: number;           // default: 1
  limit?: number;          // default: 20
  search?: string;         // search by SKU, name, category
  category?: string;       // filter by category
  status?: string;         // filter by status
  priceMin?: number;       // filter by price range
  priceMax?: number;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    data: [/* products array */],
    pagination: {
      total: 8,
      page: 1,
      limit: 20,
      pages: 1
    }
  }
}
```

#### `mockProductAPI.getById(id)`
Get product detail dengan stock info

#### `mockProductAPI.create(data)`
**Validasi:**
- SKU, nama, kategori wajib
- Price harus > 0
- Min stock >= 0

**Response:** New product object

#### `mockProductAPI.update(id, data)`
Update product (nama, kategori, harga, min stock, unit, deskripsi)

**IMPORTANT:** SKU tidak bisa diubah (read-only)

#### `mockProductAPI.archive(id)`
Soft delete product (mark as archived)

---

### Stock Management

#### `mockStockAPI.recordIn(data)`
Record barang masuk transaksi

**Required Fields:**
- `product_id`: UUID
- `quantity`: integer, min=1
- `reference`: string (optional) - PO number, invoice, etc
- `notes`: string (optional)
- `transaction_date`: date (optional, default=today)

**Response:** Transaction object

#### `mockStockAPI.recordOut(data)`
Record barang keluar transaksi

**Required Fields:**
- `product_id`: UUID
- `quantity`: integer, min=1, max=current_stock
- `reference`: string (optional)
- `notes`: string (optional)
- `transaction_date`: date (optional)

**Validasi:**
- ✅ Frontend: Show current stock untuk reference
- ✅ Backend (Mock): Validate quantity <= current_stock
  - If quantity > stock: Error "Stok tidak cukup"

#### `mockStockAPI.recordAdjustment(data)`
Record penyesuaian stok (stock opname, damage, etc)

**Required Fields:**
- `product_id`: UUID
- `quantity`: integer (positive/negative), min=-999999, max=999999
- `reason`: enum - stock_opname, damage, expired, inventory_mismatch, data_correction, other
- `notes`: string (required, min 10 chars, max 1000 chars)
- `reference`: string (optional)

**Validasi:**
- ✅ Quantity tidak boleh 0
- ✅ Reason harus dipilih
- ✅ Notes wajib diisi (untuk audit trail)
- ✅ Adjustment tidak boleh hasilkan negative stock

#### `mockStockAPI.getHistory(productId, page, limit)`
Get stock history untuk product tertentu

**Response:** Paginated transaction list

---

### Dashboard

#### `mockDashboardAPI.getSummary()`
Get dashboard summary:
- Total products
- Total stock value
- Total stock items
- Low stock count
- Out of stock count
- List produk low/out of stock
- Recent transactions (5 latest)

---

### Reports

#### `mockReportAPI.getStockReport(filters)`
Stock report dengan:
- Total products, value, low stock count
- Breakdown by category
- Per-product stock detail

#### `mockReportAPI.getMovementReport(filters)`
Stock movement report:
- Total in, out, adjustments
- Transaction list

#### `mockReportAPI.exportReport(type, format, filters)`
Export report sebagai CSV atau PDF

---

### Users (Superadmin only)

#### `mockUserAPI.getAll(page, limit)`
List semua users

#### `mockUserAPI.getById(id)`
Get user detail

---

### Audit Logs (Superadmin only)

#### `mockAuditLogAPI.getAll(page, limit)`
List semua audit logs

---

## How Mock Data Works

### In-Memory Storage
```typescript
// src/data/mockData.ts
export const MOCK_PRODUCTS = [/* 8 products */];
export const MOCK_STOCK_TRANSACTIONS = [/* 10 transactions */];
// ... etc
```

### Stateful Operations
Ketika create/update/delete via mock API, data disimpan di memory:

```typescript
// mockProductAPI.create() akan:
// 1. Validate input
// 2. Create new product object
// 3. Push ke MOCK_PRODUCTS array
// 4. Return object

// Data PERSISTEN during session, reset saat refresh halaman
```

### Simulasi Network Delay
Setiap mock API call punya delay:
- Login: 500ms
- Get all: 600ms
- Get by ID: 400ms
- Create: 800ms
- Stock transaction: 700ms

Ini membuat testing lebih realistic.

---

## Important Notes

### 1. Data Persistence
- ✅ Data persisten **during session** (tab tidak di-refresh)
- ❌ Data **NOT persisted** ke browser storage/database
- **Reset data:** Refresh halaman atau restart browser

**Saat Phase 2 testing, jangan lupa simpan data penting sebelum refresh!**

### 2. Stock Calculation
- Frontend menerima `current_stock` dari mock API (sebagai computed field)
- Mock API otomatis update `current_stock` saat barang masuk/keluar
- **Frontend TIDAK pernah kalkulasi stock sendiri** dari history

### 3. Validation
- **Frontend:** Prevent UX mistakes (empty fields, invalid format)
- **Mock API (Backend):** Enforce business rules
  - Stock availability untuk barang keluar
  - Negative stock prevention
  - Data integrity

### 4. Error Messages
Mock API return error messages yang realistis:
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, data: {}, error: "Stok tidak cukup. Stok tersedia: 5" }
```

---

## Testing Checklist for Phase 2

### Product Management
- [ ] List products dengan search/filter
- [ ] Create product baru
- [ ] View product detail (dengan current stock)
- [ ] Edit product
- [ ] Archive product
- [ ] Verify stock tidak bisa dijadikan field edit (read-only)

### Stock Management
- [ ] Barang masuk: Create, view history
- [ ] Barang keluar: Create dengan stock validation
- [ ] Penyesuaian stok: Create dengan alasan wajib
- [ ] Stock history: Lihat semua transaksi product
- [ ] Verify stock update otomatis setelah transaksi

### Validation Testing
- [ ] Frontend validation: Empty fields
- [ ] Frontend validation: Invalid format
- [ ] Backend (mock) validation: Over-deduction (quantity > stock)
- [ ] Backend (mock) validation: Negative stock prevention
- [ ] Error message display

---

## Switch to Real Backend (Ketika Ready)

### Steps:
1. Setup backend server di port 3001 (atau sesuai config)
2. Verify API endpoints match [API_Contract.md](../doc/API_Contract.md)
3. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
4. Restart dev server
5. Test login dengan real credentials

### No Code Changes Needed!
- AuthContext sudah check `NEXT_PUBLIC_USE_MOCK_API`
- API service sudah siap switch otomatis
- Frontend code stay the same

---

## File Structure

```
src/
├── data/
│   └── mockData.ts          # Semua dummy data
├── lib/
│   └── mock-api.ts          # Mock API implementations
└── context/
    └── AuthContext.tsx      # Updated dengan mock API support
```

---

## FAQ

**Q: Data saya hilang setelah refresh?**  
A: Ya, mock data hanya disimpan di memory selama session. Refresh halaman = reset data. Ini normal untuk development.

**Q: Bagaimana test dengan data besar?**  
A: Tambah data ke `src/data/mockData.ts`. Contoh: tambah 100 products ke `MOCK_PRODUCTS` array.

**Q: Bagaimana test error cases?**  
A: Error cases sudah dihandle di mock API. Contoh: barang keluar dengan quantity > stock akan return error.

**Q: Backend sudah ready, bagaimana switch?**  
A: Cukup ubah env variable `NEXT_PUBLIC_USE_MOCK_API=false`. Kode tetap sama.

**Q: Bisa pake real data dari CSV?**  
A: Bisa, parse CSV dan populate `MOCK_PRODUCTS` array di `mockData.ts`.

---

**Version:** 1.0  
**Status:** ✅ Ready for Phase 2  
**Last Updated:** Desember 2025
