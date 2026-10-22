import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/context';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOrCreateCartId } from '@/lib/cart';

type CartPayload = {
  productId?: string;
  quantity?: number | string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseQuantity(value: number | string | undefined) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return null;
  }
  return quantity;
}

async function readBody(request: Request): Promise<CartPayload | null> {
  try {
    return (await request.json()) as CartPayload;
  } catch {
    return null;
  }
}

async function loadContext() {
  const ctx = await getAuthContext();

  if (!ctx.user) {
    return {
      error: NextResponse.json(
        { ok: false, code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      ),
    };
  }

  if (!ctx.isApproved) {
    return {
      error: NextResponse.json(
        { ok: false, code: 'NOT_APPROVED' },
        { status: 403 }
      ),
    };
  }

  return { ctx };
}

async function loadProduct(productId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('products')
    .select('id, sku, status, stock')
    .eq('id', productId)
    .maybeSingle();

  if (error) {
    console.error('[cart] gagal memuat produk:', error.message);
    return null;
  }

  return data;
}

/** Tambah kuantitas ke keranjang (menambah bila item sudah ada). */
export async function POST(request: Request) {
  const { error, ctx } = await loadContext();
  if (error) return error;

  const body = await readBody(request);
  if (!body?.productId || !UUID_PATTERN.test(body.productId)) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_PRODUCT' },
      { status: 400 }
    );
  }

  const quantity = parseQuantity(body.quantity ?? 1);
  if (quantity === null) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_QUANTITY' },
      { status: 400 }
    );
  }

  const product = await loadProduct(body.productId);
  if (!product) {
    return NextResponse.json(
      { ok: false, code: 'PRODUCT_NOT_FOUND' },
      { status: 404 }
    );
  }

  if (product.status !== 'active') {
    return NextResponse.json(
      { ok: false, code: 'PRODUCT_NOT_ACTIVE', sku: product.sku },
      { status: 409 }
    );
  }

  const cartId = await getOrCreateCartId(ctx.user!.id);
  if (!cartId) {
    return NextResponse.json(
      { ok: false, code: 'CART_ERROR' },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cartId)
    .eq('product_id', body.productId)
    .maybeSingle();

  const nextQuantity = (existing?.quantity ?? 0) + quantity;

  if (nextQuantity > product.stock) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INSUFFICIENT_STOCK',
        sku: product.sku,
        available: product.stock,
      },
      { status: 409 }
    );
  }

  const { error: upsertError } = await admin.from('cart_items').upsert(
    {
      cart_id: cartId,
      product_id: body.productId,
      quantity: nextQuantity,
    },
    { onConflict: 'cart_id,product_id' }
  );

  if (upsertError) {
    console.error('[cart] gagal menyimpan item:', upsertError.message);
    return NextResponse.json(
      { ok: false, code: 'CART_ERROR' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, quantity: nextQuantity });
}

/** Set kuantitas persis. quantity <= 0 menghapus item. */
export async function PUT(request: Request) {
  const { error, ctx } = await loadContext();
  if (error) return error;

  const body = await readBody(request);
  if (!body?.productId || !UUID_PATTERN.test(body.productId)) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_PRODUCT' },
      { status: 400 }
    );
  }

  const rawQuantity = Number(body.quantity);
  if (!Number.isInteger(rawQuantity) || rawQuantity < 0 || rawQuantity > 999) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_QUANTITY' },
      { status: 400 }
    );
  }

  const cartId = await getOrCreateCartId(ctx.user!.id);
  if (!cartId) {
    return NextResponse.json(
      { ok: false, code: 'CART_ERROR' },
      { status: 500 }
    );
  }

  const admin = createAdminClient();

  if (rawQuantity === 0) {
    const { error: deleteError } = await admin
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId)
      .eq('product_id', body.productId);

    if (deleteError) {
      console.error('[cart] gagal menghapus item:', deleteError.message);
      return NextResponse.json(
        { ok: false, code: 'CART_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, quantity: 0 });
  }

  const product = await loadProduct(body.productId);
  if (!product) {
    return NextResponse.json(
      { ok: false, code: 'PRODUCT_NOT_FOUND' },
      { status: 404 }
    );
  }

  if (product.status !== 'active') {
    return NextResponse.json(
      { ok: false, code: 'PRODUCT_NOT_ACTIVE', sku: product.sku },
      { status: 409 }
    );
  }

  if (rawQuantity > product.stock) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INSUFFICIENT_STOCK',
        sku: product.sku,
        available: product.stock,
      },
      { status: 409 }
    );
  }

  const { error: updateError } = await admin
    .from('cart_items')
    .update({ quantity: rawQuantity })
    .eq('cart_id', cartId)
    .eq('product_id', body.productId);

  if (updateError) {
    console.error('[cart] gagal memperbarui item:', updateError.message);
    return NextResponse.json(
      { ok: false, code: 'CART_ERROR' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, quantity: rawQuantity });
}

/** Hapus satu item dari keranjang. */
export async function DELETE(request: Request) {
  const { error, ctx } = await loadContext();
  if (error) return error;

  const body = await readBody(request);
  if (!body?.productId || !UUID_PATTERN.test(body.productId)) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_PRODUCT' },
      { status: 400 }
    );
  }

  const cartId = await getOrCreateCartId(ctx.user!.id);
  if (!cartId) {
    return NextResponse.json(
      { ok: false, code: 'CART_ERROR' },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const { error: deleteError } = await admin
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId)
    .eq('product_id', body.productId);

  if (deleteError) {
    console.error('[cart] gagal menghapus item:', deleteError.message);
    return NextResponse.json(
      { ok: false, code: 'CART_ERROR' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
