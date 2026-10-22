import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isAdminEmail } from '@/lib/supabase/admin';

export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type CompanySummary = {
  id: string;
  legal_name: string;
  trade_name: string | null;
  status: CompanyStatus;
  rejection_reason: string | null;
  created_at: string;
  approved_at: string | null;
};

export type AuthContext = {
  user: { id: string; email?: string } | null;
  profile: { full_name: string; phone: string | null; locale: string } | null;
  company: CompanySummary | null;
  isAdmin: boolean;
  isApproved: boolean;
};

const empty: AuthContext = {
  user: null,
  profile: null,
  company: null,
  isAdmin: false,
  isApproved: false,
};

/**
 * Membaca sesi dari cookie (server-verified), lalu mengambil profil + perusahaan.
 *
 * Penting: `createClient()` dan `supabase.auth.getUser()` sengaja TIDAK dibungkus
 * try/catch. Kalau dibungkus, sinyal "butuh dynamic rendering" dari `cookies()`
 * ikut tertelan dan halaman bisa ter-prerender statis tanpa sesi user.
 *
 * Query profil/perusahaan memakai service role karena policy RLS untuk
 * company_members baru dilengkapi lewat supabase/migrations/002_auth_rls.sql,
 * dan hasilnya selalu dibatasi ke user yang sedang login.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return empty;

  try {
    const admin = createAdminClient();

    const { data: profile } = await admin
      .from('profiles')
      .select('full_name, phone, locale')
      .eq('id', user.id)
      .maybeSingle();

    const { data: membership } = await admin
      .from('company_members')
      .select(
        'role, companies(id, legal_name, trade_name, status, rejection_reason, created_at, approved_at)'
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    const company = (membership?.companies ?? null) as CompanySummary | null;

    return {
      user: { id: user.id, email: user.email },
      profile: profile ?? null,
      company,
      isAdmin: isAdminEmail(user.email),
      isApproved: company?.status === 'approved',
    };
  } catch (error) {
    console.error('getAuthContext: gagal mengambil profil/perusahaan', error);
    return {
      ...empty,
      user: { id: user.id, email: user.email },
      isAdmin: isAdminEmail(user.email),
    };
  }
}
