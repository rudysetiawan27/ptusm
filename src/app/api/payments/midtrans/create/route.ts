import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/context';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  createSnapTransaction,
  getMidtransConfig,
  type SnapItem,
} from '@/lib/payments/midtrans';

type Payload = {
  orderNumber?: string;
  locale?: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  subtotal: number | string;
  shipping_cost: number | string;
  tax: number | string;
  discount: number | string;
  total: number | string;
  currency: string | null;
  shipping_address: Record<string, unknown> | null;
  order_items: {
    sku: string;
    product_name: string;
    unit_price: number | string;
    quantity: number;
  }[];
};

export async function POST(request: Request) {
  const ctx = await getAuthContext();

  if (!ctx.user) {
    return NextResponse.json(
      { ok: false, code: 'NOT_AUTHENTICATED' },
      { status: 401 }
    );
  }

  if (!ctx.isApproved || !ctx.company) {
    return NextResponse.json(
      { ok: false, code: 'NOT_APPROVED' },
      { status: 403 }
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, code: 'INVALID_BODY' },
      { status: 400 }
    );
  }

  const orderNumber = (body.orderNumber ?? '').trim();
  const locale = body.locale === 'en' ? 'en' : 'id';

  if (!orderNumber) {
    return NextResponse.json(
      { ok: false, code: 'ORDER_NOT_FOUND' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select(
      `id, order_number, order_status, payment_status,
       subtotal, shipping_cost, tax, discount, total, currency,
       shipping_address,
       order_items(sku, product_name, unit_price, quantity)`
    )
    .eq('company_id', ctx.company.id)
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    console.error('[payment] gagal memuat order:', error.message);
    return NextResponse.json(
      { ok: false, code: 'ORDER_ERROR' },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, code: 'ORDER_NOT_FOUND' },
      { status: 404 }
    );
  }

  const order = data as unknown as OrderRow;

  if (order.payment_status === 'paid') {
    return NextResponse.json(
      { ok: false, code: 'ALREADY_PAID' },
      { status: 409 }
    );
  }

  if (order.order_status === 'cancelled') {
    return NextResponse.json(
      { ok: false, code: 'ORDER_CANCELLED' },
      { status: 409 }
    );
  }

  if (!getMidtransConfig().configured) {
    return NextResponse.json(
      { ok: false, code: 'PAYMENT_NOT_CONFIGURED' },
      { status: 503 }
    );
  }

  const total = Number(order.total);

  if (!Number.isFinite(total) || total <= 0) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_ORDER' },
      { status: 409 }
    );
  }

  // Percobaan ke-1 memakai nomor order; berikutnya diberi akhiran -R2, -R3, ...
  const { count } = await admin
    .from('payments')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', order.id);

  const attempt = (count ?? 0) + 1;
  const providerOrderId =
    attempt === 1 ? order.order_number : `${order.order_number}-R${attempt}`;

  const { data: payment, error: paymentError } = await admin
    .from('payments')
    .insert({
      order_id: order.id,
      provider: 'midtrans',
      provider_order_id: providerOrderId,
      amount: total,
      currency: order.currency ?? 'IDR',
      status: 'pending',
    })
    .select('id')
    .single();

  if (paymentError || !payment) {
    const duplicate = paymentError?.code === '23505';
    const missingColumn =
      paymentError?.code === 'PGRST204' ||
      /column .* does not exist/i.test(paymentError?.message ?? '');

    console.error('[payment] gagal membuat baris payment:', paymentError?.message);

    return NextResponse.json(
      {
        ok: false,
        code: duplicate
          ? 'PAYMENT_PENDING'
          : missingColumn
            ? 'MIGRATION_MISSING'
            : 'PAYMENT_ERROR',
      },
      { status: duplicate ? 409 : 500 }
    );
  }

  // Item details harus menjumlah tepat ke gross_amount.
  const items: SnapItem[] = (order.order_items ?? []).map((item) => ({
    id: item.sku,
    name: item.product_name,
    price: Number(item.unit_price),
    quantity: item.quantity,
  }));

  const shippingCost = Number(order.shipping_cost);
  const tax = Number(order.tax);
  const discount = Number(order.discount);

  if (shippingCost > 0) {
    items.push({ id: 'SHIPPING', name: 'Ongkos Kirim', price: shippingCost, quantity: 1 });
  }
  if (tax > 0) {
    items.push({ id: 'TAX', name: 'Pajak', price: tax, quantity: 1 });
  }
  if (discount > 0) {
    items.push({ id: 'DISCOUNT', name: 'Diskon', price: -discount, quantity: 1 });
  }

  const itemsTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const adjustment = Math.round(total) - Math.round(itemsTotal);

  if (adjustment !== 0) {
    items.push({
      id: 'ADJUSTMENT',
      name: 'Penyesuaian',
      price: adjustment,
      quantity: 1,
    });
  }

  const address = order.shipping_address ?? {};
  const firstName =
    typeof address.name === 'string' && address.name.trim()
      ? address.name
      : ctx.profile?.full_name ?? 'Customer';
  const email =
    typeof address.email === 'string'
      ? address.email
      : ctx.user.email ?? null;
  const phone =
    typeof address.phone === 'string'
      ? address.phone
      : ctx.profile?.phone ?? null;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3000';

  const snap = await createSnapTransaction({
    providerOrderId,
    grossAmount: total,
    items,
    customer: { firstName, email, phone },
    finishUrl: `${appUrl}/${locale}/orders/${order.order_number}?payment=finish`,
  });

  if (!snap.ok) {
    await admin
      .from('payments')
      .update({ status: 'failed' })
      .eq('id', payment.id);

    console.error('[payment] Snap gagal:', snap.error);

    return NextResponse.json(
      { ok: false, code: 'PAYMENT_GATEWAY_ERROR' },
      { status: 502 }
    );
  }

  const { error: updateError } = await admin
    .from('payments')
    .update({
      snap_token: snap.token,
      snap_redirect_url: snap.redirectUrl,
    })
    .eq('id', payment.id);

  if (updateError) {
    console.error('[payment] gagal menyimpan token Snap:', updateError.message);
  }

  return NextResponse.json({
    ok: true,
    redirectUrl: snap.redirectUrl,
    token: snap.token,
    providerOrderId,
  });
}
