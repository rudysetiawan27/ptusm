import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isAdminEmail } from '@/lib/supabase/admin';

type ActionBody = {
  companyId?: string;
  action?: 'approve' | 'reject';
  reason?: string;
};

export async function POST(request: Request) {
  // 1. Verifikasi sesi di server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json(
      { ok: false, message: 'Tidak diizinkan.' },
      { status: 403 }
    );
  }

  let body: ActionBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Body permintaan tidak valid.' },
      { status: 400 }
    );
  }

  if (!body.companyId || (body.action !== 'approve' && body.action !== 'reject')) {
    return NextResponse.json(
      { ok: false, message: 'Parameter tidak lengkap.' },
      { status: 400 }
    );
  }

  if (body.action === 'reject' && !body.reason?.trim()) {
    return NextResponse.json(
      { ok: false, message: 'Alasan penolakan wajib diisi.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const approved = body.action === 'approve';

  const { data: updated, error } = await admin
    .from('companies')
    .update({
      status: approved ? 'approved' : 'rejected',
      rejection_reason: approved ? null : body.reason!.trim(),
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? user.id : null,
    })
    .eq('id', body.companyId)
    .select('id, legal_name, status')
    .single();

  if (error || !updated) {
    console.error('Company approval failed:', error);
    return NextResponse.json(
      { ok: false, message: 'Gagal memperbarui status perusahaan.' },
      { status: 500 }
    );
  }

  // 2. Audit log (PRD 6.3 & 12.5)
  await admin.from('audit_logs').insert({
    user_id: user.id,
    action: approved ? 'company.approved' : 'company.rejected',
    table_name: 'companies',
    record_id: body.companyId,
    changes: {
      status: updated.status,
      reason: approved ? null : body.reason!.trim(),
    },
  });

  return NextResponse.json({ ok: true, company: updated });
}
