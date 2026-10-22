import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  buildEventId,
  mapMidtransStatus,
  verifyMidtransSignature,
  type MidtransNotification,
} from '@/lib/payments/midtrans';

/**
 * Webhook Midtrans.
 *
 * - Signature diverifikasi dengan SHA512 + server key.
 * - Efek samping (payment, order, stok, reservasi) dilakukan atomik di RPC
 *   `apply_payment_notification`.
 * - Event yang sama (hash body) diabaikan lewat unique index.
 * - Jangan pernah menganggap lunas hanya karena browser redirect.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  let payload: MidtransNotification;
  try {
    payload = JSON.parse(rawBody) as MidtransNotification;
  } catch {
    return NextResponse.json(
      { ok: false, code: 'INVALID_BODY' },
      { status: 400 }
    );
  }

  if (
    !payload.order_id ||
    !payload.status_code ||
    !payload.gross_amount ||
    !payload.signature_key ||
    !payload.transaction_status
  ) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_PAYLOAD' },
      { status: 400 }
    );
  }

  if (!verifyMidtransSignature(payload)) {
    console.warn('[midtrans] signature tidak valid:', payload.order_id);
    return NextResponse.json(
      { ok: false, code: 'INVALID_SIGNATURE' },
      { status: 401 }
    );
  }

  const mapped = mapMidtransStatus(
    payload.transaction_status,
    payload.fraud_status
  );

  if (!mapped) {
    return NextResponse.json({
      ok: true,
      applied: false,
      reason: 'UNMAPPED_STATUS',
    });
  }

  const grossAmount = Number(payload.gross_amount);

  if (!Number.isFinite(grossAmount)) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_AMOUNT' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Simpan hanya field yang diperlukan (tanpa data pribadi / signature).
  const safePayload = {
    order_id: payload.order_id,
    status_code: payload.status_code,
    gross_amount: payload.gross_amount,
    transaction_status: payload.transaction_status,
    transaction_id: payload.transaction_id ?? null,
    fraud_status: payload.fraud_status ?? null,
    payment_type: payload.payment_type ?? null,
    currency: payload.currency ?? null,
    transaction_time: payload.transaction_time ?? null,
    settlement_time: payload.settlement_time ?? null,
    expiry_time: payload.expiry_time ?? null,
  };

  const { data, error } = await admin.rpc('apply_payment_notification', {
    p_provider: 'midtrans',
    p_provider_order_id: payload.order_id,
    p_provider_transaction_id: payload.transaction_id ?? null,
    p_payment_status: mapped.paymentStatus,
    p_order_status: mapped.orderStatus,
    p_payment_method: payload.payment_type ?? null,
    p_event_id: buildEventId(rawBody),
    p_gross_amount: grossAmount,
    p_raw: safePayload,
  });

  if (error) {
    const message = error.message ?? '';
    const code = error.code ?? '';

    console.error('[midtrans] gagal memproses notifikasi:', {
      orderId: payload.order_id,
      status: payload.transaction_status,
      message,
    });

    if (
      code === 'PGRST202' ||
      message.includes('apply_payment_notification') ||
      /column .* does not exist/i.test(message)
    ) {
      return NextResponse.json(
        { ok: false, code: 'MIGRATION_MISSING' },
        { status: 503 }
      );
    }

    if (message.includes('AMOUNT_MISMATCH')) {
      return NextResponse.json(
        { ok: false, code: 'AMOUNT_MISMATCH' },
        { status: 400 }
      );
    }

    if (message.includes('RESERVATION_ALREADY_RELEASED')) {
      return NextResponse.json(
        { ok: false, code: 'RESERVATION_ALREADY_RELEASED' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, code: 'WEBHOOK_FAILED' },
      { status: 500 }
    );
  }

  const row = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({
    ok: true,
    applied: Boolean(row?.applied),
    reason: row?.reason ?? 'UNKNOWN',
  });
}
