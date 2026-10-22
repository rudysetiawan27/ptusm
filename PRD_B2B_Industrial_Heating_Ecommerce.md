# Product Requirements Document (PRD)

## B2B E-Commerce Website --- United Heater Equipment

**Versi:** 1.0\
**Status:** Draft awal untuk pengembangan bertahap\
**Bahasa dokumen:** Indonesia\
**Target penggunaan:** Lampiran konteks proyek untuk Cursor AI / IDE
berbasis AI

------------------------------------------------------------------------

## 1. Ringkasan Proyek

Membangun website e-commerce **B2B (business-to-business)** untuk
perusahaan yang menjual peralatan pemanas industri, seperti *infrared
heater*, *nozzle heater*, *cartridge heater*, *tubular heater*, dan
produk terkait.

Website harus membantu calon pelanggan menemukan produk dan
spesifikasinya, mengajukan akun perusahaan, lalu melakukan pemesanan
setelah akun disetujui. Harga dan informasi stok hanya boleh dilihat
oleh pengguna yang sudah login dan memiliki akun perusahaan yang
disetujui.

Website akan dikembangkan secara bertahap oleh pemula dengan bantuan
Cursor AI. Karena itu, perubahan harus kecil, mudah diuji, dan
dijelaskan. Jangan membangun seluruh fitur sekaligus.

### Tujuan bisnis

1.  Membuat katalog produk industri yang profesional dan mudah dicari.
2.  Mengumpulkan pendaftaran pelanggan perusahaan.
3.  Mengendalikan akses ke harga dan stok.
4.  Mendukung proses pemesanan, pembayaran, pengiriman, dan pengelolaan
    inventori.
5.  Menyediakan antarmuka Bahasa Indonesia dan Bahasa Inggris.
6.  Menyediakan panel admin untuk mengelola operasional toko.

### Kriteria keberhasilan awal

-   Website dapat dijalankan secara lokal dan dibuka melalui browser.
-   Halaman publik menampilkan katalog tanpa harga.
-   Pengguna dapat mendaftar dan mengajukan akun perusahaan.
-   Admin dapat menyetujui akun sebelum harga dibuka.
-   Setelah tahap backend selesai, pemesanan harus
    mengurangi/mengamankan stok secara konsisten.
-   Pembayaran dan ongkir dihitung melalui integrasi server-side, bukan
    nilai yang dipercaya dari browser.
-   Antarmuka responsif di desktop dan perangkat seluler.

------------------------------------------------------------------------

## 2. Prinsip Pengembangan

1.  **Bangun bertahap.** Selesaikan dan uji satu tahap sebelum
    melanjutkan ke tahap berikutnya.
2.  **Jangan mengarang hasil pengujian.** Jika build atau test belum
    dijalankan, nyatakan dengan jelas.
3.  **Jaga perubahan tetap terfokus.** Jangan mengganti seluruh struktur
    proyek jika tidak diperlukan.
4.  **Gunakan TypeScript** dan pertahankan tipe data yang jelas.
5.  **Pisahkan UI, data, dan logika bisnis.**
6.  **Jangan menambahkan dependency** kecuali diperlukan dan jelaskan
    alasannya.
7.  **Jangan memasukkan secret/API key ke kode frontend** atau commit ke
    Git.
8.  **Semua data contoh harus diberi label DEMO.** Jangan membuatnya
    terlihat sebagai data produk atau transaksi nyata.
9.  **Harga dan stok wajib dilindungi di server/database**, bukan
    sekadar disembunyikan menggunakan CSS atau kondisi tampilan.
10. **Tanyakan sebelum membuat keputusan yang berdampak besar** pada
    arsitektur, biaya layanan, keamanan, atau alur bisnis.
11. Setelah menyelesaikan setiap tahap, berikan ringkasan file yang
    berubah, cara menjalankan, cara menguji, dan hal yang belum
    dikerjakan.
12. Jika menemukan error, jelaskan penyebab dan perbaiki sebelum
    menambahkan fitur lain.

------------------------------------------------------------------------

## 3. Pengguna dan Hak Akses

### 3.1 Pengunjung

-   Melihat halaman utama, katalog, kategori, dan informasi produk
    publik.
-   Melakukan pencarian dan filter katalog.
-   Tidak dapat melihat harga atau stok.
-   Dapat mengajukan pendaftaran akun perusahaan.
-   Dapat login.

### 3.2 Pelanggan perusahaan

Akun pelanggan harus berstatus **approved** oleh admin agar dapat
mengakses harga dan melakukan pemesanan. - Melihat harga dan stok sesuai
hak akses. - Mengelola profil perusahaan dan alamat pengiriman. -
Menambahkan produk ke keranjang. - Membuat pesanan. - Melakukan
pembayaran. - Melihat status pesanan, pembayaran, dan pengiriman. -
Melihat riwayat pesanan.

### 3.3 Admin

-   Melihat ringkasan operasional.
-   Membuat, mengubah, dan menonaktifkan produk serta kategori.
-   Mengelola terjemahan, spesifikasi, dan gambar produk.
-   Mengelola stok dan riwayat pergerakan stok.
-   Meninjau dan menyetujui/menolak pendaftaran perusahaan.
-   Melihat dan mengelola pesanan, pembayaran, dan pengiriman.
-   Melihat laporan dasar.
-   Mengakses aktivitas audit sesuai hak akses.

### 3.4 Aturan otorisasi

-   Gunakan role dan status akun yang diverifikasi di server.
-   Jangan mempercayai role, status persetujuan, harga, diskon, atau
    total pesanan yang dikirim dari browser.
-   Pelanggan hanya boleh mengakses data perusahaan dan pesanan yang
    menjadi haknya.
-   Admin harus menggunakan pemeriksaan hak akses eksplisit.
-   Jangan membuat halaman admin sekadar disembunyikan dari navigasi;
    lindungi route dan operasi backend-nya.

------------------------------------------------------------------------

## 4. Ruang Lingkup Produk

### 4.1 MVP --- Prioritas P0

1.  Halaman publik berbahasa Indonesia dan Inggris.
2.  Katalog produk dan detail produk.
3.  Pencarian dan filter kategori.
4.  Registrasi pengguna/perusahaan.
5.  Login dan logout.
6.  Status persetujuan akun perusahaan oleh admin.
7.  Harga dan stok hanya tersedia bagi akun yang disetujui.
8.  Keranjang belanja.
9.  Checkout dan pembuatan pesanan.
10. Perhitungan ongkos kirim melalui layanan agregator/API.
11. Pembayaran melalui payment gateway.
12. Pengelolaan produk, stok, pelanggan, dan pesanan dari panel admin.
13. Riwayat status pembayaran dan pengiriman.
14. Pengamanan database dan API sesuai hak akses.
15. Tampilan responsif.

### 4.2 Setelah MVP --- Prioritas P1

-   Pembelian ulang dari riwayat pesanan.
-   Ekspor laporan dasar.
-   Notifikasi email untuk pendaftaran, persetujuan, pesanan, dan
    pembayaran.
-   Filter dan sortir katalog yang lebih lengkap.
-   Pengelolaan konten halaman informasi oleh admin.

### 4.3 Pengembangan lanjutan --- Prioritas P2

-   Harga kontrak khusus per perusahaan.
-   Termin pembayaran atau kredit pelanggan.
-   Multi-gudang.
-   Integrasi ERP/accounting.
-   Rekomendasi produk berbasis AI.
-   Permintaan quotation/RFQ dan negosiasi harga.
-   Persetujuan pesanan berjenjang untuk perusahaan besar.

Fitur P1/P2 tidak boleh menghambat penyelesaian MVP. Jangan membangun
fitur lanjutan sebelum fondasi MVP stabil.

------------------------------------------------------------------------

## 5. Sitemap dan Halaman

### 5.1 Halaman publik

-   `/` --- Beranda
-   `/products` --- Katalog produk
-   `/products/[slug]` --- Detail produk
-   `/categories/[slug]` --- Produk dalam kategori (opsional pada tahap
    awal)
-   `/about` --- Tentang perusahaan
-   `/contact` --- Kontak
-   `/login` --- Login
-   `/register` --- Pendaftaran akun perusahaan
-   `/privacy` --- Kebijakan privasi
-   `/terms` --- Syarat dan ketentuan

### 5.2 Area pelanggan

-   `/account` --- Ringkasan akun
-   `/account/profile` --- Profil pengguna/perusahaan
-   `/account/addresses` --- Alamat pengiriman
-   `/cart` --- Keranjang
-   `/checkout` --- Checkout
-   `/account/orders` --- Riwayat pesanan
-   `/account/orders/[id]` --- Detail pesanan
-   `/account/payments/[id]` --- Detail/status pembayaran jika
    diperlukan

### 5.3 Area admin

-   `/admin` --- Dashboard
-   `/admin/products` --- Daftar produk
-   `/admin/products/new` --- Tambah produk
-   `/admin/products/[id]` --- Edit produk
-   `/admin/categories` --- Kategori
-   `/admin/inventory` --- Stok dan pergerakan stok
-   `/admin/companies` --- Daftar perusahaan dan persetujuan akun
-   `/admin/orders` --- Daftar pesanan
-   `/admin/orders/[id]` --- Detail pesanan
-   `/admin/payments` --- Pembayaran/refund
-   `/admin/shipments` --- Pengiriman
-   `/admin/reports` --- Laporan
-   `/admin/settings` --- Pengaturan toko

Route di atas adalah rancangan awal; sesuaikan seperlunya dengan
implementasi tanpa menghilangkan kebutuhan bisnis utama.

------------------------------------------------------------------------

## 6. Alur Pengguna Utama

### 6.1 Pengunjung sampai menjadi pelanggan

1.  Pengunjung membuka beranda atau katalog.
2.  Pengunjung melihat nama, foto, kategori, dan ringkasan spesifikasi
    produk.
3.  Harga dan stok tidak ditampilkan.
4.  Pengunjung memilih tombol **Login untuk melihat harga** atau
    **Daftar sebagai perusahaan**.
5.  Pengunjung mengisi data pengguna dan perusahaan.
6.  Akun masuk status `pending`.
7.  Admin memeriksa data perusahaan dan menyetujui atau menolak
    pengajuan.
8.  Setelah disetujui, pelanggan login dan dapat mengakses harga/stok.

### 6.2 Pemesanan

1.  Pelanggan yang sudah disetujui membuka detail produk.
2.  Pelanggan melihat harga dan ketersediaan stok.
3.  Pelanggan memasukkan kuantitas dan menambahkannya ke keranjang.
4.  Sistem memvalidasi harga, status produk, dan stok dari server.
5.  Pelanggan memilih alamat pengiriman.
6.  Server meminta tarif pengiriman dari penyedia layanan.
7.  Pelanggan memilih opsi pengiriman.
8.  Server menghitung ulang subtotal, ongkir, pajak/biaya yang berlaku,
    diskon jika ada, dan total.
9.  Sistem membuat pesanan dan mengamankan stok dengan operasi database
    yang aman.
10. Sistem membuat transaksi pembayaran melalui payment gateway.
11. Payment gateway mengirim webhook ke server.
12. Server memverifikasi webhook dan memperbarui status pembayaran
    secara idempoten.
13. Pesanan diproses dan pengiriman dibuat setelah kondisi bisnis yang
    sesuai terpenuhi.
14. Pelanggan dapat memantau status pesanan.

### 6.3 Persetujuan perusahaan

-   Status minimum: `pending`, `approved`, `rejected`, `suspended`.
-   Hanya akun `approved` yang dapat mengakses harga/stok dan checkout.
-   Admin harus dapat melihat tanggal pendaftaran, informasi perusahaan,
    status, dan alasan penolakan.
-   Perubahan status harus dicatat dalam audit log.
-   Pengguna tidak boleh mengubah status persetujuannya sendiri.

------------------------------------------------------------------------

## 7. Persyaratan UI/UX dan Identitas Visual

### 7.1 Gaya desain

-   Profesional, industrial, rapi, dan terpercaya.
-   Prioritaskan kejelasan informasi teknis.
-   Hindari tampilan yang terlalu ramai, dekorasi berlebihan, atau gaya
    marketplace konsumen yang tidak sesuai untuk B2B.
-   Gunakan komponen yang konsisten dan aksesibel.

### 7.2 Palet warna awal

-   Navy: `#172B3A`
-   Orange: `#E87524`
-   Light gray: `#F3F5F7`
-   White: `#FFFFFF`

Warna dapat disesuaikan setelah logo/brand guideline perusahaan
tersedia. Jangan mengarang logo resmi; gunakan placeholder bertuliskan
nama sementara.

### 7.3 Tata letak

-   Header: logo placeholder, navigasi, pemilih bahasa ID/EN, tombol
    login/daftar.
-   Footer: kontak, tautan informasi, kebijakan, dan placeholder
    identitas perusahaan.
-   Katalog: grid kartu produk, pencarian, filter kategori, dan empty
    state.
-   Detail produk: foto, nama, SKU, kategori, ringkasan, spesifikasi,
    dokumen produk jika tersedia, dan CTA.
-   Area pelanggan/admin: navigasi yang mudah dipahami, status yang
    jelas, dan tabel yang dapat digunakan di layar kecil.
-   Gunakan loading, error, success, empty, dan unauthorized states yang
    jelas.

### 7.4 Responsivitas dan aksesibilitas

-   Mobile-first dan berfungsi pada ponsel, tablet, dan desktop.
-   Gunakan label pada input; jangan hanya mengandalkan placeholder.
-   Pastikan kontras teks memadai, fokus keyboard terlihat, dan tombol
    memiliki nama yang jelas.
-   Gambar harus memiliki alt text.
-   Hindari layout yang melebar keluar layar.

------------------------------------------------------------------------

## 8. Katalog dan Data Demo

### 8.1 Produk demo

Semua data berikut adalah contoh sementara dan harus diberi label
**DEMO**. Data tidak mewakili katalog, harga, atau stok perusahaan yang
sebenarnya.

1.  Ceramic Infrared Heater
2.  Nozzle Band Heater
3.  Cartridge Heater
4.  Tubular Heater

Setiap produk demo dapat memiliki: - ID dan slug - SKU dengan awalan
atau penanda `DEMO` - Nama dalam Bahasa Indonesia dan Bahasa Inggris -
Deskripsi pendek dan panjang dalam dua bahasa - Kategori - Gambar
placeholder yang relevan - Spesifikasi teknis sebagai pasangan
atribut/nilai - Harga demo untuk pengujian setelah login (bukan harga
publik) - Stok demo untuk pengujian setelah login - Status
aktif/nonaktif

### 8.2 Kartu produk publik

Tampilkan nama, gambar, kategori, ringkasan spesifikasi, dan SKU demo
bila sesuai. Jangan tampilkan angka harga, rentang harga, atau stok
untuk pengunjung yang belum memenuhi syarat. Tampilkan teks **"Login
untuk melihat harga"** / **"Log in to view pricing"**.

### 8.3 Data dan aset

-   Simpan data demo di file terpisah dari komponen UI pada tahap
    frontend awal.
-   Jangan menggunakan gambar berhak cipta tanpa izin.
-   Placeholder boleh digunakan selama tahap awal, tetapi tandai sebagai
    placeholder/demo.
-   Jangan menyamarkan data demo sebagai data produksi.

------------------------------------------------------------------------

## 9. Internasionalisasi (Indonesia dan Inggris)

-   Bahasa awal: Bahasa Indonesia.
-   Bahasa kedua: Bahasa Inggris.
-   Sediakan kontrol pemilih bahasa yang jelas.
-   Semua label navigasi, tombol, form, pesan validasi, status, empty
    state, dan pesan error yang terlihat pengguna harus diterjemahkan.
-   Data produk harus mendukung nama/deskripsi/spesifikasi yang berbeda
    per bahasa bila diperlukan.
-   Jangan hanya menerjemahkan navigasi sementara konten utama tetap
    satu bahasa.
-   Pilihan bahasa harus konsisten ketika pengguna berpindah halaman.
-   Pilih library i18n hanya setelah kebutuhan dan struktur routing
    ditinjau; jangan menambahkan dependency tanpa alasan.

------------------------------------------------------------------------

## 10. Rancangan Teknologi

### 10.1 Stack awal yang disarankan

-   **Frontend/full-stack:** Next.js App Router
-   **Bahasa:** TypeScript
-   **Styling:** Tailwind CSS
-   **Database, autentikasi, dan storage:** Supabase (direncanakan untuk
    tahap backend)
-   **Version control:** Git dan GitHub
-   **IDE:** Cursor
-   **Deployment:** ditentukan setelah MVP lokal stabil

Stack ini merupakan rekomendasi awal, bukan keharusan mutlak. Sebelum
mengganti stack, jelaskan dampaknya dan minta persetujuan.

### 10.2 Prinsip arsitektur

-   Gunakan Next.js App Router dan struktur `src/` jika proyek dibuat
    dengan opsi tersebut.
-   Pisahkan komponen UI, fitur/domain, validasi, akses data, dan
    konfigurasi.
-   Gunakan Server Components secara default; gunakan Client Components
    hanya jika interaksi browser memang diperlukan.
-   Validasi input di server.
-   Akses database dari server untuk operasi sensitif.
-   Jangan menaruh secret dalam variabel `NEXT_PUBLIC_*`.
-   Sediakan file `.env.example` berisi nama variabel tanpa nilai
    rahasia.
-   Jangan commit `.env.local`.
-   Hindari menghubungkan payment gateway atau shipping API sungguhan
    sebelum provider dan kredensialnya disepakati.

### 10.3 Variabel lingkungan

Nama variabel final menyesuaikan provider, tetapi secara umum: - URL dan
key Supabase yang memang digunakan di server/client sesuai model
keamanan provider. - Secret payment gateway. - Secret verifikasi webhook
payment gateway. - API key shipping aggregator. - Base URL aplikasi. -
Kunci layanan email jika kelak digunakan.

Jangan mencantumkan nilai kredensial asli dalam PRD, prompt, source
code, screenshot, atau commit Git.

------------------------------------------------------------------------

## 11. Model Data Awal

Model ini adalah rancangan konseptual dan dapat disempurnakan sebelum
migrasi database dibuat.

### 11.1 Identitas dan perusahaan

-   `profiles`: user ID, nama, nomor telepon, locale, timestamps.
-   `companies`: nama legal, nama dagang, nomor registrasi/pajak jika
    relevan, alamat, kontak, status persetujuan, alasan penolakan,
    timestamps.
-   `company_members`: hubungan pengguna dengan perusahaan, role dalam
    perusahaan, status.
-   `addresses`: alamat penagihan/pengiriman, penerima, nomor telepon,
    kode pos, negara, provinsi/kota, detail alamat.

### 11.2 Katalog

-   `categories`: slug, status, urutan.
-   `category_translations`: nama/deskripsi per bahasa jika dibutuhkan.
-   `products`: SKU, slug, kategori, status, satuan, metadata dasar.
-   `product_translations`: nama dan deskripsi per bahasa.
-   `product_attributes`: atribut teknis dan nilai dengan dukungan
    bahasa/unit.
-   `product_images`: URL/path, alt text, urutan, penanda utama.
-   Pertimbangkan tabel dokumen produk untuk PDF/datasheet pada tahap
    lanjutan.

### 11.3 Keranjang dan pesanan

-   `carts`: pemilik, status, timestamps.
-   `cart_items`: cart, produk, kuantitas.
-   `orders`: nomor pesanan, perusahaan/pelanggan, alamat snapshot, mata
    uang, subtotal, ongkir, pajak/biaya, diskon, total, status pesanan,
    status pembayaran, timestamps.
-   `order_items`: snapshot SKU, nama produk, spesifikasi/varian
    relevan, harga satuan saat order, kuantitas, subtotal.
-   `stock_reservations`: produk, pesanan, kuantitas, status, waktu
    kedaluwarsa.
-   `shipping_quotes`: penyedia, layanan, biaya, estimasi, payload
    relevan yang aman, masa berlaku.
-   `shipments`: nomor pelacakan, kurir, layanan, status, timestamps.

### 11.4 Pembayaran dan inventori

-   `payments`: pesanan, provider, ID transaksi provider, jumlah, mata
    uang, status, timestamps.
-   `payment_events`: ID event provider, jenis event, waktu diterima,
    hasil pemrosesan; simpan data minimum yang diperlukan.
-   `refunds`: pembayaran, jumlah, status, referensi provider.
-   `inventory`: produk/lokasi gudang, kuantitas tersedia dan/atau
    kuantitas yang dicadangkan.
-   `stock_movements`: produk, jenis pergerakan, kuantitas, referensi
    pesanan/penerimaan, aktor, waktu.
-   `audit_logs`: aktor, tindakan, objek, metadata minimum, waktu.
-   `store_settings`: pengaturan toko yang bukan rahasia.

### 11.5 Prinsip database

-   Gunakan foreign key, unique constraint, check constraint, dan index
    sesuai kebutuhan.
-   Simpan harga, mata uang, kuantitas, dan total dengan tipe numerik
    yang tepat; hindari floating point untuk perhitungan uang.
-   Snapshot data produk dan harga ke `order_items`, agar riwayat order
    tidak berubah saat produk diedit.
-   Gunakan transaksi database/operasi atomik untuk reservasi dan
    perubahan stok.
-   Terapkan Row Level Security (RLS) jika menggunakan Supabase.
-   Uji akses sebagai pengunjung, pelanggan pending, pelanggan approved,
    pelanggan dari perusahaan lain, dan admin.
-   Jangan pernah mengandalkan filter frontend sebagai satu-satunya
    kontrol akses.

------------------------------------------------------------------------

## 12. Aturan Bisnis Kritis

### 12.1 Perlindungan harga dan stok

-   Harga dan stok tidak boleh dikirim dalam response publik untuk
    pengunjung yang tidak berhak.
-   Jangan sekadar menyembunyikan elemen harga dengan CSS.
-   Server harus memeriksa autentikasi dan status persetujuan sebelum
    mengembalikan harga/stok.
-   Endpoint checkout harus menghitung ulang semua angka dari data
    server/database.
-   Jangan mempercayai harga atau total yang dikirim browser.

### 12.2 Inventori dan reservasi stok

-   Cegah overselling ketika dua pelanggan membeli produk yang sama
    secara bersamaan.
-   Reservasi stok harus atomik dan memiliki batas waktu jika pembayaran
    belum selesai.
-   Jika pembayaran gagal/kedaluwarsa, lepaskan reservasi sesuai aturan
    bisnis.
-   Semua perubahan stok harus dicatat dalam `stock_movements`.
-   Perubahan stok manual oleh admin harus mencatat alasan dan aktor.

### 12.3 Pembayaran

-   Pisahkan status pesanan dari status pembayaran.
-   Contoh status pembayaran: `pending`, `paid`, `failed`, `expired`,
    `cancelled`, `partially_refunded`, `refunded`.
-   Verifikasi signature/webhook dari provider di server.
-   Proses webhook harus idempoten: event yang sama tidak boleh
    menggandakan pembayaran atau perubahan stok.
-   Jangan menganggap pembayaran berhasil hanya karena browser kembali
    ke halaman sukses.
-   Jangan menyimpan data kartu pembayaran sensitif di aplikasi.

### 12.4 Pengiriman

-   Ambil tarif melalui API provider di server.
-   Validasi bahwa pilihan layanan masih berlaku saat checkout.
-   Jangan mempercayai ongkir yang dimodifikasi dari browser.
-   Simpan snapshot tarif dan layanan yang dipilih pada pesanan.
-   API shipping tidak boleh dipanggil dengan secret dari frontend.

### 12.5 Audit dan keamanan

-   Catat perubahan penting seperti persetujuan perusahaan, perubahan
    role, perubahan stok, pembatalan/refund, dan perubahan status
    pesanan.
-   Jangan menyimpan password dalam teks biasa.
-   Gunakan autentikasi dan otorisasi server-side.
-   Batasi data pribadi yang dicatat di log.
-   Tambahkan rate limiting/anti-abuse pada endpoint sensitif sebelum
    produksi.

------------------------------------------------------------------------

## 13. Panel Admin

### 13.1 Dashboard

Tampilkan ringkasan yang relevan, seperti: - Pesanan baru. - Pesanan
menunggu pembayaran. - Pesanan yang sedang diproses. - Permintaan
persetujuan perusahaan. - Produk dengan stok rendah. - Ringkasan
penjualan sesuai data yang tersedia.

Jika data masih demo, beri label DEMO dan jangan menyajikan angka
sebagai laporan nyata.

### 13.2 Pengelolaan produk

-   Tambah, edit, aktifkan/nonaktifkan produk.
-   Kelola SKU dan slug unik.
-   Kelola nama/deskripsi Indonesia dan Inggris.
-   Kelola kategori, gambar, spesifikasi, dan satuan.
-   Validasi field wajib dan cegah SKU/slug duplikat.

### 13.3 Persetujuan perusahaan

-   Tampilkan daftar akun `pending`.
-   Admin dapat membuka detail dan menyetujui/menolak.
-   Alasan penolakan disimpan jika tersedia.
-   Pengguna menerima status yang jelas.
-   Perubahan harus tercatat di audit log.

### 13.4 Inventori dan pesanan

-   Tampilkan stok saat ini dan histori perubahan.
-   Tampilkan detail pesanan, item, alamat snapshot, total, pembayaran,
    dan pengiriman.
-   Perubahan status hanya tersedia untuk role yang sesuai.
-   Jangan izinkan admin mengubah status pembayaran menjadi `paid` tanpa
    alur manual yang terkontrol dan tercatat.

------------------------------------------------------------------------

## 14. Validasi dan Penanganan Error

-   Semua form harus memiliki validasi client-side untuk kenyamanan dan
    server-side untuk keamanan.
-   Pesan error harus membantu pengguna tanpa membocorkan stack trace
    atau secret.
-   Tangani kondisi loading, data kosong, timeout API, kegagalan
    jaringan, dan kegagalan pembayaran.
-   Cegah submit ganda pada checkout dan aksi penting.
-   Tampilkan konfirmasi sebelum aksi admin yang berisiko.
-   Jangan menampilkan error internal database mentah ke pengguna.
-   Catat detail teknis di log server dengan aman, tanpa kredensial atau
    data sensitif yang tidak perlu.

------------------------------------------------------------------------

## 15. Pengujian dan Kriteria Penerimaan

### 15.1 Tahap UI awal

-   Beranda dapat dibuka.
-   Katalog menampilkan empat produk demo.
-   Pencarian dan filter kategori bekerja.
-   Detail produk dapat dibuka melalui slug.
-   Harga dan stok tidak ditampilkan pada halaman publik.
-   CTA login/daftar terlihat.
-   Pemilih bahasa dan navigasi terlihat.
-   Tampilan tetap layak pada ponsel dan desktop.
-   Tidak ada error TypeScript/build yang belum dijelaskan.
-   Tidak ada klaim pengujian berhasil tanpa benar-benar menjalankannya.

### 15.2 Tahap autentikasi dan persetujuan

-   Pengunjung tidak dapat mengakses harga/stok melalui endpoint atau
    query langsung.
-   Akun `pending` tidak dapat mengakses harga/stok.
-   Akun `approved` dapat mengakses harga/stok.
-   Pelanggan tidak dapat melihat profil/alamat/pesanan perusahaan lain.
-   Pengguna tidak dapat menaikkan role atau menyetujui dirinya sendiri.

### 15.3 Tahap checkout, stok, pembayaran

-   Harga dan total dihitung ulang di server.
-   Stok tidak dapat menjadi negatif akibat transaksi bersamaan.
-   Pembayaran sukses diverifikasi melalui webhook.
-   Webhook duplikat tidak menggandakan efek.
-   Pembayaran gagal/kedaluwarsa menangani reservasi stok dengan benar.
-   Ongkir divalidasi dan disimpan pada pesanan.
-   Pesanan menyimpan snapshot item dan harga.

### 15.4 Tahap sebelum produksi

-   Secret disimpan di environment yang aman.
-   RLS dan otorisasi diuji.
-   Backup dan prosedur pemulihan ditinjau.
-   Kebijakan privasi/syarat penggunaan ditinjau.
-   Integrasi gateway diuji pada mode sandbox.
-   Log, monitoring, dan penanganan error diperiksa.
-   Uji end-to-end alur pendaftaran hingga pesanan selesai.

------------------------------------------------------------------------

## 16. Tahapan Implementasi

### Tahap 0 --- Persiapan proyek

-   Pastikan Node.js LTS, npm, Git, dan Cursor tersedia.
-   Buat proyek Next.js dengan TypeScript, Tailwind, App Router, dan
    direktori `src/`.
-   Jalankan proyek lokal dan pastikan halaman default terbuka.
-   Inisialisasi Git dan buat commit awal bila repository sudah
    disiapkan.

**Selesai jika:** proyek berjalan lokal tanpa error.

### Tahap 1 --- UI katalog dengan data demo

-   Buat kerangka desain, header, footer, dan komponen dasar.
-   Buat halaman beranda, katalog, dan detail produk.
-   Buat file data demo terpisah.
-   Implementasikan pencarian/filter sederhana.
-   Sembunyikan harga/stok pada UI publik dan tampilkan CTA login.
-   Pastikan layout responsif.

**Selesai jika:** kriteria penerimaan UI awal lulus. Pada tahap ini,
penyembunyian harga hanya simulasi UI; belum boleh dianggap perlindungan
keamanan produksi.

### Tahap 2 --- Internasionalisasi

-   Lengkapi Bahasa Indonesia dan Bahasa Inggris.
-   Pastikan navigasi dan konten halaman dapat berganti bahasa.
-   Tambahkan terjemahan untuk form, error, dan empty state.

### Tahap 3 --- Database dan autentikasi

-   Siapkan Supabase project dan skema database awal.
-   Implementasikan registrasi/login/logout.
-   Buat profil dan data perusahaan.
-   Terapkan RLS dan uji hak akses.
-   Implementasikan persetujuan admin.

### Tahap 4 --- Katalog dinamis dan proteksi harga

-   Migrasikan data produk dari file demo ke database.
-   Implementasikan pengelolaan produk/kategori.
-   Lindungi harga dan stok di server.
-   Uji akun pengunjung, pending, approved, dan admin.

### Tahap 5 --- Keranjang dan checkout

-   Implementasikan keranjang.
-   Validasi produk aktif, harga, kuantitas, alamat, dan stok di server.
-   Buat order dan snapshot item.
-   Implementasikan reservasi stok atomik.

### Tahap 6 --- Pembayaran

-   Pilih payment gateway bersama pemilik bisnis.
-   Gunakan sandbox.
-   Implementasikan pembuatan transaksi dari server dan verifikasi
    webhook.
-   Uji sukses, gagal, kedaluwarsa, dan event duplikat.

### Tahap 7 --- Pengiriman

-   Pilih shipping aggregator/provider.
-   Implementasikan permintaan tarif server-side.
-   Simpan quote dan pilihan layanan ke pesanan.
-   Implementasikan nomor resi dan status pengiriman sesuai kemampuan
    provider.

### Tahap 8 --- Panel admin dan laporan

-   Selesaikan dashboard, produk, inventori, persetujuan perusahaan,
    pesanan, pembayaran, dan pengiriman.
-   Tambahkan laporan dasar.
-   Pastikan semua aksi admin terlindungi dan tercatat.

### Tahap 9 --- Uji, deployment, dan hardening

-   Jalankan build dan test.
-   Periksa konfigurasi environment.
-   Uji seluruh alur end-to-end.
-   Siapkan deployment, domain, monitoring, backup, dan dokumentasi
    operasional.

------------------------------------------------------------------------

## 17. Cara Cursor AI Harus Bekerja dengan PRD Ini

Saat menerima tugas pengembangan yang merujuk PRD ini, Cursor AI harus:

1.  Membaca struktur proyek dan file yang relevan sebelum mengubah kode.
2.  Menentukan tahap implementasi yang sedang dikerjakan.
3.  Mengimplementasikan **satu tahap kecil atau satu kelompok tugas
    terkait** saja.
4.  Tidak melompat ke payment gateway, shipping API, database produksi,
    atau fitur lanjutan tanpa instruksi dan keputusan provider.
5.  Menampilkan daftar file yang akan dibuat/diubah beserta tujuan
    utamanya.
6.  Mempertahankan pola dan dependensi proyek yang sudah ada bila
    memungkinkan.
7.  Menjalankan lint/build/test yang sesuai jika tersedia.
8.  Memperbaiki error yang muncul akibat perubahan.
9.  Melaporkan hasil aktual, bukan mengklaim bahwa sesuatu telah diuji
    jika belum.
10. Memberi instruksi pengujian manual yang mudah diikuti pemula.
11. Menandai TODO dan asumsi yang belum diputuskan.
12. Tidak menghapus data, konfigurasi, atau file penting tanpa alasan
    dan persetujuan.
13. Tidak menaruh secret atau kredensial nyata ke file kode.
14. Menjelaskan istilah teknis baru secara singkat saat relevan.

### Format laporan setelah setiap tahap

-   **Tujuan tahap**
-   **Yang diimplementasikan**
-   **File yang dibuat/diubah**
-   **Perintah yang dijalankan**
-   **Hasil build/test aktual**
-   **Cara menguji manual**
-   **Kekurangan atau TODO**
-   **Tahap berikutnya yang disarankan**

Jika permintaan pengguna bertentangan dengan PRD, jelaskan konflik dan
minta konfirmasi sebelum melakukan perubahan besar.

------------------------------------------------------------------------

## 18. Keputusan yang Belum Ditentukan

Hal-hal berikut harus dikonfirmasi sebelum implementasi terkait dimulai:

1.  Nama brand, logo, domain, alamat, dan informasi kontak perusahaan.
2.  Provider payment gateway yang akan digunakan.
3.  Provider shipping aggregator/API yang akan digunakan.
4.  Kebijakan pajak, mata uang, pembulatan, dan invoice.
5.  Aturan pembatalan pesanan, batas waktu pembayaran, refund, dan
    reservasi stok.
6.  Apakah harga sama untuk semua perusahaan atau dapat berbeda per
    pelanggan.
7.  Satuan minimum pembelian, MOQ, dan aturan kuantitas.
8.  Apakah produk dapat dibeli langsung atau memerlukan quotation untuk
    item tertentu.
9.  Kebijakan pendaftaran dan dokumen perusahaan yang wajib diunggah.
10. Provider email/notifikasi.
11. Hosting dan domain produksi.
12. Apakah katalog memerlukan datasheet, sertifikat, atau dokumen teknis
    yang dapat diunduh.

Jangan mengarang keputusan final untuk hal-hal di atas. Gunakan
placeholder atau data demo sampai keputusan dikonfirmasi.

------------------------------------------------------------------------

## 19. Definisi Selesai (Definition of Done)

Sebuah tahap dianggap selesai hanya jika: - Kriteria penerimaan untuk
tahap tersebut terpenuhi. - Perubahan kode terkait sudah diperiksa. -
Build/test yang relevan telah dijalankan atau keterbatasannya
dinyatakan. - Tidak ada error baru yang diketahui dan dibiarkan tanpa
penjelasan. - Instruksi menjalankan dan menguji tersedia. - Data demo
dan asumsi diberi label. - Keamanan tidak hanya diasumsikan dari
tampilan UI. - Tahap berikutnya tidak dimulai sebelum pengguna memahami
hasil dan menyetujui kelanjutannya.

------------------------------------------------------------------------

## 20. Instruksi Awal untuk Cursor

Mulailah dengan **Tahap 0 --- Persiapan proyek**. Periksa kondisi
workspace saat ini terlebih dahulu. Jangan langsung membuat seluruh
aplikasi. Jika proyek Next.js belum ada, berikan perintah setup yang
sesuai dengan sistem operasi dan jelaskan cara menjalankannya. Jika
proyek sudah ada, periksa struktur dan jangan menimpa file yang sudah
dibuat.

Setelah Tahap 0 selesai dan aplikasi dapat dijalankan, lanjutkan hanya
ke **Tahap 1 --- UI katalog dengan data demo**. Implementasikan halaman
`/`, `/products`, dan `/products/[slug]`, menggunakan empat produk demo
yang ditentukan dalam dokumen ini. Jangan mengimplementasikan database,
autentikasi nyata, checkout, payment gateway, atau shipping API pada
Tahap 1.

Sebelum mengubah file, ringkas rencana dan file yang kemungkinan
terdampak. Setelah selesai, laporkan perubahan dan hasil pemeriksaan
yang benar-benar dijalankan. Tunggu konfirmasi pengguna sebelum
melanjutkan ke tahap berikutnya.
