# Setup Supabase - Tahap 3

## Langkah 1: Buat Database Tables

1. Buka Supabase Dashboard → SQL Editor
2. Copy seluruh konten dari file `supabase/schema.sql`
3. Paste ke SQL Editor
4. Klik "Run" untuk execute

**Catatan:** Script akan membuat:
- 20+ tables untuk users, products, orders, payments, dll
- Row Level Security (RLS) policies
- Indexes untuk performa
- Triggers untuk auto-update timestamps

## Langkah 2: Setup Environment Variables

1. Copy `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Buka Supabase Dashboard → Settings → API

3. Copy nilai berikut ke `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

4. Set URL aplikasi:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Set admin sementara (server-only, tanpa prefix `NEXT_PUBLIC_`):
   ```
   ADMIN_EMAILS=email-anda@domain.com
   ```
   Bisa lebih dari satu, pisahkan dengan koma. Email di daftar ini yang bisa
   membuka `/{locale}/admin/companies` dan menyetujui/menolak perusahaan.

   **Catatan:** ini allowlist sementara di level env. Kolom `role` +
   policy RLS berbasis role akan menggantikannya pada tahap berikutnya.

6. Restart dev server setelah mengubah `.env.local`.

## Langkah 3: Jalankan Migrasi Policy RLS & Proteksi Harga

Setelah `schema.sql`, jalankan juga file migrasi berikut **berurutan** di
Supabase SQL Editor:

1. `supabase/migrations/002_auth_rls.sql`
   - user boleh membaca baris `company_members` miliknya sendiri
   - user boleh membuat baris `profiles` miliknya sendiri

2. `supabase/migrations/003_price_protection.sql`
   - mencabut akses kolom `price` & `stock` pada tabel `products` untuk
     role `anon` dan `authenticated`
   - hanya menyisakan kolom non-sensitif (id, sku, slug, kategori, unit,
     status)
   - membuat RPC `get_product_pricing(uuid[])` yang hanya mengembalikan
     harga/stok bila user adalah anggota aktif perusahaan berstatus
     `approved`

3. `supabase/migrations/004_cart_checkout.sql`
   - unique index satu cart aktif per user
   - RPC `create_order_from_cart(jsonb, text)` yang membuat order,
     snapshot `order_items`, mengurangi stok, mencatat `stock_movements`
     dan `stock_reservations` dalam satu transaksi
   - mengunci baris produk (`FOR UPDATE`, urut id) untuk mencegah
     overselling saat checkout bersamaan

4. `supabase/migrations/005_midtrans_payments.sql`
   - kolom `provider_order_id`, `snap_token`, `snap_redirect_url`,
     `notification_payload` pada `payments`
   - unique index idempotensi event webhook
   - RPC `apply_payment_notification(...)` yang memperbarui payment,
     order, reservasi, dan stok secara atomik

5. `supabase/migrations/006_product_images_storage.sql`
   - membuat bucket publik `product-images` (maks. 5 MB, PNG/JPG/WebP/GIF)
   - policy baca publik untuk objek bucket tersebut
   - upload dilakukan server-side memakai service role, sehingga tidak
     perlu policy insert/update untuk anon/authenticated

Tanpa migrasi 002, query `companies` dari user biasa akan selalu kosong
karena policy-nya memakai subquery ke `company_members` yang terkena RLS.

Tanpa migrasi 003, aplikasi tetap berjalan (memakai fallback service-role
di server) tetapi **harga masih bisa dibaca langsung lewat REST API**
dengan anon key. Jalankan migrasi ini sebelum menganggap harga terlindungi.

## Langkah 4: Seed Demo Data (Optional)

Untuk testing, Anda bisa menggunakan script seed di `supabase/seed.sql` (akan dibuat di langkah berikutnya).

## Langkah 5: Test Connection

Jalankan aplikasi dan test koneksi:
```bash
npm run dev
```

Buka `/{locale}/test-connection` untuk memastikan koneksi Supabase berhasil.

## Alur Autentikasi (Tahap 3 Part 2)

- **Registrasi** → `POST /api/auth/register` membuat user auth (langsung
  terkonfirmasi, khusus lingkungan dev), profil, perusahaan berstatus
  `pending`, dan keanggotaan `owner`.
- **Login** → `signInWithPassword` di browser (cookie sesi dikelola
  `@supabase/ssr`), lalu diarahkan ke `/{locale}/account`.
- **Status perusahaan** → `GET /api/me` mengembalikan status perusahaan
  yang sedang login.
- **Approval admin** → `POST /api/admin/companies` (approve/reject),
  diverifikasi di server lewat `ADMIN_EMAILS` + sesi Supabase, dan
  dicatat ke `audit_logs`.
- **Harga** → lihat bagian "Katalog & Proteksi Harga" di bawah.

## Katalog & Proteksi Harga (Tahap 4)

**Sumber data**
- Katalog tidak lagi memakai `src/data/products.ts` (file itu sudah
  dikosongkan). Semua data produk dibaca dari Supabase lewat
  `src/lib/catalog.ts`.
- Halaman `/`, `/products`, dan `/products/[slug]` adalah server
  component. Harga dihitung di server, bukan di browser.

**Alur harga**
1. `getCatalog()` mengambil produk **tanpa** kolom `price`/`stock`.
2. `getPricingMap()` memanggil RPC `get_product_pricing()` dengan sesi
   user. Database memeriksa `company_members` + `companies.status`.
3. Hanya bila perusahaan `approved`, harga/stok ikut dikirim ke halaman.
   Selain itu `price`/`stock` bernilai `null` dan UI menampilkan CTA login.
4. Bila migrasi 003 belum dijalankan, server memakai fallback service-role
   yang tetap di-gate oleh `isApproved` (muncul peringatan di log server).
   Fallback ini hanya pengaman agar aplikasi tetap jalan — bukan proteksi
   database.

**Panel admin**
- `/{locale}/admin/products` — daftar produk (harga & stok terlihat karena
  memakai service role), tambah/ubah/hapus.
- `/{locale}/admin/categories` — tambah/ubah kategori.
- Semua endpoint `/api/admin/*` memverifikasi sesi + `ADMIN_EMAILS`
  di server; non-admin mendapat 403 (API) atau 404 (halaman).

**Verifikasi cepat proteksi**
```bash
# 1. Harga tidak boleh muncul untuk anon pada HTML
curl -s http://localhost:3000/id/products | grep "1.500.000"   # harus kosong

# 2. Setelah migrasi 003, REST langsung harus gagal untuk price
curl -s "https://<project>.supabase.co/rest/v1/products?select=price" \
  -H "apikey: <ANON_KEY>"                                      # error permission denied

# 3. RPC tanpa sesi harus gagal
```
Catatan: admin (staff) tetap melihat harga di panel admin, tetapi katalog
publik tetap mensyaratkan perusahaan `approved`.

## Keranjang & Checkout (Tahap 5)

**Alur**
1. User approved menambah produk dari halaman detail (`AddToCart`) →
   `POST /api/cart`. Server memeriksa sesi, status perusahaan, status
   produk, dan stok.
2. `/cart` menampilkan item + subtotal. Ubah jumlah (`PUT /api/cart`) dan
   hapus (`DELETE /api/cart`) juga divalidasi ke stok di server.
3. `/checkout` mengirim alamat ke `POST /api/checkout`.
4. API memanggil RPC `create_order_from_cart()` dengan **sesi user**
   (bukan service role), sehingga `auth.uid()` diverifikasi database.

**Jaminan server-side (PRD 12.1 & 12.2)**
- Harga dan total **tidak** diambil dari browser. RPC menghitung ulang
  `price × quantity` dari tabel `products`.
- Stok dikunci dengan `SELECT ... FOR UPDATE` (urut `id` agar tidak
  deadlock), lalu diperiksa ulang sebelum order dibuat.
- Order + `order_items` (snapshot SKU, nama, harga) + pengurangan stok +
  `stock_movements` + `stock_reservations` dibuat dalam **satu transaksi**.
- Reservasi punya `expires_at` 24 jam. Pelepasan otomatis saat
  pembayaran gagal/kedaluwarsa dikerjakan pada Tahap 6 (payment webhook).
- Submit ganda aman: cart diubah ke status `converted` di transaksi yang
  sama, sehingga panggilan kedua mendapat `CART_EMPTY`.

**Halaman**
- `/{locale}/cart`, `/{locale}/checkout`
- `/{locale}/orders` (riwayat per company) dan
  `/{locale}/orders/{orderNumber}` (detail + snapshot alamat & item)

**Jika migrasi 004 belum dijalankan**
Checkout akan mengembalikan pesan "Fitur checkout belum aktif di
database" (kode `MIGRATION_MISSING`); keranjang tetap bisa dipakai.

## Pembayaran Midtrans (Tahap 6)

**Setup sandbox**
1. Daftar/masuk ke `https://dashboard.sandbox.midtrans.com`.
2. Buka **Settings → Access Keys**, salin **Server Key** (sandbox).
3. Tambahkan ke `.env.local` (jangan commit):
   ```env
   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxx
   MIDTRANS_IS_PRODUCTION=false
   ```
4. Restart `npm run dev`.
5. Set **Payment Notification URL** di dashboard Midtrans ke
   `https://<domain-publik>/api/payments/midtrans/webhook`.
   Untuk lokal gunakan ngrok/cloudflared. Untuk pengujian lokal, webhook
   juga bisa disimulasikan dengan POST bertanda tangan.

**Alur**
1. Detail pesanan menampilkan tombol **Bayar Sekarang** (status
   `pending`/`failed`/`expired`).
2. `POST /api/payments/midtrans/create` memverifikasi sesi + company,
   membuat baris `payments` (status `pending`), lalu memanggil Snap.
   Browser diarahkan ke `redirect_url` Midtrans.
3. Midtrans mengirim notifikasi ke `/api/payments/midtrans/webhook`.
4. Server memverifikasi `signature_key` (SHA512 dari
   `order_id + status_code + gross_amount + server_key`), lalu memanggil
   RPC `apply_payment_notification` secara atomik.

**Jaminan**
- `gross_amount` harus sama dengan nominal yang tercatat; jika tidak,
  `AMOUNT_MISMATCH` dan status tidak berubah.
- Event duplikat ditolak unique index `(provider, provider_event_id)`
  → `DUPLICATE_EVENT`; pembayaran/stok tidak berubah dua kali.
- `settlement` / `capture(accept)` → `paid`, reservasi `confirmed`,
  order `confirmed`.
- `deny` / `cancel` / `expire` → stok dikembalikan, reservasi
  `released`, `stock_movements` tipe `in` dicatat, order `cancelled`.
- Pembayaran yang masuk setelah reservasi dilepas ditolak
  (`RESERVATION_ALREADY_RELEASED`) untuk mencegah oversell.
- Data kartu tidak pernah menyentuh aplikasi; Snap menanganinya.

**Uji lokal**
- Gunakan kartu uji sandbox dari dokumentasi Midtrans
  (mis. `4811 1111 1111 1114`).
- Simulasi notifikasi: POST JSON dengan `signature_key` yang dihitung
  dari server key sandbox. Kirim body yang sama dua kali untuk menguji
  idempotensi.

## Foto Produk (Storage)

- Admin dapat mengunggah foto dari form tambah/ubah produk
  (`/{locale}/admin/products`).
- File dikirim ke `POST /api/admin/products/image`, divalidasi di server
  (maks. 5 MB; PNG/JPG/WebP/GIF), lalu diunggah ke bucket
  `product-images` memakai service role.
- URL publik disimpan di tabel `product_images` sebagai gambar utama
  (`is_primary = true`). Menghapus foto di form akan menghapus baris
  `product_images` produk tersebut.
- `next.config.ts` mengizinkan host `*.supabase.co` dengan path
  `/storage/v1/object/public/**` agar `next/image` dapat mengoptimasi foto.
- URL foto yang diterima API dibatasi ke bucket `product-images` milik
  project Supabase ini (atau `placehold.co` untuk data demo).

**Jika upload gagal `BUCKET_MISSING`**
- Jalankan `supabase/migrations/006_product_images_storage.sql`, lalu
  restart dev server.

## Troubleshooting

**Error: Invalid API key**
- Pastikan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah benar
- Restart dev server setelah update .env.local

**Error: relation does not exist**
- Pastikan schema.sql sudah di-run di Supabase SQL Editor
- Check di Supabase Dashboard → Database → Tables

**RLS Error: permission denied**
- Ini normal untuk data yang belum ada policy
- Admin operations perlu service role key

**Pembayaran: `PAYMENT_NOT_CONFIGURED`**
- `MIDTRANS_SERVER_KEY` belum diisi atau server belum di-restart.

**Midtrans menolak pembuatan Snap**
- Pastikan key yang dipakai adalah Server Key sandbox saat
  `MIDTRANS_IS_PRODUCTION=false`.
- Cek `NEXT_PUBLIC_APP_URL` (dipakai untuk URL kembali dari Snap).

**Webhook: `MIGRATION_MISSING`**
- Jalankan `supabase/migrations/005_midtrans_payments.sql`.

## Next Steps

Setelah database siap:
1. Test signup/login
2. Test company registration
3. Test admin approval flow
