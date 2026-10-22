-- =============================================================
-- Migrasi 004: Keranjang & checkout atomik
-- Jalankan di Supabase SQL Editor setelah 003.
-- =============================================================
--
-- Tujuan (PRD 6.2, 12.1, 12.2):
--   - Satu cart aktif per user.
--   - Checkout membuat order + snapshot item + mengurangi stok +
--     mencatat stock_movements + stock_reservations dalam SATU transaksi.
--   - Harga selalu dihitung ulang dari tabel products (bukan dari browser).
--   - Lock baris produk (FOR UPDATE, urut id) mencegah overselling.
--
-- Idempotent: aman dijalankan berulang.

-- -------------------------------------------------------------
-- 0. Bersihkan cart aktif ganda (jika ada) sebelum unique index
-- -------------------------------------------------------------
with ranked as (
  select id,
         row_number() over (
           partition by user_id
           order by created_at desc, id
         ) as rn
  from public.carts
  where status = 'active'
)
update public.carts c
set status = 'abandoned'
from ranked r
where c.id = r.id
  and r.rn > 1;

create unique index if not exists carts_one_active_per_user
  on public.carts (user_id)
  where status = 'active';

-- -------------------------------------------------------------
-- 1. RPC checkout
-- -------------------------------------------------------------
create or replace function public.create_order_from_cart(
  p_shipping_address jsonb,
  p_notes text default null
)
returns table (
  order_id uuid,
  order_number text,
  subtotal numeric,
  total numeric
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_company uuid;
  v_cart uuid;
  v_subtotal numeric(12, 2) := 0;
  v_order_id uuid;
  v_order_number text;
  v_item record;
  v_count integer := 0;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  -- Hanya anggota aktif perusahaan approved yang boleh checkout
  select c.id into v_company
  from public.company_members m
  join public.companies c on c.id = m.company_id
  where m.user_id = v_uid
    and m.status = 'active'
    and c.status = 'approved'
  limit 1;

  if v_company is null then
    raise exception 'COMPANY_NOT_APPROVED';
  end if;

  -- Validasi alamat minimum
  if p_shipping_address is null
     or coalesce(p_shipping_address ->> 'name', '') = ''
     or coalesce(p_shipping_address ->> 'phone', '') = ''
     or coalesce(p_shipping_address ->> 'address', '') = ''
     or coalesce(p_shipping_address ->> 'city', '') = '' then
    raise exception 'INVALID_ADDRESS';
  end if;

  if length(coalesce(p_notes, '')) > 1000 then
    raise exception 'NOTES_TOO_LONG';
  end if;

  select id into v_cart
  from public.carts
  where user_id = v_uid
    and status = 'active'
  order by created_at desc
  limit 1;

  if v_cart is null then
    raise exception 'CART_EMPTY';
  end if;

  -- Kunci semua produk dalam cart dengan urutan tetap (hindari deadlock)
  perform 1
  from public.products p
  join public.cart_items ci on ci.product_id = p.id
  where ci.cart_id = v_cart
  order by p.id
  for update of p;

  -- Validasi stok & status, hitung subtotal dari harga database
  for v_item in
    select
      ci.product_id,
      ci.quantity,
      p.sku,
      p.status,
      p.price,
      p.stock,
      coalesce(pt.name, p.sku) as product_name
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    left join public.product_translations pt
      on pt.product_id = p.id and pt.locale = 'id'
    where ci.cart_id = v_cart
  loop
    v_count := v_count + 1;

    if v_item.status <> 'active' then
      raise exception 'PRODUCT_NOT_ACTIVE:%', v_item.sku;
    end if;

    if v_item.quantity > v_item.stock then
      raise exception 'INSUFFICIENT_STOCK:%', v_item.sku;
    end if;

    v_subtotal := v_subtotal + (v_item.price * v_item.quantity);
  end loop;

  if v_count = 0 then
    raise exception 'CART_EMPTY';
  end if;

  v_order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.orders (
    order_number,
    company_id,
    user_id,
    shipping_address,
    currency,
    subtotal,
    shipping_cost,
    tax,
    discount,
    total,
    order_status,
    payment_status,
    notes
  ) values (
    v_order_number,
    v_company,
    v_uid,
    p_shipping_address,
    'IDR',
    v_subtotal,
    0,
    0,
    0,
    v_subtotal,
    'pending',
    'pending',
    nullif(trim(coalesce(p_notes, '')), '')
  )
  returning id into v_order_id;

  -- Snapshot item + kurangi stok + catat pergerakan + reservasi
  for v_item in
    select
      ci.product_id,
      ci.quantity,
      p.sku,
      p.price,
      coalesce(pt.name, p.sku) as product_name
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    left join public.product_translations pt
      on pt.product_id = p.id and pt.locale = 'id'
    where ci.cart_id = v_cart
  loop
    insert into public.order_items (
      order_id,
      product_id,
      sku,
      product_name,
      unit_price,
      quantity,
      subtotal
    ) values (
      v_order_id,
      v_item.product_id,
      v_item.sku,
      v_item.product_name,
      v_item.price,
      v_item.quantity,
      v_item.price * v_item.quantity
    );

    update public.products
    set stock = stock - v_item.quantity
    where id = v_item.product_id;

    insert into public.stock_movements (
      product_id,
      movement_type,
      quantity,
      reference_id,
      reference_type,
      notes,
      created_by
    ) values (
      v_item.product_id,
      'out',
      v_item.quantity,
      v_order_id,
      'order',
      'Checkout ' || v_order_number,
      v_uid
    );

    insert into public.stock_reservations (
      product_id,
      order_id,
      quantity,
      status,
      expires_at
    ) values (
      v_item.product_id,
      v_order_id,
      v_item.quantity,
      'reserved',
      now() + interval '24 hours'
    );
  end loop;

  delete from public.cart_items where cart_id = v_cart;
  update public.carts set status = 'converted' where id = v_cart;

  insert into public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    changes
  ) values (
    v_uid,
    'order.created',
    'orders',
    v_order_id,
    jsonb_build_object(
      'order_number', v_order_number,
      'subtotal', v_subtotal,
      'items', v_count
    )
  );

  return query select v_order_id, v_order_number, v_subtotal, v_subtotal;
end;
$$;

revoke all on function public.create_order_from_cart(jsonb, text) from public;
revoke all on function public.create_order_from_cart(jsonb, text) from anon;
grant execute on function public.create_order_from_cart(jsonb, text) to authenticated;

notify pgrst, 'reload schema';

-- -------------------------------------------------------------
-- Verifikasi manual
-- -------------------------------------------------------------
-- 1. Tambah item ke cart dulu (lewat aplikasi).
-- 2. Jalankan sebagai user approved:
--    select * from public.create_order_from_cart(
--      '{"name":"QA","phone":"0812","address":"Jl. X","city":"Jakarta"}'::jsonb,
--      'tes'
--    );
-- 3. Cek stok berkurang, order_items terisi, stock_movements & reservations ada.
