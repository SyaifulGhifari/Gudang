# API Contract
## Gudang - Sistem Manajemen Gudang

**Version:** 1.0  
**Based on:** PRD_Gudang.md v1.0 & Frontend_Technical_Specification.md v1.1  
**Target Audience:** Backend Development Team  
**Last Updated:** Desember 2025  
**Status:** Final

---

## 1. Overview

Dokumen ini mendefinisikan API contract untuk backend Gudang. Semua endpoint yang diperlukan oleh frontend sudah terdokumentasi dengan detail request/response format, error handling, dan business rules.

### 1.1 Base URL
```
Development: http://localhost:3001/api
Production: https://api.gudang.com/api
```

### 1.2 API Version
```
/v1/ - Current stable version
```

### 1.3 General Information
- **Protocol:** HTTPS (Production), HTTP (Development)
- **Format:** JSON
- **Charset:** UTF-8
- **Authentication:** JWT Bearer Token
- **Rate Limiting:** 100 requests per minute per user

---

## 2. Authentication & Authorization

### 2.1 Authentication Approach

**Token-based authentication using JWT (JSON Web Token)**

Semua protected endpoints memerlukan Authorization header:
```
Authorization: Bearer <jwt_token>
```

### 2.2 Token Structure

**Token lifetime:**
- Access Token: 24 hours
- Refresh Token: 7 days

**Token payload (minimum):**
```json
{
  "user_id": "uuid",
  "username": "string",
  "role": "admin|superadmin",
  "iat": "unix_timestamp",
  "exp": "unix_timestamp"
}
```

### 2.3 Authorization Rules

**Role-based access control:**
- **Admin:** Can access products, stock management, reports, own audit log
- **Superadmin:** Can access all features including user management, full audit log, system settings

---

## 3. HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request successful, return data |
| 201 | Created | Resource successfully created |
| 204 | No Content | Request successful, no response body |
| 400 | Bad Request | Invalid request format or validation error |
| 401 | Unauthorized | Authentication required / token invalid |
| 403 | Forbidden | User doesn't have permission to access |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate unique field (SKU, username, email) |
| 422 | Unprocessable Entity | Validation error with detailed field errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 4. Error Response Format

### 4.1 Standard Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}  // optional, untuk validation errors
  }
}
```

### 4.2 Validation Error Response (HTTP 422)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field_name": ["Error message 1", "Error message 2"],
      "another_field": ["Error message"]
    }
  }
}
```

### 4.3 Common Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| INVALID_REQUEST | 400 | Request format invalid |
| UNAUTHORIZED | 401 | Token invalid/expired |
| FORBIDDEN | 403 | User doesn't have permission |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_ENTRY | 409 | Unique constraint violation |
| VALIDATION_ERROR | 422 | One or more fields validation failed |
| INSUFFICIENT_STOCK | 422 | Stock tidak cukup untuk barang keluar |
| ARCHIVED_PRODUCT | 422 | Produk sudah diarsipkan, tidak bisa di-transaksi |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## 5. Pagination, Filtering & Sorting

### 5.1 Pagination Query Parameters

```
GET /v1/products?page=1&limit=20
```

**Parameters:**
- `page` (optional, default=1): Page number (1-indexed)
- `limit` (optional, default=20): Items per page (max=100)

**Response metadata:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### 5.2 Search Query Parameter

```
GET /v1/products?search=keyword
```

Cari di multiple fields (SKU, name, category, description)

### 5.3 Filtering Query Parameters

**Format:** `?filter[field]=value` atau `?field=value`

Examples:
```
GET /v1/products?category=elektronik&status=available
GET /v1/stock/history?type=in&start_date=2025-01-01&end_date=2025-01-31
```

### 5.4 Sorting Query Parameter

```
GET /v1/products?sort=-created_at,name
```

**Format:** `sort=field1,-field2,field3`
- Tanpa `-`: ascending
- Dengan `-`: descending

---

## 6. Authentication Endpoints

### 6.1 POST /v1/auth/login

**Purpose:** User login, return JWT token

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "remember_me": "boolean (optional)"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "admin|superadmin",
    "created_at": "2025-01-01T10:00:00Z"
  },
  "token": "jwt_token_string",
  "refresh_token": "jwt_refresh_token_string",
  "expires_in": 86400  // seconds
}
```

**Errors:**
- 400: Invalid username/password format
- 401: Username or password incorrect
- 429: Too many login attempts (rate limiting)

---

### 6.2 POST /v1/auth/refresh

**Purpose:** Refresh access token using refresh token

**Request:**
```json
{
  "refresh_token": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "new_jwt_token_string",
  "expires_in": 86400
}
```

**Errors:**
- 401: Refresh token invalid/expired

---

### 6.3 POST /v1/auth/logout

**Purpose:** Invalidate current token (optional, client can just delete token)

**Authentication:** Required (Bearer token)

**Request:** 
```json
{}
```

**Response (204 No Content):**
```
```

---

### 6.4 GET /v1/auth/me

**Purpose:** Get current authenticated user info

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "role": "admin|superadmin",
  "is_active": true,
  "created_at": "2025-01-01T10:00:00Z",
  "last_login": "2025-01-15T14:30:00Z"
}
```

**Errors:**
- 401: Token invalid/expired

---

### 6.5 POST /v1/auth/forgot-password (Optional)

**Purpose:** Request password reset

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent"
}
```

---

## 7. Product Endpoints

### 7.1 GET /v1/products

**Purpose:** List all active (non-archived) products

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search keyword (SKU, name, category)
- `category` (optional): Filter by category
- `status` (optional): Filter by stock status (available, low-stock, out-of-stock)
- `sort` (optional): Sort by field

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "sku": "PROD001",
      "name": "Produk 1",
      "category": "Elektronik",
      "description": "Deskripsi produk",
      "price": 150000.50,
      "unit": "pcs",
      "min_stock": 10,
      "current_stock": 25,
      "status": "available",
      "image_url": "https://...",
      "is_archived": false,
      "created_at": "2025-01-01T10:00:00Z",
      "created_by": "uuid",
      "updated_at": "2025-01-15T14:00:00Z",
      "updated_by": "uuid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

**Notes:**
- `current_stock` adalah computed field dari stock transactions
- `status` calculated: available (> min_stock), low-stock (0 < x <= min_stock), out-of-stock (0)
- Archived products tidak termasuk dalam list ini

**Errors:**
- 401: Unauthorized
- 403: User doesn't have permission

---

### 7.2 GET /v1/products/{productId}

**Purpose:** Get detail product dengan stock info

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "uuid",
  "sku": "PROD001",
  "name": "Produk 1",
  "category": "Elektronik",
  "description": "Deskripsi produk",
  "price": 150000.50,
  "unit": "pcs",
  "min_stock": 10,
  "current_stock": 25,
  "status": "available",
  "image_url": "https://...",
  "is_archived": false,
  "created_at": "2025-01-01T10:00:00Z",
  "created_by": "uuid",
  "updated_at": "2025-01-15T14:00:00Z",
  "updated_by": "uuid"
}
```

**Errors:**
- 401: Unauthorized
- 404: Product not found

---

### 7.3 POST /v1/products

**Purpose:** Create new product

**Authentication:** Required (Admin, Superadmin)

**Request (multipart/form-data jika ada file):**
```json
{
  "sku": "PROD001",
  "name": "Produk Baru",
  "category": "Elektronik",
  "description": "Deskripsi produk",
  "price": 150000.50,
  "unit": "pcs",
  "min_stock": 10,
  "image": "file (optional)"
}
```

**Validation Rules:**
- SKU: required, unique, 3-50 chars, alphanumeric + dash only
- Name: required, 3-255 chars
- Category: required, string
- Price: required, >= 0, max 2 decimal places
- Unit: required, string
- Min Stock: required, >= 0, integer
- Image: optional, max 5MB, image format only

**Response (201 Created):**
```json
{
  "id": "uuid",
  "sku": "PROD001",
  "name": "Produk Baru",
  "category": "Elektronik",
  "description": "Deskripsi produk",
  "price": 150000.50,
  "unit": "pcs",
  "min_stock": 10,
  "current_stock": 0,
  "status": "out-of-stock",
  "image_url": "https://...",
  "is_archived": false,
  "created_at": "2025-01-01T10:00:00Z",
  "created_by": "uuid"
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 403: Forbidden (user doesn't have permission)
- 409: SKU already exists
- 422: Validation error

**Business Rules:**
- Stock tidak diisi saat create (default = 0)
- Stock awal harus diisi via stock transaction (Penyesuaian Stok)
- Created_by diisi dari authenticated user

---

### 7.4 PUT /v1/products/{productId}

**Purpose:** Update product metadata (TIDAK bisa update stock)

**Authentication:** Required (Admin, Superadmin)

**Request (multipart/form-data):**
```json
{
  "name": "Produk Updated",
  "category": "Elektronik",
  "description": "Deskripsi baru",
  "price": 200000,
  "unit": "pcs",
  "min_stock": 15,
  "image": "file (optional)"
}
```

**Validation Rules:**
- Sama seperti create, tapi semua fields optional
- SKU TIDAK bisa diubah

**Response (200 OK):**
```json
{
  "id": "uuid",
  "sku": "PROD001",
  "name": "Produk Updated",
  "category": "Elektronik",
  "description": "Deskripsi baru",
  "price": 200000,
  "unit": "pcs",
  "min_stock": 15,
  "current_stock": 25,
  "status": "available",
  "image_url": "https://...",
  "is_archived": false,
  "created_at": "2025-01-01T10:00:00Z",
  "created_by": "uuid",
  "updated_at": "2025-01-15T15:00:00Z",
  "updated_by": "uuid"
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 403: Forbidden
- 404: Product not found
- 422: Validation error

**Business Rules:**
- Stock field TIDAK boleh ada di request (akan ignored jika ada)
- Auto-record ke audit log dengan old_values & new_values
- Updated_at dan updated_by di-update otomatis

---

### 7.5 DELETE /v1/products/{productId}

**Purpose:** Archive product (soft delete, bukan hard delete)

**Authentication:** Required (Admin, Superadmin)

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "sku": "PROD001",
  "name": "Produk 1",
  "is_archived": true,
  "archived_at": "2025-01-15T15:00:00Z",
  "archived_by": "uuid"
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden
- 404: Product not found

**Business Rules:**
- Archive product, jangan hard delete
- Archived products:
  - Tidak muncul di GET /v1/products list
  - Tidak bisa digunakan untuk stock transactions baru
  - Semua history tetap tersimpan
- Superadmin bisa restore: PATCH /v1/products/{productId}/restore
- Auto-record ke audit log

---

### 7.6 GET /v1/products/check-sku/{sku} (Optional)

**Purpose:** Check if SKU is unique (untuk async validation di frontend)

**Authentication:** Required

**Response (200 OK):**
```json
{
  "sku": "PROD001",
  "exists": false,
  "available": true
}
```

atau

```json
{
  "sku": "PROD001",
  "exists": true,
  "available": false,
  "message": "SKU sudah digunakan"
}
```

---

## 8. Stock Transaction Endpoints

**PENTING:** Setiap transaksi stok HARUS:
1. Validasi di backend (jangan andalkan frontend validation)
2. Recordkan ke audit log dengan lengkap
3. Hitung current_stock dari SUM transactions
4. Atomicity: semua atau tidak sama sekali

### 8.1 POST /v1/stock/in

**Purpose:** Record barang masuk transaksi

**Authentication:** Required (Admin, Superadmin)

**Request:**
```json
{
  "product_id": "uuid",
  "quantity": 50,
  "transaction_date": "2025-01-15",
  "reference": "PO-2025-001",
  "notes": "Penerimaan dari supplier ABC"
}
```

**Validation Rules:**
- product_id: required, must exist, must not be archived
- quantity: required, integer, > 0
- transaction_date: required, date, not future date
- reference: optional, string
- notes: optional, string

**Response (201 Created):**
```json
{
  "id": "uuid",
  "product_id": "uuid",
  "transaction_type": "in",
  "quantity": 50,
  "reference": "PO-2025-001",
  "notes": "Penerimaan dari supplier ABC",
  "created_by": "uuid",
  "created_at": "2025-01-15T10:00:00Z",
  "new_stock": 75  // current_stock setelah transaksi
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 404: Product not found
- 422: Validation error (archived product, invalid quantity, dll)

**Business Rules:**
- Produk harus aktif (not archived)
- Current stock dihitung otomatis: SUM(quantity WHERE type='in') - SUM(quantity WHERE type='out') + SUM(quantity WHERE type='adjustment')
- Auto-record ke audit log

---

### 8.2 POST /v1/stock/out

**Purpose:** Record barang keluar transaksi

**Authentication:** Required (Admin, Superadmin)

**Request:**
```json
{
  "product_id": "uuid",
  "quantity": 20,
  "transaction_date": "2025-01-15",
  "reference": "SO-2025-001",
  "notes": "Penjualan ke customer"
}
```

**Validation Rules:**
- Sama seperti /v1/stock/in
- CRITICAL: quantity tidak boleh > current_stock

**Response (201 Created):**
```json
{
  "id": "uuid",
  "product_id": "uuid",
  "transaction_type": "out",
  "quantity": 20,
  "reference": "SO-2025-001",
  "notes": "Penjualan ke customer",
  "created_by": "uuid",
  "created_at": "2025-01-15T10:30:00Z",
  "new_stock": 55  // current_stock setelah transaksi
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 404: Product not found
- 422: Validation error, **ESPECIALLY: Insufficient stock**

**Error response untuk insufficient stock:**
```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stok tidak cukup untuk transaksi ini",
    "details": {
      "current_stock": 55,
      "requested_quantity": 100,
      "available": false
    }
  }
}
```

**Business Rules:**
- MUST validate: quantity <= current_stock
- Jika quantity > current_stock, reject dengan error code INSUFFICIENT_STOCK
- Produk harus aktif
- Auto-record ke audit log dengan detail lengkap

---

### 8.3 POST /v1/stock/adjustment

**Purpose:** Record penyesuaian stok (stock opname, kerusakan, dll)

**Authentication:** Required (Admin, Superadmin)

**Request:**
```json
{
  "product_id": "uuid",
  "quantity": 5,
  "reason": "stock_opname",
  "notes": "Selisih inventory dari stock opname tanggal 2025-01-15. Fisik: 80, Sistem: 75",
  "reference": "SO-2025-001",
  "transaction_date": "2025-01-15"
}
```

**Validation Rules:**
- product_id: required, must exist, must not be archived
- quantity: required, integer, bisa positif atau negatif, TIDAK boleh 0
- reason: required, enum: [stock_opname, damage, expired, inventory_mismatch, data_correction, other]
- notes: required, string, min 10 chars (untuk audit trail)
- reference: optional, string
- transaction_date: required, date, not future

**Response (201 Created):**
```json
{
  "id": "uuid",
  "product_id": "uuid",
  "transaction_type": "adjustment",
  "quantity": 5,
  "reason": "stock_opname",
  "notes": "Selisih inventory dari stock opname...",
  "reference": "SO-2025-001",
  "created_by": "uuid",
  "created_at": "2025-01-15T10:00:00Z",
  "new_stock": 80  // current_stock setelah transaksi
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 404: Product not found
- 422: Validation error (archived product, quantity=0, notes too short, dll)

**Error response untuk notes validation:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "notes": ["Catatan minimal 10 karakter"]
    }
  }
}
```

**Business Rules:**
- Produk harus aktif
- Notes WAJIB diisi (minimum 10 chars) untuk compliance & audit trail
- Adjustment bisa positif (menambah) atau negatif (mengurangi)
- Hasil adjustment TIDAK boleh negative stock
- Auto-record ke audit log dengan reason lengkap

---

### 8.4 GET /v1/stock/history/{productId}

**Purpose:** Get stock transaction history untuk product tertentu

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by transaction type (in, out, adjustment)
- `start_date` (optional): Filter by start date (YYYY-MM-DD)
- `end_date` (optional): Filter by end date (YYYY-MM-DD)
- `sort` (optional): Sort by field (default: -created_at)

**Response (200 OK):**
```json
{
  "product": {
    "id": "uuid",
    "sku": "PROD001",
    "name": "Produk 1",
    "current_stock": 80,
    "price": 150000
  },
  "data": [
    {
      "id": "uuid",
      "transaction_type": "in",
      "quantity": 50,
      "reference": "PO-2025-001",
      "notes": "Penerimaan dari supplier",
      "created_by": {
        "id": "uuid",
        "username": "admin1"
      },
      "created_at": "2025-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "transaction_type": "out",
      "quantity": 20,
      "reference": "SO-2025-001",
      "notes": "Penjualan ke customer",
      "created_by": {
        "id": "uuid",
        "username": "admin2"
      },
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Errors:**
- 401: Unauthorized
- 404: Product not found

---

## 9. Dashboard Endpoint

### 9.1 GET /v1/dashboard/summary

**Purpose:** Get dashboard summary statistics

**Authentication:** Required

**Response (200 OK):**
```json
{
  "total_products": 150,
  "total_stock_value": 75000000,
  "total_stock_quantity": 5000,
  "low_stock_count": 12,
  "out_of_stock_count": 3,
  "stock_alerts": [
    {
      "product_id": "uuid",
      "sku": "PROD001",
      "name": "Produk 1",
      "current_stock": 5,
      "min_stock": 10,
      "status": "low-stock"
    }
  ],
  "recent_activities": [
    {
      "id": "uuid",
      "user": "admin1",
      "action": "created product",
      "entity_type": "product",
      "entity_id": "uuid",
      "created_at": "2025-01-15T14:30:00Z"
    }
  ]
}
```

**Errors:**
- 401: Unauthorized

---

## 10. Reports Endpoints

### 10.1 GET /v1/reports/stock

**Purpose:** Get stock report dengan filtering by category, status

**Authentication:** Required

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status (available, low-stock, out-of-stock)
- `start_date` (optional): Report period start (untuk historical if needed)
- `end_date` (optional): Report period end

**Response (200 OK):**
```json
{
  "report_date": "2025-01-15T00:00:00Z",
  "summary": {
    "total_products": 150,
    "total_value": 75000000,
    "total_quantity": 5000,
    "by_category": [
      {
        "category": "Elektronik",
        "products": 50,
        "quantity": 1500,
        "value": 30000000
      }
    ]
  },
  "data": [
    {
      "id": "uuid",
      "sku": "PROD001",
      "name": "Produk 1",
      "category": "Elektronik",
      "current_stock": 25,
      "price": 150000,
      "value": 3750000,
      "min_stock": 10,
      "status": "available"
    }
  ]
}
```

---

### 10.2 GET /v1/reports/stock-movement

**Purpose:** Get stock movement report (inbound/outbound per period)

**Authentication:** Required

**Query Parameters:**
- `start_date` (required): Start date (YYYY-MM-DD)
- `end_date` (required): End date (YYYY-MM-DD)
- `type` (optional): Filter by transaction type (in, out, adjustment)

**Response (200 OK):**
```json
{
  "period": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  },
  "summary": {
    "total_in": 1000,
    "total_out": 500,
    "total_adjustment": 50,
    "net_change": 550
  },
  "by_date": [
    {
      "date": "2025-01-01",
      "in": 100,
      "out": 50,
      "adjustment": 0
    }
  ],
  "by_category": [
    {
      "category": "Elektronik",
      "in": 500,
      "out": 250,
      "adjustment": 25
    }
  ]
}
```

---

### 10.3 GET /v1/reports/inventory-value

**Purpose:** Get inventory value report

**Authentication:** Required

**Query Parameters:**
- `category` (optional): Filter by category

**Response (200 OK):**
```json
{
  "report_date": "2025-01-15T00:00:00Z",
  "total_value": 75000000,
  "by_category": [
    {
      "category": "Elektronik",
      "quantity": 1500,
      "value": 30000000
    }
  ],
  "by_product": [
    {
      "sku": "PROD001",
      "name": "Produk 1",
      "category": "Elektronik",
      "current_stock": 25,
      "price": 150000,
      "value": 3750000
    }
  ]
}
```

---

### 10.4 GET /v1/reports/export

**Purpose:** Export report ke CSV atau PDF

**Authentication:** Required

**Query Parameters:**
- `type` (required): Report type (stock, movement, inventory-value)
- `format` (required): Export format (csv, pdf)
- Other filter parameters same as respective report endpoint

**Response:** Binary file (CSV atau PDF) dengan Content-Disposition header

```
Content-Type: application/pdf atau text/csv
Content-Disposition: attachment; filename="stock-report-2025-01-15.pdf"
```

---

## 11. User Management Endpoints (Superadmin Only)

### 11.1 GET /v1/users

**Purpose:** List all users

**Authentication:** Required (Superadmin only)

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by username atau email
- `role` (optional): Filter by role (admin, superadmin)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "admin1",
      "email": "admin1@example.com",
      "role": "admin",
      "is_active": true,
      "created_at": "2025-01-01T10:00:00Z",
      "last_login": "2025-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10
  }
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden (user is not superadmin)

---

### 11.2 GET /v1/users/{userId}

**Purpose:** Get user detail

**Authentication:** Required (Superadmin only)

**Response (200 OK):**
```json
{
  "id": "uuid",
  "username": "admin1",
  "email": "admin1@example.com",
  "role": "admin",
  "is_active": true,
  "created_at": "2025-01-01T10:00:00Z",
  "last_login": "2025-01-15T14:30:00Z"
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden
- 404: User not found

---

### 11.3 POST /v1/users

**Purpose:** Create new user

**Authentication:** Required (Superadmin only)

**Request:**
```json
{
  "username": "admin2",
  "email": "admin2@example.com",
  "password": "SecurePassword123!",
  "role": "admin"
}
```

**Validation Rules:**
- username: required, unique, 3-50 chars, alphanumeric + underscore
- email: required, unique, valid email format
- password: required, min 8 chars, must contain uppercase, lowercase, number, special char
- role: required, enum: [admin, superadmin]

**Response (201 Created):**
```json
{
  "id": "uuid",
  "username": "admin2",
  "email": "admin2@example.com",
  "role": "admin",
  "is_active": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 403: Forbidden
- 409: Username atau email already exists
- 422: Validation error (weak password, invalid email, dll)

---

### 11.4 PUT /v1/users/{userId}

**Purpose:** Update user info

**Authentication:** Required (Superadmin only)

**Request:**
```json
{
  "email": "admin2-new@example.com",
  "role": "superadmin",
  "is_active": true
}
```

**Validation Rules:**
- email: optional, unique, valid email format
- role: optional, enum: [admin, superadmin]
- is_active: optional, boolean
- username & password TIDAK bisa diubah via endpoint ini (separate endpoints)

**Response (200 OK):**
```json
{
  "id": "uuid",
  "username": "admin2",
  "email": "admin2-new@example.com",
  "role": "superadmin",
  "is_active": true,
  "updated_at": "2025-01-15T10:00:00Z"
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 403: Forbidden
- 404: User not found
- 409: Email already exists
- 422: Validation error

---

### 11.5 DELETE /v1/users/{userId}

**Purpose:** Soft delete / disable user

**Authentication:** Required (Superadmin only)

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "username": "admin2",
  "is_active": false,
  "deleted_at": "2025-01-15T10:00:00Z"
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden
- 404: User not found

**Business Rules:**
- Soft delete (set is_active = false), jangan hard delete
- User tidak bisa login setelah di-disable
- History tetap tersimpan

---

### 11.6 POST /v1/users/{userId}/reset-password

**Purpose:** Reset user password (Superadmin)

**Authentication:** Required (Superadmin only)

**Request:**
```json
{
  "new_password": "NewSecurePassword123!"
}
```

**Validation Rules:**
- new_password: required, min 8 chars, strong password

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Errors:**
- 400: Invalid request format
- 401: Unauthorized
- 403: Forbidden
- 404: User not found
- 422: Validation error (weak password)

---

## 12. Audit Log Endpoints

### 12.1 GET /v1/audit-logs

**Purpose:** Get audit logs (Superadmin full access, Admin limited)

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `user_id` (optional): Filter by user (Superadmin only)
- `action` (optional): Filter by action (create, update, delete, archive, stock_transaction)
- `entity_type` (optional): Filter by entity type (product, stock, user, etc)
- `entity_id` (optional): Filter by entity ID
- `start_date` (optional): Filter by date range start
- `end_date` (optional): Filter by date range end
- `sort` (optional): Sort by field (default: -created_at)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "username": "admin1"
      },
      "action": "created",
      "entity_type": "product",
      "entity_id": "uuid",
      "old_values": null,
      "new_values": {
        "name": "Produk Baru",
        "sku": "PROD001",
        "price": 150000
      },
      "status": "success",
      "ip_address": "192.168.1.1",
      "created_at": "2025-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "username": "admin1"
      },
      "action": "stock_transaction",
      "entity_type": "stock",
      "entity_id": "uuid",
      "transaction_details": {
        "product_id": "uuid",
        "transaction_type": "in",
        "quantity": 50,
        "reference": "PO-2025-001",
        "notes": "Penerimaan dari supplier"
      },
      "status": "success",
      "ip_address": "192.168.1.1",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5000
  }
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden (Admin can only see own logs)

**Business Rules:**
- Admin dapat melihat audit log untuk aktivitas mereka sendiri saja
- Superadmin dapat melihat semua audit logs
- Setiap action dicatat dengan:
  - WHO (user_id)
  - WHEN (created_at)
  - WHAT (action, entity_type, old_values, new_values)
  - WHERE (ip_address)

---

### 12.2 GET /v1/audit-logs/{auditLogId}

**Purpose:** Get detail audit log

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "uuid",
  "user": {
    "id": "uuid",
    "username": "admin1",
    "email": "admin1@example.com"
  },
  "action": "stock_transaction",
  "entity_type": "stock",
  "entity_id": "uuid",
  "transaction_details": {
    "product_id": "uuid",
    "product_name": "Produk 1",
    "transaction_type": "in",
    "quantity": 50,
    "reference": "PO-2025-001",
    "notes": "Penerimaan dari supplier ABC",
    "previous_stock": 25,
    "new_stock": 75
  },
  "status": "success",
  "error_message": null,
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2025-01-15T10:00:00Z"
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden
- 404: Audit log not found

---

## 13. Data Consistency & Validation Rules

### 13.1 Stock Calculation

**CRITICAL:** Stock bukan field yang disimpan, tapi CALCULATED VALUE

```
current_stock = SUM(quantity WHERE transaction_type='in') 
              - SUM(quantity WHERE transaction_type='out')
              + SUM(quantity * adjustment_sign WHERE transaction_type='adjustment')
```

**Implementation:**
- Setiap kali ada request GET product, hitung current_stock dari transactions
- Atau gunakan computed column / generated column di database
- Cache di application level jika diperlukan, invalidate saat ada transaksi baru

### 13.2 Stock Validation

1. **Barang Keluar Validation:**
   ```
   if (quantity > current_stock) {
     reject with INSUFFICIENT_STOCK error
   }
   ```

2. **Archived Product Validation:**
   ```
   if (product.is_archived) {
     reject with ARCHIVED_PRODUCT error
   }
   ```

3. **Negative Stock Prevention:**
   ```
   if (adjustment type = 'out' && new_stock < 0) {
     reject adjustment
   }
   ```

### 13.3 Audit Trail Requirements

**EVERY transaction HARUS tercatat di audit log dengan:**
- WHO: user_id, username
- WHEN: created_at timestamp
- WHAT: action, entity_type, old_values, new_values (untuk metadata update)
- WHERE: ip_address
- STATUS: success/error

**Untuk stock transactions specifically:**
```json
{
  "action": "stock_transaction",
  "entity_type": "stock",
  "transaction_details": {
    "product_id": "uuid",
    "transaction_type": "in|out|adjustment",
    "quantity": number,
    "reference": "string",
    "notes": "string",
    "previous_stock": number,
    "new_stock": number,
    "reason": "string (untuk adjustment)"
  }
}
```

---

## 14. Data Models

### 14.1 Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  min_stock INTEGER NOT NULL DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id),
  INDEX idx_sku (sku),
  INDEX idx_is_archived (is_archived),
  INDEX idx_category (category)
);
```

### 14.2 Stock Transactions Table

```sql
CREATE TABLE stock_transactions (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL,
  transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
  quantity INTEGER NOT NULL,
  reference VARCHAR(100),
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_product_id (product_id),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_created_at (created_at)
);
```

### 14.3 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  last_login TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active)
);
```

### 14.4 Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSON,
  new_values JSON,
  transaction_details JSON,
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_entity_type (entity_type),
  INDEX idx_created_at (created_at)
);
```

---

## 15. Implementation Checklist

### Authentication & Authorization
- [ ] Implement JWT token generation & validation
- [ ] Implement refresh token mechanism
- [ ] Implement Bearer token validation in middleware
- [ ] Implement role-based access control (RBAC)
- [ ] Implement rate limiting on login endpoint

### Products
- [ ] Implement GET /v1/products (with pagination, search, filter, sort)
- [ ] Implement GET /v1/products/{productId}
- [ ] Implement POST /v1/products (with file upload)
- [ ] Implement PUT /v1/products/{productId}
- [ ] Implement DELETE /v1/products/{productId} (archive)
- [ ] Implement GET /v1/products/check-sku/{sku} (optional)
- [ ] Validate stock tidak boleh diedit via update endpoint
- [ ] Auto-record semua changes ke audit log

### Stock Transactions
- [ ] Implement POST /v1/stock/in
- [ ] Implement POST /v1/stock/out (with stock availability check)
- [ ] Implement POST /v1/stock/adjustment (with reason validation)
- [ ] Implement GET /v1/stock/history/{productId}
- [ ] Implement stock calculation logic (SUM transactions)
- [ ] Auto-record semua transaksi ke audit log
- [ ] Validate: no archived products, no negative stock, etc

### Dashboard & Reports
- [ ] Implement GET /v1/dashboard/summary
- [ ] Implement GET /v1/reports/stock
- [ ] Implement GET /v1/reports/stock-movement
- [ ] Implement GET /v1/reports/inventory-value
- [ ] Implement GET /v1/reports/export (CSV/PDF)

### Users (Superadmin)
- [ ] Implement GET /v1/users
- [ ] Implement GET /v1/users/{userId}
- [ ] Implement POST /v1/users
- [ ] Implement PUT /v1/users/{userId}
- [ ] Implement DELETE /v1/users/{userId}
- [ ] Implement POST /v1/users/{userId}/reset-password

### Audit Logs
- [ ] Implement GET /v1/audit-logs
- [ ] Implement GET /v1/audit-logs/{auditLogId}
- [ ] Implement audit logging middleware (auto-record all changes)
- [ ] Implement permission filtering (Admin vs Superadmin)

### General
- [ ] Implement error handling with standard error codes
- [ ] Implement input validation
- [ ] Implement pagination, filtering, sorting
- [ ] Implement transaction ACID support
- [ ] Implement comprehensive logging
- [ ] Write API documentation
- [ ] Write unit & integration tests

---

## 16. Testing Strategy

### Unit Tests
- Authentication logic (JWT generation, validation)
- Stock calculation logic
- Validation rules
- Business logic (no negative stock, no archived product transaksi, dll)

### Integration Tests
- Full flow: create product → add stock → check current stock
- Stock transaction workflow
- Permission-based access
- Audit logging

### Performance Tests
- Stock calculation performance (target < 200ms)
- Report generation performance
- Pagination with large datasets

### Security Tests
- SQL injection prevention
- Token validation
- RBAC enforcement
- Password hashing

---

## 17. Deployment Checklist

- [ ] Environment variables configured (.env)
- [ ] Database migrations executed
- [ ] API documentation deployed
- [ ] SSL/HTTPS configured
- [ ] CORS configured for frontend
- [ ] Rate limiting configured
- [ ] Logging & monitoring setup
- [ ] Backup & disaster recovery plan
- [ ] Health check endpoint
- [ ] API versioning strategy

---

**Document Owner:** Backend Team Lead  
**Last Updated:** Desember 2025  
**Next Review:** Januari 2026  
**Status:** Final & Ready for Implementation
