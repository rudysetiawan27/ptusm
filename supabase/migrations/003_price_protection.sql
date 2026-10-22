-- =============================================================
-- Migrasi 003: Proteksi harga & stok di level database
-- Jalankan di Supabase SQL Editor.
-- =============================================================
--
-- Tujuan (PRD 12.1):
--   - anon / authenticated TIDAK bisa membaca kolom price & stock langsung
--     dari tabel products (termasuk lewat PostgREST select=*).
--   - Harga/stok hanya keluar lewat fungsi get_product_pricing() yang
--     memeriksa sesi + status perusahaan approved.
--
-- Idempotent: aman dijalankan berulang.

-- -------------------------------------------------------------
-- 1. Cabut akses kolom sensitif
-- -------------------------------------------------------------
revoke select on public.products from anon, authenticated;
revoke insert, update, delete on public.products from anon, authenticated;

-- Hanya kolom non-sensitif yang boleh dibaca langsung
grant select (
  id,
  sku,
  slug,
  category_id,
  status,
  unit,
  created_at,
  updated_at
) on public.products to anon, authenticated;

-- -------------------------------------------------------------
-- 2. Fungsi pricing: hanya untuk user dari perusahaan approved
-- -------------------------------------------------------------
create or replace function public.get_product_pricing(p_product_ids uuid[])
returns table (
  product_id uuid,
  price numeric,
  stock integer,
  unit text
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  -- Pengunjung tanpa sesi: tidak ada data
  if auth.uid() is null then
    return;
  end if;

  -- Harus anggota aktif dari perusahaan yang sudah approved
  if not exists (
    select 1
    from public.company_members m
    join public.companies c on c.id = m.company_id
    where m.user_id = auth.uid()
      and m.status = 'active'
      and c.status = 'approved'
  ) then
    return;
  end if;

  return query
    select p.id, p.price, p.stock, p.unit
    from public.products p
    where p.id = any(p_product_ids)
      and p.status = 'active';
end;
$$;

revoke all on function public.get_product_pricing(uuid[]) from public;
revoke all on function public.get_product_pricing(uuid[]) from anon;
grant execute on function public.get_product_pricing(uuid[]) to authenticated;

-- Muat ulang cache skema PostgREST agar perubahan grant langsung berlaku
notify pgrst, 'reload schema';

-- -------------------------------------------------------------
-- Verifikasi manual (opsional)
-- -------------------------------------------------------------
-- Sebagai anon, ini harus GAGAL:
--   select price from products limit 1;
-- Sebagai anon, ini harus BERHASIL tapi tanpa price/stock:
--   select id, sku, slug, unit from products limit 1;
-- RPC sebagai anon harus gagal (permission denied for function).
