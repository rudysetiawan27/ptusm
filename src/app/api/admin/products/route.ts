import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminUser } from '@/lib/auth/require-admin';

type ProductPayload = {
  id?: string;
  sku?: string;
  slug?: string;
  nameId?: string;
  nameEn?: string;
  shortDescriptionId?: string;
  shortDescriptionEn?: string;
  longDescriptionId?: string;
  longDescriptionEn?: string;
  categoryId?: string | null;
  status?: string;
  unit?: string;
  price?: number | string;
  stock?: number | string;
  imageUrl?: string | null;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = ['active', 'inactive', 'draft'];

function isAllowedImageUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.hostname === 'placehold.co') return true;

    const supabaseHost = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    ).hostname;

    return (
      parsed.hostname === supabaseHost &&
      parsed.pathname.startsWith('/storage/v1/object/public/product-images/')
    );
  } catch {
    return false;
  }
}

function validate(body: ProductPayload) {
  const errors: Record<string, string> = {};
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!body.sku?.trim()) errors.sku = 'SKU wajib diisi.';
  if (!body.slug?.trim()) errors.slug = 'Slug wajib diisi.';
  else if (!SLUG_PATTERN.test(body.slug.trim()))
    errors.slug = 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.';

  if (!body.nameId?.trim()) errors.nameId = 'Nama (ID) wajib diisi.';
  if (!body.nameEn?.trim()) errors.nameEn = 'Nama (EN) wajib diisi.';

  if (!Number.isFinite(price) || price < 0)
    errors.price = 'Harga harus angka dan tidak negatif.';
  if (!Number.isInteger(stock) || stock < 0)
    errors.stock = 'Stok harus bilangan bulat dan tidak negatif.';

  if (body.status && !STATUSES.includes(body.status))
    errors.status = 'Status tidak valid.';

  const imageUrl = (body.imageUrl ?? '').trim();
  if (imageUrl && (imageUrl.length > 2048 || !isAllowedImageUrl(imageUrl)))
    errors.imageUrl = 'URL foto tidak valid.';

  return { errors, price, stock };
}

function payloadToRow(body: ProductPayload, price: number, stock: number) {
  return {
    sku: body.sku!.trim(),
    slug: body.slug!.trim(),
    category_id: body.categoryId?.trim() || null,
    status: body.status && STATUSES.includes(body.status) ? body.status : 'draft',
    unit: body.unit?.trim() || 'pcs',
    price,
    stock,
  };
}

function translationRows(body: ProductPayload, productId: string) {
  return [
    {
      product_id: productId,
      locale: 'id',
      name: body.nameId!.trim(),
      short_description: body.shortDescriptionId?.trim() || null,
      long_description: body.longDescriptionId?.trim() || null,
    },
    {
      product_id: productId,
      locale: 'en',
      name: body.nameEn!.trim(),
      short_description: body.shortDescriptionEn?.trim() || null,
      long_description: body.longDescriptionEn?.trim() || null,
    },
  ];
}

function isUniqueViolation(code?: string) {
  return code === '23505';
}

async function syncPrimaryImage(
  admin: ReturnType<typeof createAdminClient>,
  productId: string,
  imageUrl: string,
  altId: string,
  altEn: string
) {
  if (!imageUrl) {
    const { error } = await admin
      .from('product_images')
      .delete()
      .eq('product_id', productId);
    return error;
  }

  const { data: existing } = await admin
    .from('product_images')
    .select('id')
    .eq('product_id', productId)
    .eq('is_primary', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from('product_images')
      .update({ url: imageUrl, alt_id: altId, alt_en: altEn })
      .eq('id', existing.id);
    return error;
  }

  const { error } = await admin.from('product_images').insert({
    product_id: productId,
    url: imageUrl,
    alt_id: altId,
    alt_en: altEn,
    is_primary: true,
    sort_order: 1,
  });

  return error;
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: 'Tidak diizinkan.' },
      { status: 403 }
    );
  }

  let body: ProductPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Body permintaan tidak valid.' },
      { status: 400 }
    );
  }

  const { errors, price, stock } = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: product, error } = await admin
    .from('products')
    .insert(payloadToRow(body, price, stock))
    .select('id')
    .single();

  if (error || !product) {
    return NextResponse.json(
      {
        ok: false,
        message: isUniqueViolation(error?.code)
          ? 'SKU atau slug sudah dipakai.'
          : 'Gagal menyimpan produk.',
      },
      { status: isUniqueViolation(error?.code) ? 409 : 500 }
    );
  }

  const { error: translationError } = await admin
    .from('product_translations')
    .insert(translationRows(body, product.id));

  if (translationError) {
    await admin.from('products').delete().eq('id', product.id);
    console.error('Create product translation failed:', translationError.message);
    return NextResponse.json(
      { ok: false, message: 'Gagal menyimpan terjemahan produk.' },
      { status: 500 }
    );
  }

  const imageUrl = (body.imageUrl ?? '').trim();

  if (imageUrl) {
    const imageError = await syncPrimaryImage(
      admin,
      product.id,
      imageUrl,
      body.nameId!.trim(),
      body.nameEn!.trim()
    );

    if (imageError) {
      await admin.from('products').delete().eq('id', product.id);
      console.error('Create product image failed:', imageError.message);
      return NextResponse.json(
        { ok: false, message: 'Gagal menyimpan foto produk.' },
        { status: 500 }
      );
    }
  }

  await admin.from('audit_logs').insert({
    user_id: user.id,
    action: 'product.created',
    table_name: 'products',
    record_id: product.id,
    changes: { sku: body.sku, slug: body.slug, price, stock },
  });

  return NextResponse.json({ ok: true, id: product.id });
}

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: 'Tidak diizinkan.' },
      { status: 403 }
    );
  }

  let body: ProductPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Body permintaan tidak valid.' },
      { status: 400 }
    );
  }

  if (!body.id) {
    return NextResponse.json(
      { ok: false, message: 'ID produk wajib diisi.' },
      { status: 400 }
    );
  }

  const { errors, price, stock } = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: before } = await admin
    .from('products')
    .select('price, stock, status')
    .eq('id', body.id)
    .maybeSingle();

  const { error } = await admin
    .from('products')
    .update(payloadToRow(body, price, stock))
    .eq('id', body.id);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message: isUniqueViolation(error.code)
          ? 'SKU atau slug sudah dipakai.'
          : 'Gagal memperbarui produk.',
      },
      { status: isUniqueViolation(error.code) ? 409 : 500 }
    );
  }

  const { error: translationError } = await admin
    .from('product_translations')
    .upsert(translationRows(body, body.id), {
      onConflict: 'product_id,locale',
    });

  if (translationError) {
    console.error('Update product translation failed:', translationError.message);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui terjemahan produk.' },
      { status: 500 }
    );
  }

  if (body.imageUrl !== undefined) {
    const imageError = await syncPrimaryImage(
      admin,
      body.id,
      (body.imageUrl ?? '').trim(),
      body.nameId!.trim(),
      body.nameEn!.trim()
    );

    if (imageError) {
      console.error('Update product image failed:', imageError.message);
      return NextResponse.json(
        { ok: false, message: 'Gagal memperbarui foto produk.' },
        { status: 500 }
      );
    }
  }

  await admin.from('audit_logs').insert({
    user_id: user.id,
    action: 'product.updated',
    table_name: 'products',
    record_id: body.id,
    changes: {
      before: before ?? null,
      after: { price, stock, status: body.status },
      imageUrl: body.imageUrl ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: 'Tidak diizinkan.' },
      { status: 403 }
    );
  }

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Body permintaan tidak valid.' },
      { status: 400 }
    );
  }

  if (!body.id) {
    return NextResponse.json(
      { ok: false, message: 'ID produk wajib diisi.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { error } = await admin.from('products').delete().eq('id', body.id);

  if (error) {
    console.error('Delete product failed:', error.message);
    return NextResponse.json(
      { ok: false, message: 'Gagal menghapus produk.' },
      { status: 500 }
    );
  }

  await admin.from('audit_logs').insert({
    user_id: user.id,
    action: 'product.deleted',
    table_name: 'products',
    record_id: body.id,
    changes: null,
  });

  return NextResponse.json({ ok: true });
}
