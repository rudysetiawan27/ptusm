-- =============================================================
-- Migrasi 006: Storage foto produk
-- Jalankan di Supabase SQL Editor setelah 005.
-- =============================================================
--
-- Membuat bucket publik `product-images` untuk foto produk.
-- Upload dilakukan server-side memakai service role (bypass RLS),
-- sehingga tidak perlu policy insert untuk anon/authenticated.
--
-- Idempotent: aman dijalankan berulang.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Bucket publik: izinkan baca objek tanpa login.
drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

notify pgrst, 'reload schema';

-- Verifikasi:
-- select id, public, file_size_limit, allowed_mime_types
-- from storage.buckets where id = 'product-images';
