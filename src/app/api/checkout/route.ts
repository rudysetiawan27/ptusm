import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/server';

type CheckoutPayload = {
  recipientName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
};

function clean(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  const ctx = await getAuthContext();

  if (!ctx.user) {
    return NextResponse.json(
      { ok: false, code: 'NOT_AUTHENTICATED' },
      { status: 401 }
    );
  }

  if (!ctx.isApproved) {
    return NextResponse.json(
      { ok: false, code: 'NOT_APPROVED' },
      { status: 403 }
    );
  }

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json(
      { ok: false, code: 'INVALID_BODY' },
      { status: 400 }
    );
  }

  const name = clean(body.recipientName, 160);
  const phone = clean(body.phone, 40);
  const address = clean(body.address, 500);
  const city = clean(body.city, 120);
  const postalCode = clean(body.postalCode, 20);
  const notes = clean(body.notes, 1000);

  if (!name || !phone || !address || !city) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_ADDRESS' },
      { status: 400 }
    );
  }

  const shippingAddress = {
    name,
    phone,
    address,
    city,
    postal_code: postalCode || null,
    company: ctx.company?.legal_name ?? null,
    email: ctx.user.email ?? null,
  };

  // Penting: pakai client dengan sesi user, supaya auth.uid() terbaca di RPC.
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('create_order_from_cart', {
    p_shipping_address: shippingAddress,
    p_notes: notes || null,
  });

  if (error) {
    const message = error.message ?? '';
    const code = error.code ?? '';

    if (code === 'PGRST202' || message.includes('Could not find the function')) {
      return NextResponse.json(
        { ok: false, code: 'MIGRATION_MISSING' },
        { status: 500 }
      );
    }

    if (message.includes('NOT_AUTHENTICATED')) {
      return NextResponse.json(
        { ok: false, code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }

    if (message.includes('COMPANY_NOT_APPROVED')) {
      return NextResponse.json(
        { ok: false, code: 'NOT_APPROVED' },
        { status: 403 }
      );
    }

    if (message.includes('CART_EMPTY')) {
      return NextResponse.json(
        { ok: false, code: 'CART_EMPTY' },
        { status: 409 }
      );
    }

    if (message.includes('INSUFFICIENT_STOCK')) {
      const sku = message.split(':')[1]?.trim() ?? null;
      return NextResponse.json(
        { ok: false, code: 'INSUFFICIENT_STOCK', sku },
        { status: 409 }
      );
    }

    if (message.includes('PRODUCT_NOT_ACTIVE')) {
      const sku = message.split(':')[1]?.trim() ?? null;
      return NextResponse.json(
        { ok: false, code: 'PRODUCT_NOT_ACTIVE', sku },
        { status: 409 }
      );
    }

    if (message.includes('INVALID_ADDRESS')) {
      return NextResponse.json(
        { ok: false, code: 'INVALID_ADDRESS' },
        { status: 400 }
      );
    }

    console.error('[checkout] RPC gagal:', message);
    return NextResponse.json(
      { ok: false, code: 'CHECKOUT_FAILED' },
      { status: 500 }
    );
  }

  const row = Array.isArray(data) ? data[0] : null;

  if (!row) {
    return NextResponse.json(
      { ok: false, code: 'CHECKOUT_FAILED' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    orderId: row.order_id,
    orderNumber: row.order_number,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
  });
}
