-- =============================================================
-- Migrasi 005: Pembayaran Midtrans (Snap) + webhook idempoten
-- Jalankan di Supabase SQL Editor setelah 004.
-- =============================================================
--
-- Tujuan (PRD 6.2, 12.3, 15.3):
--   - Menyimpan percobaan pembayaran (Snap) per order.
--   - Memproses notifikasi Midtrans secara atomik & idempoten.
--   - Pembayaran sukses  -> reservasi dikonfirmasi.
--   - Gagal/kedaluwarsa  -> stok dikembalikan + reservasi dilepas,
--     dan semuanya dicatat di stock_movements.
--   - Event duplikat tidak menggandakan efek.
--
-- Idempotent: aman dijalankan berulang.

-- -------------------------------------------------------------
-- 1. Kolom tambahan
-- -------------------------------------------------------------
alter table public.payments
  add column if not exists provider_order_id text,
  add column if not exists snap_token text,
  add column if not exists snap_redirect_url text,
  add column if not exists notification_payload jsonb;

alter table public.payment_events
  add column if not exists provider text;

-- Satu baris payment per order_id Midtrans
create unique index if not exists payments_provider_order_unique
  on public.payments (provider, provider_order_id)
  where provider_order_id is not null;

-- Kunci idempotensi event webhook
create unique index if not exists payment_events_provider_event_unique
  on public.payment_events (provider, provider_event_id)
  where provider_event_id is not null;

-- payments.status perlu mendukung 'refunded'
alter table public.payments drop constraint if exists payments_status_check;
alter table public.payments
  add constraint payments_status_check
  check (status in ('pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded'));

-- -------------------------------------------------------------
-- 2. RPC pemroses notifikasi pembayaran
-- -------------------------------------------------------------
create or replace function public.apply_payment_notification(
  p_provider text,
  p_provider_order_id text,
  p_provider_transaction_id text,
  p_payment_status text,
  p_order_status text,
  p_payment_method text,
  p_event_id text,
  p_gross_amount numeric,
  p_raw jsonb
)
returns table (
  payment_id uuid,
  order_id uuid,
  applied boolean,
  reason text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_payment public.payments%rowtype;
  v_order public.orders%rowtype;
  v_event uuid;
  v_res record;
  v_order_payment_status text;
  v_released integer := 0;
begin
  if p_event_id is null or p_event_id = '' then
    raise exception 'INVALID_EVENT_ID';
  end if;

  if p_payment_status not in
     ('pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded') then
    raise exception 'INVALID_PAYMENT_STATUS';
  end if;

  select * into v_payment
  from public.payments
  where provider = p_provider
    and provider_order_id = p_provider_order_id
  for update;

  if not found then
    return query select null::uuid, null::uuid, false, 'PAYMENT_NOT_FOUND';
    return;
  end if;

  -- Idempotensi: event yang sama (hash body) tidak diproses dua kali.
  begin
    insert into public.payment_events (
      payment_id, provider, provider_event_id, event_type, payload, processed
    ) values (
      v_payment.id, p_provider, p_event_id, p_payment_status, p_raw, false
    )
    returning id into v_event;
  exception when unique_violation then
    return query select v_payment.id, v_payment.order_id, false, 'DUPLICATE_EVENT';
    return;
  end;

  select * into v_order
  from public.orders
  where id = v_payment.order_id
  for update;

  -- Jangan menurunkan status order yang sudah lunas (kecuali refund).
  if v_order.payment_status = 'paid'
     and p_payment_status not in ('paid', 'refunded') then
    update public.payment_events set processed = true where id = v_event;
    return query select v_payment.id, v_order.id, false, 'ALREADY_PAID';
    return;
  end if;

  -- Nominal harus sama dengan yang tercatat saat membuat transaksi.
  if p_payment_status = 'paid'
     and p_gross_amount is distinct from v_payment.amount then
    raise exception 'AMOUNT_MISMATCH';
  end if;

  -- Pembayaran masuk setelah stok dilepas = risiko oversell; tolak.
  if p_payment_status = 'paid'
     and exists (
       select 1 from public.stock_reservations
       where order_id = v_order.id and status = 'released'
     ) then
    raise exception 'RESERVATION_ALREADY_RELEASED';
  end if;

  v_order_payment_status :=
    case when p_payment_status = 'cancelled' then 'failed'
         else p_payment_status end;

  update public.payments
  set status = p_payment_status,
      provider_transaction_id =
        coalesce(nullif(p_provider_transaction_id, ''), provider_transaction_id),
      payment_method = coalesce(nullif(p_payment_method, ''), payment_method),
      paid_at = case when p_payment_status = 'paid'
                     then coalesce(paid_at, now()) else paid_at end,
      notification_payload = p_raw
  where id = v_payment.id;

  update public.orders
  set payment_status = v_order_payment_status,
      order_status = case
        when p_order_status is not null and p_order_status <> ''
          then p_order_status
        else order_status
      end,
      updated_at = now()
  where id = v_order.id;

  if p_payment_status = 'paid' then
    update public.stock_reservations
    set status = 'confirmed'
    where order_id = v_order.id and status = 'reserved';

    update public.orders
    set order_status = 'confirmed'
    where id = v_order.id and order_status = 'pending';
  elsif p_payment_status in ('failed', 'expired', 'cancelled') then
    for v_res in
      select id, product_id, quantity
      from public.stock_reservations
      where order_id = v_order.id and status = 'reserved'
      for update
    loop
      update public.products
      set stock = stock + v_res.quantity
      where id = v_res.product_id;

      insert into public.stock_movements (
        product_id, movement_type, quantity,
        reference_id, reference_type, notes, created_by
      ) values (
        v_res.product_id, 'in', v_res.quantity,
        v_order.id, 'order_release',
        'Pelepasan reservasi ' || v_order.order_number,
        null
      );

      update public.stock_reservations
      set status = 'released'
      where id = v_res.id;

      v_released := v_released + 1;
    end loop;

    update public.orders
    set order_status = 'cancelled'
    where id = v_order.id and order_status in ('pending', 'confirmed');
  end if;

  insert into public.audit_logs (
    user_id, action, table_name, record_id, changes
  ) values (
    null,
    'payment.' || p_payment_status,
    'orders',
    v_order.id,
    jsonb_build_object(
      'provider', p_provider,
      'event_id', p_event_id,
      'transaction_id', p_provider_transaction_id,
      'released_items', v_released
    )
  );

  update public.payment_events set processed = true where id = v_event;

  return query select v_payment.id, v_order.id, true, 'APPLIED';
end;
$$;

-- Hanya service role (webhook server) yang boleh memanggil.
revoke all on function public.apply_payment_notification(
  text, text, text, text, text, text, text, numeric, jsonb
) from public;
revoke all on function public.apply_payment_notification(
  text, text, text, text, text, text, text, numeric, jsonb
) from anon;
revoke all on function public.apply_payment_notification(
  text, text, text, text, text, text, text, numeric, jsonb
) from authenticated;
grant execute on function public.apply_payment_notification(
  text, text, text, text, text, text, text, numeric, jsonb
) to service_role;

notify pgrst, 'reload schema';

-- -------------------------------------------------------------
-- Verifikasi manual (setelah ada payment pending)
-- -------------------------------------------------------------
-- select * from public.apply_payment_notification(
--   'midtrans', 'ORD-...', 'trx-123', 'paid', 'confirmed', 'bank_transfer',
--   'event-1', 1300000, '{}'::jsonb
-- );
-- select status, order_status, payment_status from public.orders where order_number = 'ORD-...';
-- select status from public.stock_reservations where order_id = '...';
-- Jalankan lagi dengan event_id sama -> DUPLICATE_EVENT.
