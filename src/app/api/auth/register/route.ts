import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

type RegisterPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  companyName?: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  companyPhone?: string;
};

function validate(body: RegisterPayload) {
  const errors: Record<string, string> = {};
  const email = (body.email ?? '').trim();

  if (!body.fullName || body.fullName.trim().length < 2)
    errors.fullName = 'Nama lengkap minimal 2 karakter.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Format email tidak valid.';
  if (!body.phone || body.phone.trim().length < 6)
    errors.phone = 'Nomor telepon minimal 6 karakter.';
  if (!body.password || body.password.length < 8)
    errors.password = 'Password minimal 8 karakter.';
  if (!body.companyName || body.companyName.trim().length < 2)
    errors.companyName = 'Nama perusahaan minimal 2 karakter.';
  if (!body.address || body.address.trim().length < 5)
    errors.address = 'Alamat perusahaan minimal 5 karakter.';
  if (!body.city || body.city.trim().length < 2)
    errors.city = 'Kota minimal 2 karakter.';
  if (!body.companyPhone || body.companyPhone.trim().length < 6)
    errors.companyPhone = 'Telepon perusahaan minimal 6 karakter.';

  return errors;
}

export async function POST(request: Request) {
  let body: RegisterPayload;

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
  const email = body.email!.trim().toLowerCase();

  // 1. Buat user auth (email langsung terkonfirmasi untuk lingkungan dev)
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: body.password!,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const alreadyExists = /already|registered|exists/i.test(
      createError?.message ?? ''
    );
    return NextResponse.json(
      {
        ok: false,
        message: alreadyExists
          ? 'Email sudah terdaftar.'
          : 'Gagal membuat akun. Silakan coba lagi.',
      },
      { status: alreadyExists ? 409 : 500 }
    );
  }

  const userId = created.user.id;

  // 2. Profil
  const { error: profileError } = await admin.from('profiles').insert({
    id: userId,
    full_name: body.fullName!.trim(),
    phone: body.phone!.trim(),
    locale: 'id',
  });

  // 3. Perusahaan (status pending menunggu approval admin)
  const { data: company, error: companyError } = await admin
    .from('companies')
    .insert({
      legal_name: body.companyName!.trim(),
      trade_name: body.companyName!.trim(),
      registration_number: body.registrationNumber?.trim() || null,
      address: body.address!.trim(),
      city: body.city!.trim(),
      phone: body.companyPhone!.trim(),
      email,
      status: 'pending',
    })
    .select('id')
    .single();

  // 4. Keanggotaan sebagai owner
  const { error: memberError } =
    company && !companyError
      ? await admin.from('company_members').insert({
          company_id: company.id,
          user_id: userId,
          role: 'owner',
          status: 'active',
        })
      : { error: companyError ?? new Error('company not created') };

  if (profileError || companyError || memberError) {
    // Bersihkan user agar tidak tertinggal setengah jadi
    await admin.auth.admin.deleteUser(userId).catch(() => undefined);

    console.error('Register failed:', profileError, companyError, memberError);
    return NextResponse.json(
      { ok: false, message: 'Gagal menyimpan data pendaftaran.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
