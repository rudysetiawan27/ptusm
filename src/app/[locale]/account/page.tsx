import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import LogoutButton from '@/components/auth/LogoutButton';

// Halaman ini selalu bergantung pada sesi user, jangan pernah di-prerender statis.
export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-200 text-gray-700',
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, profile, company, isAdmin, isApproved } = await getAuthContext();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('account');
  const statusKey = company?.status ?? 'pending';
  const statusLabel = t(
    (`status${statusKey.charAt(0).toUpperCase()}${statusKey.slice(1)}`) as
      | 'statusPending'
      | 'statusApproved'
      | 'statusRejected'
      | 'statusSuspended'
  );

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-white/80">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href={`/${locale}/admin/companies`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
              >
                Admin
              </Link>
            )}
            <LogoutButton className="px-4 py-2 bg-orange hover:bg-orange/90 rounded-lg text-sm font-medium" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          {/* Status Notice */}
          {company && (
            <div
              className={`rounded-lg p-4 border ${
                isApproved
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : company.status === 'rejected'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}
            >
              {isApproved
                ? t('approvedNotice')
                : company.status === 'rejected'
                  ? t('rejectedNotice')
                  : t('pendingNotice')}
            </div>
          )}

          {/* Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">
              {t('profile')}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">{t('fullName')}</dt>
                <dd className="font-medium text-gray-800">
                  {profile?.full_name ?? '-'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t('email')}</dt>
                <dd className="font-medium text-gray-800">{user.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t('phone')}</dt>
                <dd className="font-medium text-gray-800">
                  {profile?.phone ?? '-'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Company */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-navy mb-4">
              {t('company')}
            </h2>

            {company ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">{t('companyName')}</dt>
                  <dd className="font-medium text-gray-800">
                    {company.legal_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">{t('status')}</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[statusKey] ?? statusStyles.pending
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">{t('registeredAt')}</dt>
                  <dd className="font-medium text-gray-800">
                    {new Date(company.created_at).toLocaleDateString('id-ID', {
                      timeZone: 'Asia/Jakarta',
                    })}
                  </dd>
                </div>
                {company.approved_at && (
                  <div>
                    <dt className="text-gray-500">{t('approvedAt')}</dt>
                    <dd className="font-medium text-gray-800">
                      {new Date(company.approved_at).toLocaleDateString(
                        'id-ID',
                        { timeZone: 'Asia/Jakarta' }
                      )}
                    </dd>
                  </div>
                )}
                {company.rejection_reason && (
                  <div className="sm:col-span-2">
                    <dt className="text-gray-500">{t('rejectionReason')}</dt>
                    <dd className="font-medium text-red-700">
                      {company.rejection_reason}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">{t('priceAccess')}</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isApproved ? t('priceGranted') : t('priceLocked')}
                    </span>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-600">{t('noCompany')}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
