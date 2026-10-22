import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminUser } from '@/lib/auth/require-admin';

type CategoryPayload = {
  id?: string;
  slug?: string;
  nameId?: string;
  nameEn?: string;
  status?: string;
  sortOrder?: number | string;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = ['active', 'inactive'];

function validate(body: CategoryPayload) {
  const errors: Record<string, string> = {};

  if (!body.slug?.trim()) errors.slug = 'Slug wajib diisi.';
  else if (!SLUG_PATTERN.test(body.slug.trim()))
    errors.slug = 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.';

  if (!body.nameId?.trim()) errors.nameId = 'Nama (ID) wajib diisi.';
  if (!body.nameEn?.trim()) errors.nameEn = 'Nama (EN) wajib diisi.';

  if (body.status && !STATUSES.includes(body.status))
    errors.status = 'Status tidak valid.';

  return errors;
}

function translationRows(body: CategoryPayload, categoryId: string) {
  return [
    {
      category_id: categoryId,
      locale: 'id',
      name: body.nameId!.trim(),
    },
    {
      category_id: categoryId,
      locale: 'en',
      name: body.nameEn!.trim(),
    },
  ];
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: 'Tidak diizinkan.' },
      { status: 403 }
    );
  }

  let body: CategoryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Body permintaan tidak valid.' },
      { status: 400 }
    );
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const admin = createAdminClient();
  const sortOrder = Number(body.sortOrder);

  const { data: category, error } = await admin
    .from('categories')
    .insert({
      slug: body.slug!.trim(),
      status: body.status === 'inactive' ? 'inactive' : 'active',
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .select('id')
    .single();

  if (error || !category) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error?.code === '23505'
            ? 'Slug kategori sudah dipakai.'
            : 'Gagal menyimpan kategori.',
      },
      { status: error?.code === '23505' ? 409 : 500 }
    );
  }

  const { error: translationError } = await admin
    .from('category_translations')
    .insert(translationRows(body, category.id));

  if (translationError) {
    await admin.from('categories').delete().eq('id', category.id);
    console.error(
      'Create category translation failed:',
      translationError.message
    );
    return NextResponse.json(
      { ok: false, message: 'Gagal menyimpan terjemahan kategori.' },
      { status: 500 }
    );
  }

  await admin.from('audit_logs').insert({
    user_id: user.id,
    action: 'category.created',
    table_name: 'categories',
    record_id: category.id,
    changes: { slug: body.slug },
  });

  return NextResponse.json({ ok: true, id: category.id });
}

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: 'Tidak diizinkan.' },
      { status: 403 }
    );
  }

  let body: CategoryPayload;
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
      { ok: false, message: 'ID kategori wajib diisi.' },
      { status: 400 }
    );
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const admin = createAdminClient();
  const sortOrder = Number(body.sortOrder);

  const { error } = await admin
    .from('categories')
    .update({
      slug: body.slug!.trim(),
      status: body.status === 'inactive' ? 'inactive' : 'active',
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq('id', body.id);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error.code === '23505'
            ? 'Slug kategori sudah dipakai.'
            : 'Gagal memperbarui kategori.',
      },
      { status: error.code === '23505' ? 409 : 500 }
    );
  }

  const { error: translationError } = await admin
    .from('category_translations')
    .upsert(translationRows(body, body.id), {
      onConflict: 'category_id,locale',
    });

  if (translationError) {
    console.error(
      'Update category translation failed:',
      translationError.message
    );
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui terjemahan kategori.' },
      { status: 500 }
    );
  }

  await admin.from('audit_logs').insert({
    user_id: user.id,
    action: 'category.updated',
    table_name: 'categories',
    record_id: body.id,
    changes: { slug: body.slug, status: body.status },
  });

  return NextResponse.json({ ok: true });
}
