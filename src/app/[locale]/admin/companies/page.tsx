import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { createAdminClient } from '@/lib/supabase/admin';
import CompanyActions from '@/components/admin/CompanyActions';
import AdminNav from '@/components/admin/AdminNav';

// Daftar perusahaan berubah-ubah dan hanya untuk admin: jangan di-prerender.
export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-200 text-gray-700',
};

export default async function AdminCompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, isAdmin } = await getAuthContext();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Sembunyikan keberadaan halaman dari non-admin (PRD 3.4)
  if (!isAdmin) {
    notFound();
  }

  const t = await getTranslations('admin');
  const admin = createAdminClient();
  const statusLabel: Record<string, string> = {
    pending: t('statusPending'),
    approved: t('statusApproved'),
    rejected: t('statusRejected'),
    suspended: t('statusSuspended'),
  };

  const { data: companies } = await admin
    .from('companies')
    .select(
      'id, legal_name, trade_name, email, phone, city, status, rejection_reason, created_at'
    )
    .order('created_at', { ascending: false });

  const pending = (companies ?? []).filter((c) => c.status === 'pending');
  const others = (companies ?? []).filter((c) => c.status !== 'pending');

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-white/80">{t('subtitle')}</p>
          </div>
          <AdminNav locale={locale} active="companies" />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          {/* Pending */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-navy">
                {t('pendingList', { count: pending.length })}
              </h2>
            </div>

            {pending.length === 0 ? (
              <p className="p-6 text-gray-600">{t('empty')}</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pending.map((company) => (
                  <li key={company.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="text-sm space-y-1">
                        <p className="text-lg font-semibold text-navy">
                          {company.legal_name}
                        </p>
                        <p className="text-gray-600">
                          {t('contact')}: {company.email} · {company.phone}
                        </p>
                        <p className="text-gray-500">
                          {company.city} · {t('registeredAt')}:{' '}
                          {new Date(company.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <CompanyActions companyId={company.id} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-navy">
                {t('allCompanies', { count: others.length })}
              </h2>
            </div>

            {others.length === 0 ? (
              <p className="p-6 text-gray-600">-</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {others.map((company) => (
                  <li key={company.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="text-sm space-y-1">
                        <p className="font-semibold text-navy">
                          {company.legal_name}
                        </p>
                        <p className="text-gray-600">
                          {company.email} · {company.phone}
                        </p>
                        {company.rejection_reason && (
                          <p className="text-red-600">
                            {t('reason')}: {company.rejection_reason}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[company.status] ?? statusStyles.pending
                          }`}
                        >
                          {statusLabel[company.status] ?? company.status}
                        </span>
                        <CompanyActions companyId={company.id} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
