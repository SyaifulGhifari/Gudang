# Product Requirements Document (PRD)
## Gudang - Sistem Manajemen Gudang

**Versi:** 1.0  
**Tanggal:** Desember 2025  
**Status:** Draft

---

## 1. Executive Summary

**Gudang** adalah aplikasi web untuk manajemen inventori gudang yang memungkinkan pengguna untuk melakukan pengecekan stock, penambahan produk, dan pengeditan data produk dengan interface yang responsif. Aplikasi ini dirancang dengan dua level akses (Admin dan Superadmin) untuk memastikan keamanan dan kontrol terhadap data gudang.

---

## 2. Vision & Objectives

### Vision
Menyediakan solusi manajemen gudang yang efisien, user-friendly, dan terpercaya untuk memudahkan pengelolaan inventory produk.

### Objectives
- Mengoptimalkan proses pengecekan dan monitoring stock produk
- Mempercepat proses penambahan dan pengeditan data produk
- Menyediakan kontrol akses yang aman dengan sistem role-based
- Meningkatkan efisiensi operasional gudang
- Menyediakan interface yang intuitif dan responsif

---

## 3. Target Users

### 3.1 Admin
- Staff gudang yang mengelola data produk, stok, dan transaksi sehari-hari
- Tanggung jawab: menambah produk, mencatat transaksi stok (barang masuk/keluar/penyesuaian), mengelola metadata produk
- Jumlah pengguna: Multiple

### 3.2 Superadmin
- Manager atau supervisor gudang
- Tanggung jawab: monitoring penuh, audit data, pengelolaan user admin, approval untuk penyesuaian stok (opsional)
- Jumlah pengguna: 1-3 orang

---

## 4. Core Features & Requirements

### 4.1 Authentication & Authorization
- **Login System**
  - Username dan password authentication
  - Session management
  - Password reset functionality
  - Login history tracking (untuk Superadmin)

### 4.2 Dashboard
- Overview statistik gudang (jumlah produk, total stock, nilai inventory)
- Widget stock alert (produk dengan stock minimum)
- Activity log terbaru
- Quick actions (tambah produk, cek stock)

### 4.3 Manajemen Produk (CRUD)

#### 4.3.1 Create (Tambah Produk)
- Form input untuk metadata produk:
  - Kode/SKU produk (unique)
  - Nama produk
  - Kategori produk
  - Deskripsi produk (optional)
  - Harga satuan (untuk referensi dan perhitungan nilai inventory)
  - Minimum stok (alert ketika stok di bawah nilai ini)
  - Unit (pcs, box, dll)
  - Foto/Gambar produk (optional)
- **Catatan:** Stok awal TIDAK diisi saat create. Stok awal akan dicatat sebagai transaksi penyesuaian stok setelah produk dibuat
- Validasi data input
- Notifikasi success/error
- Auto-generate kode produk (optional)

#### 4.3.2 Read (Cek & Lihat Produk)
- Tabel list produk dengan column:
  - Kode produk
  - Nama produk
  - Kategori
  - Stock saat ini
  - Harga satuan
  - Status (available, low stock, out of stock)
  - Aksi (view, edit, delete)
- Search functionality (berdasarkan kode, nama, kategori)
- Filter & Sort:
  - Berdasarkan kategori
  - Berdasarkan status stock
  - Berdasarkan harga range
- Pagination (tampilkan 10/20/50 item per halaman)
- Export data ke CSV/Excel
- Detail produk view

#### 4.3.3 Update (Edit Produk)
- Form edit produk hanya untuk metadata (tidak memengaruhi stok):
  - Nama produk
  - Kategori
  - Deskripsi
  - Harga satuan
  - Minimum stok
  - Unit
  - Foto produk
- **Pembatasan:** Field SKU tidak bisa diubah (untuk menjaga integritas history transaksi)
- **Pembatasan:** Stok TIDAK bisa diubah melalui fitur edit. Semua perubahan stok harus melalui modul Manajemen Stok
- Audit log otomatis mencatat perubahan metadata (siapa, kapan, field apa yang berubah)
- Konfirmasi sebelum save
- Validasi duplicate kategori/unit sudah ada

#### 4.3.4 Archive Produk (Penggantian Delete)
- **Hard delete DIHAPUS sepenuhnya** untuk menjaga integritas data historis dan audit log
- Soft delete/archive: Produk dapat diarsipkan saat tidak lagi digunakan
- **Efek archiving:**
  - Produk tidak muncul di list produk aktif
  - Produk tidak bisa digunakan untuk transaksi stok baru
  - Semua history transaksi produk tetap tersimpan dan dapat ditelusuri
  - Data produk dan laporan historisnya tetap accessible untuk audit
- Unarchive: Produk dapat dipulihkan dari arsip jika diperlukan
- Konfirmasi dengan warning untuk mencegah archiving yang tidak disengaja
- Superadmin dapat melihat daftar produk yang diarsipkan dan mengubah statusnya

### 4.4 Manajemen Stok (Modul Terpisah dari Produk)

Stok TIDAK disimpan sebagai field di data produk. Jumlah stok dihitung dari TOTAL TRANSAKSI:

**Rumus:** Current Stock = Σ(Barang Masuk) - Σ(Barang Keluar) + Σ(Penyesuaian)

#### 4.4.1 Jenis Transaksi Stok

**A. Barang Masuk**
- Terjadi saat: Penerimaan dari supplier, pembelian, retur dari pelanggan
- Data yang dicatat: Produk, jumlah, tanggal masuk, referensi (PO, invoice), catatan
- Auto-record ke stock history dan audit log

**B. Barang Keluar**
- Terjadi saat: Penjualan, pemakaian, retur ke supplier
- Data yang dicatat: Produk, jumlah, tanggal keluar, referensi (SO, invoice), catatan
- Auto-record ke stock history dan audit log

**C. Penyesuaian Stok**
- Terjadi saat: Koreksi stok karena selisih inventory, stock opname, kerusakan, kadaluarsa
- Data yang dicatat: Produk, jumlah adjustment (positif/negatif), alasan penyesuaian, pencatat, waktu, dokumentasi
- Setiap penyesuaian harus mempunyai catatan alasan yang jelas untuk audit trail
- Auto-record ke stock history dan audit log

#### 4.4.2 Fitur Manajemen Stok
- Stock calculation dari transaksi (diproses di backend, bukan di frontend)
- Lihat current stock, stock history, dan trend perubahan stok
- Notifikasi otomatis saat stok di bawah minimum
- Stock opname: View all transactions untuk periode tertentu, cocokkan dengan fisik, buat penyesuaian
- Stock movement report: Barang masuk, barang keluar per periode
- Laporan stok by kategori
- Validasi: Backend memastikan barang keluar tidak exceed stok available (server-side validation adalah authoritative)
- Riwayat transaksi per produk dengan detail lengkap (siapa, kapan, berapa, alasan)

### 4.5 User Management (Superadmin Only)
- List user/admin
- Tambah user baru
- Edit data user
- Hapus/disable user
- Set role user
- Reset password user
- View user activity log

### 4.6 Laporan & Analytics
- Laporan stock (per kategori, per produk)
- Laporan pergerakan stock (inbound/outbound)
- Laporan nilai inventory
- Export laporan (PDF, Excel)
- Analytics dashboard (chart stock trends)

### 4.7 Audit & Logging
- Log semua aktivitas user (create, update, delete)
- Timestamp setiap perubahan
- User information untuk setiap action
- Audit trail untuk compliance

---

## 5. Role-Based Access Control (RBAC)

### 5.1 Admin Role
| Feature | Permission |
|---------|-----------|
| View Dashboard | ✓ |
| Lihat Produk | ✓ |
| Tambah Produk | ✓ |
| Edit Produk (Metadata Only) | ✓ |
| Archive Produk | ✓ |
| Manajemen Stok (Barang Masuk/Keluar/Penyesuaian) | ✓ |
| View Laporan | ✓ |
| Export Laporan | ✓ |
| User Management | ✗ |
| View Audit Log | Limited (hanya aktivitas sendiri) |
| System Settings | ✗ |

### 5.2 Superadmin Role
| Feature | Permission |
|---------|-----------|
| View Dashboard | ✓ |
| Lihat Produk | ✓ |
| Tambah Produk | ✓ |
| Edit Produk (Metadata Only) | ✓ |
| Archive Produk | ✓ |
| Manajemen Stok (Barang Masuk/Keluar/Penyesuaian) | ✓ |
| View Laporan | ✓ |
| Export Laporan | ✓ |
| User Management | ✓ |
| View Audit Log | Full Access |
| System Settings | ✓ |

---

## 6. Technical Specifications

### 6.1 Tech Stack
- **Frontend Framework:** Next.js 14+
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI / Shadcn/ui (optional)
- **State Management:** React Context API / Zustand
- **Database:** PostgreSQL / MySQL
- **Backend:** Next.js API Routes
- **Authentication:** JWT / Session-based
- **File Upload:** Cloudinary / AWS S3
- **Export:** XLSX, PDF libraries

### 6.2 Architecture
- Monolithic architecture dengan Next.js (frontend + backend)
- RESTful API untuk komunikasi backend-frontend
- Database relational untuk data consistency

### 6.3 Performance Requirements
- Page load time: < 2 detik
- API response time: < 500ms
- Support untuk 100+ concurrent users
- Caching strategy untuk data yang jarang berubah

### 6.4 Security Requirements
- HTTPS/SSL encryption
- Password hashing (bcrypt)
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF token protection
- Rate limiting pada login endpoint
- Input validation dan sanitization
- Role-based access control enforcement

---

## 7. User Flows & Interactions

### 7.1 Login Flow
```
1. User akses website
2. Jika belum login → redirect ke halaman login
3. Input username & password
4. System validasi credentials
5. Jika valid → generate JWT token & redirect ke dashboard
6. Jika invalid → tampilkan error message
```

### 7.2 Tambah Produk Flow
```
1. User (Admin/Superadmin) klik button "Tambah Produk"
2. Modal/Page form tambah produk muncul
3. User isi semua field yang required
4. System validasi input & cek duplicate SKU
5. User klik "Simpan"
6. System simpan ke database
7. Tampilkan success notification
8. Refresh/redirect ke list produk
9. Produk baru muncul di list
```

### 7.3 Edit Produk Flow
```
1. User lihat list produk
2. Klik button "Edit" pada produk yang dituju
3. Form edit muncul dengan data pre-filled
4. User ubah data yang perlu diubah
5. System validasi input
6. User klik "Update"
7. System simpan perubahan ke database
8. Record audit log (siapa, kapan, apa yang berubah)
9. Tampilkan success notification
10. Kembali ke list produk
```

### 7.4 Cek Stock Flow
```
1. User membuka halaman "Daftar Produk"
2. Lihat kolom "Stock Saat Ini" (nilai dari server)
3. Bisa filter/sort berdasarkan status stock
4. Bisa lihat history perubahan stock per produk
5. User dapat refresh halaman untuk melihat stock terbaru dari server
```

### 7.5 Archive Produk Flow
```
1. User (Admin) klik button "Archive" pada produk di list atau di detail page
2. Konfirmasi dialog muncul dengan warning
3. User klik "Confirm Archive"
4. System soft delete/archive produk
5. Produk tidak lagi muncul di list produk aktif
6. Produk tidak bisa digunakan untuk transaksi stok baru
7. Semua history transaksi tetap tersimpan dan bisa diakses untuk audit
8. Superadmin bisa melihat daftar produk yang diarsipkan dan restore jika diperlukan
```

### 7.6 Transaksi Stok Flow (Barang Masuk)
```
1. User (Admin) membuka menu "Manajemen Stok" → "Barang Masuk"
2. Klik button "Tambah Transaksi Barang Masuk"
3. Form muncul dengan field: Produk, Jumlah, Tanggal, Referensi (PO), Catatan
4. User isi semua field
5. System validasi input
6. User klik "Simpan"
7. System membuat transaksi, update stock calculation, auto-record ke audit log
8. Tampilkan success notification dengan detail stock baru
9. Stock terupdate real-time di semua halaman
```

### 7.7 Penyesuaian Stok (Stock Opname) Flow
```
1. User (Admin) membuka menu "Manajemen Stok" → "Penyesuaian Stok"
2. View semua transaksi untuk periode tertentu (untuk referensi)
3. Masukkan hasil penghitungan fisik produk
4. System hitung selisih dengan stok sistem
5. Jika ada selisih, buat transaksi penyesuaian dengan:
   - Produk yang selisih
   - Jumlah adjustment (positif/negatif)
   - Alasan penyesuaian (selisih, kerusakan, kadaluarsa, dll)
   - Catatan detail
6. System validasi tidak ada barang keluar yang exceed stok available
7. User klik "Finalisasi"
8. System membuat transaksi penyesuaian, update stock calculation
9. Auto-record ke audit log dengan alasan yang tercatat
```

---

## 8. UI/UX Requirements

### 8.1 Layout Components
- Header dengan logo, user profile, logout
- Sidebar navigation untuk main menu
- Breadcrumb untuk navigation context
- Footer (optional)
- Modal untuk form/confirmation
- Toast notification untuk feedback

### 8.2 Color Scheme (Tailwind CSS)
- Primary: Blue (focus, buttons, links)
- Secondary: Gray (backgrounds, text)
- Success: Green (positive actions, success messages)
- Warning: Yellow/Orange (alerts, low stock)
- Error: Red (errors, delete actions)
- Neutral: White/Gray (backgrounds)

### 8.3 Responsive Design
- Mobile-first approach
- Responsive breakpoints: sm, md, lg, xl
- Mobile: hamburger menu, stack layout
- Tablet/Desktop: full sidebar

### 8.4 Accessibility
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast compliance (WCAG AA)

---

## 9. Data Model

### 9.1 Users Table
```
- id (UUID)
- username (string, unique)
- email (string, unique)
- password_hash (string)
- role (enum: admin, superadmin)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- last_login (timestamp)
```

### 9.2 Products Table (Master Data Saja - Tidak Ada Stock Field)
```
- id (UUID)
- sku (string, unique)
- name (string)
- category (string)
- description (text, optional)
- price (decimal) - untuk referensi dan perhitungan nilai inventory
- unit (string)
- image_url (string, optional)
- min_stock (integer) - threshold untuk alert
- is_archived (boolean)
- created_by (UUID, FK)
- created_at (timestamp)
- updated_by (UUID, FK)
- updated_at (timestamp)

**CATATAN:** Tidak ada field "stock" di table produk. Stock dihitung real-time dari transaksi.
```

### 9.3 Stock Transactions Table (Mencatat Semua Pergerakan Stok)
```
- id (UUID)
- product_id (UUID, FK)
- transaction_type (enum: in, out, adjustment)
- quantity (integer) - selalu positif, sign ditentukan oleh transaction_type
- reference (string, optional) - PO number, SO number, untuk referensi
- notes (text) - alasan transaksi
- created_by (UUID, FK)
- created_at (timestamp)

**Rumus Stock Calculation:**
current_stock = 
  SUM(quantity WHERE transaction_type='in') 
  - SUM(quantity WHERE transaction_type='out') 
  + SUM(quantity * adjustment_sign WHERE transaction_type='adjustment')
```

### 9.4 Stock History View (Denormalized untuk Reporting)
```
Kombinasi dari Stock Transactions + Products untuk historical tracking
Digunakan untuk:
- Laporan pergerakan stok
- Analisis trend stok
- Audit trail stok
```

### 9.5 Audit Log Table
```
- id (UUID)
- user_id (UUID, FK)
- action (enum: create, update, archive, stock_transaction)
- entity_type (string: product, stock, user, etc)
- entity_id (UUID)
- old_values (JSON) - untuk update metadata produk
- new_values (JSON) - untuk update metadata produk
- transaction_details (JSON) - untuk stock transactions (product, qty, type, reason)
- ip_address (string)
- created_at (timestamp)
```

---

## 10. Data Consistency & Validation Rules

### 10.1 Stock Validation
- Transaksi barang keluar hanya diizinkan jika current_stock >= quantity
- Transaksi tidak bisa dibuat untuk produk yang diarsipkan
- Semua transaksi stok harus memiliki alasan/notes untuk audit trail
- Tidak boleh ada negative stock (hasil dari perhitungan transaksi)

### 10.2 Nilai Inventory Calculation
```
**Clarification:** Nilai inventory dihitung berdasarkan:
Value = SUM(current_stock[product] * price[product])

Harga satuan disimpan di Products table dan bersifat statis (tidak berubah 
saat historical calculation). Jika diperlukan historical pricing, 
gunakan price snapshot di Stock Transactions table.

**Untuk Reporting:** Nilai inventory dapat ditampilkan:
1. Per produk: product.current_stock * product.price
2. Per kategori: SUM(product.current_stock * product.price) GROUP BY category
3. Total: SUM(product.current_stock * product.price)

Semua perhitungan nilai inventory harus konsisten dan dapat diaudit.
```

---

## 11. Non-Functional Requirements

### 11.1 Performance
- Page load time maksimal 2 detik
- Database query time < 500ms
- Stock calculation dari transaksi harus < 200ms
- Cache strategy untuk read-heavy operations
- Lazy loading untuk list/table yang panjang

### 11.2 Reliability
- Uptime: 99.5%
- Automatic backup harian
- Transaction ACID support untuk semua operasi stok
- Error handling dan graceful degradation
- Atomicity pada transaksi stok (semua atau tidak sama sekali)

### 11.3 Scalability
- Architecture yang bisa scale horizontally
- Database optimization (indexing pada product_id, transaction_type, created_at)
- Stock calculation yang efficient untuk jutaan transaksi
- CDN untuk asset static
- Load balancing ready

### 11.4 Maintainability
- Clean code standards
- Comprehensive documentation
- Detailed logging untuk semua transaksi stok
- Monitoring & alerting untuk anomali stok
- Easy audit trail dan historical data access

---

## 12. Success Metrics

- **Adoption Rate:** Target 80% daily active users dalam 3 bulan
- **System Uptime:** Minimal 99.5% uptime
- **User Satisfaction:** NPS score > 50
- **Performance:** Page load < 2 detik, Stock calculation < 200ms
- **Error Rate:** < 0.1% transaction error
- **Data Integrity:** 100% audit trail completeness
- **Support Tickets:** < 5 tickets per bulan

---

## 13. Timeline & Milestones

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Planning & Design | 2 minggu | Wireframe, Design System, Schema Design |
| Development Phase 1 (Auth, Dashboard, Product CRUD) | 3 minggu | Core product management features |
| Development Phase 2 (Stock Management Module) | 3 minggu | All stock transaction features |
| Development Phase 3 (Reports & Analytics) | 2 minggu | Reporting dan dashboard features |
| Testing & QA | 2 minggu | Bug fix, Optimization, Load testing |
| UAT & Deployment | 1 minggu | Go live, Monitoring setup |

**Total Timeline:** 13 minggu (updated untuk stock berbasis transaksi)

---

## 14. Risk & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Kompleksitas transaksi stok | High | Comprehensive testing, clear documentation, training |
| Data loss transaksi historis | High | Regular backup, transaction ACID support, audit log |
| Unauthorized access / data manipulation | High | Strong authentication, RBAC enforcement, audit trail |
| Performance stock calculation | Medium | Database indexing, query optimization, caching |
| User adoption terhadap new flow | Medium | User training, clear UI, good documentation |
| Stock calculation error dari transaksi | High | Validation rules, atomic transactions, reconciliation tools |

---

## 15. Key Business Rules & Constraints

### 15.1 Stock Management Rules
- **Stock adalah READ-ONLY calculation:** Tidak ada field langsung untuk edit stok
- **All Stock Changes = Transactions:** Setiap perubahan stok harus tercatat sebagai transaksi
- **Complete Audit Trail:** Setiap transaksi harus lengkap dengan WHO, WHEN, WHAT, WHY
- **No Negative Stock:** Sistem harus validasi mencegah barang keluar lebih dari stok available
- **Archived Products:** Produk yang diarsipkan tidak bisa di-transaksi
- **Historical Data Preservation:** Hard delete tidak diizinkan untuk menjaga audit trail

### 15.2 Product Editing Rules
- **Metadata Only:** Edit produk hanya untuk informasi master, bukan stok
- **Immutable SKU:** Kode produk tidak bisa diubah
- **Min Stock Editable:** Threshold alert bisa disesuaikan tanpa memengaruhi stok saat ini
- **Price Reference:** Harga digunakan untuk kalkulasi nilai inventory

---

## 16. Future Enhancements (Phase 2)

- Barcode scanning untuk stock opname
- Mobile app native (iOS/Android)
- Advanced analytics & time-series reporting
- Multi-warehouse support dengan inter-warehouse transfer
- Purchase order (PO) management terintegrasi
- Supplier management dan performance tracking
- Notification system (email, push) untuk stock alerts
- API untuk third-party integration (ERP, accounting)
- Workflow approval untuk penyesuaian stok besar
- Real-time collaboration features
- Stock forecasting & demand planning

---

## 17. Appendix

### A. Glossary
- **SKU:** Stock Keeping Unit - kode unik produk
- **Current Stock:** Perhitungan real-time dari total transaksi
- **Stock Transaction:** Catatan setiap perubahan stok (masuk, keluar, penyesuaian)
- **Stock Opname:** Penghitungan fisik inventory dan reconciliation dengan sistem
- **Soft Delete/Archive:** Menandai data sebagai inactive tanpa menghapus historis
- **Audit Log:** Catatan lengkap semua aktivitas untuk compliance dan traceability
- **Inventory Value:** Perhitungan nilai stok = SUM(current_stock * price)
- **Transaction Type:** Jenis transaksi - Barang Masuk, Barang Keluar, Penyesuaian
- **ACID:** Atomicity, Consistency, Isolation, Durability

### B. Key Changes dari Previous Version

1. **Stock Concept:** Dari field di Products → dihitung dari Transactions
2. **Delete:** Dari soft/hard delete → hanya soft delete/archive
3. **Edit Produk:** Dari full CRUD → metadata only (no stock edit)
4. **Stock Management:** Dari simple adjustment → transaction-based dengan full audit
5. **Timeline:** Dari 10 minggu → 13 minggu (add stock module complexity)

### C. References
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- WCAG Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Owner:** Product Manager  
**Last Updated:** Desember 2025  
**Next Review:** Januari 2026
