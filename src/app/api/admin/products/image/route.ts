import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminUser } from '@/lib/auth/require-admin';

export const runtime = 'nodejs';

const BUCKET = 'product-images';
const MAX_SIZE = 5 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Upload foto produk (admin only).
 * File masuk ke Supabase Storage lewat service role; browser tidak pernah
 * memegang service key.
 */
export async function POST(request: Request) {
  const user = await getAdminUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'INVALID_BODY' },
      { status: 400 }
    );
  }

  const file = form.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { ok: false, code: 'NO_FILE' },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { ok: false, code: 'FILE_TOO_LARGE' },
      { status: 413 }
    );
  }

  const ext = MIME_EXT[file.type];

  if (!ext) {
    return NextResponse.json(
      { ok: false, code: 'UNSUPPORTED_TYPE' },
      { status: 415 }
    );
  }

  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const admin = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    const missingBucket = /bucket.*not found/i.test(error.message);

    console.error('[admin] upload foto gagal:', error.message);

    return NextResponse.json(
      {
        ok: false,
        code: missingBucket ? 'BUCKET_MISSING' : 'UPLOAD_FAILED',
      },
      { status: missingBucket ? 503 : 500 }
    );
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    url: data.publicUrl,
    path,
  });
}
