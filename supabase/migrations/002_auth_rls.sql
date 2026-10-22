-- =============================================================
-- Migrasi 002: Policy RLS untuk alur autentikasi & keanggotaan
-- Jalankan di Supabase SQL Editor (project D:\Rudy\ptusm\tes-ptusm)
-- =============================================================
--
-- Kenapa perlu:
--   schema.sql tidak mendefinisikan policy apa pun untuk company_members.
--   Akibatnya policy "Users can view their companies" (yang berisi subquery
--   ke company_members) selalu menghasilkan kosong -> user tidak bisa
--   membaca perusahaannya sendiri lewat anon key.
--
-- Idempotent: aman dijalankan lebih dari sekali.

-- 1. User boleh membaca baris keanggotaannya sendiri
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'company_members'
      and policyname = 'Users can view own memberships'
  ) then
    create policy "Users can view own memberships"
      on public.company_members
      for select
      using (user_id = auth.uid());
  end if;
end $$;

-- 2. User boleh membuat profilnya sendiri setelah sign up
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can insert own profile'
  ) then
    create policy "Users can insert own profile"
      on public.profiles
      for insert
      with check (auth.uid() = id);
  end if;
end $$;

-- 3. Owner perusahaan boleh mengubah data perusahaannya
--    (sudah ada di schema.sql, ditulis ulang sebagai guard bila schema
--     dijalankan ulang tanpa policy tersebut)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'companies'
      and policyname = 'Company owners can update'
  ) then
    create policy "Company owners can update"
      on public.companies
      for update
      using (
        exists (
          select 1 from public.company_members m
          where m.company_id = companies.id
            and m.user_id = auth.uid()
            and m.role = 'owner'
            and m.status = 'active'
        )
      );
  end if;
end $$;

-- Verifikasi
-- select tablename, policyname from pg_policies
-- where schemaname = 'public' and tablename in ('company_members','profiles','companies');
