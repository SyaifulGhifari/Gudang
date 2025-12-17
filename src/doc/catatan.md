1. Kamu sudah benar di bagian Key Implementation Notes, tapi masih ada sisa-sisa konsep lama di bagian lain.

Contoh yang perlu kamu ubah:

Di Product Table masih tertulis

Current Stock (real-time calculation)

❌ Ini harus diubah.
Karena di bawah kamu sendiri sudah menegaskan tidak ada real-time dan tidak ada kalkulasi frontend.

✔️ Ganti menjadi:

Current Stock (computed field from backend)

Di SKU unique validation tertulis real-time validation
Ini masih oke kalau maksudnya onBlur / async check, tapi sebaiknya ganti istilahnya jadi:

async validation
supaya tidak berbenturan dengan keputusan “no real-time”.

Di Development Checklist – Phase 3 masih ada:

Real-time stock calculation logic

❌ Ini harus DIHAPUS atau DIGANTI.
Karena ini bertentangan langsung dengan pasal 16.1.

✔️ Ganti jadi:

Display current_stock from backend & manual refresh handling

Kalau ini tidak dirapikan, developer lain bisa bingung:
“Ini real-time atau tidak?”
“Frontend hitung atau backend?”

2. Di dokumen ini kamu pakai:

Zustand store

SWR

Custom useApi hook

Secara teknis boleh, tapi sebagai senior saya akan memberi catatan:

Jangan sampai terlalu banyak abstraction tumpang tindih.

Idealnya pilih satu pendekatan utama:

Kalau pakai SWR / React Query, biarkan mereka handle fetching & cache

Zustand fokus ke UI state / selected entity, bukan data fetching berat

Ini bukan kesalahan, tapi area yang bisa disederhanakan supaya tidak overengineering.

3. Apakah perlu dokumen ini diubah besar-besaran?

❌ Tidak.
✔️ Cukup revisi kecil (v1.1).

Yang kamu perlu lakukan:

Bersihkan semua kata real-time

Samakan istilah “computed from backend”

Perbaiki checklist agar konsisten

(Opsional) sederhanakan strategi state management

Setelah itu, dokumen ini benar-benar matang.