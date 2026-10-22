import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { getOrdersForCompany } from '@/lib/orders';

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-200 text-gray-700',
};

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const ctx = await getAuthContext();

  if (!ctx.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('order');
  const orders = ctx.company
    ? await getOrdersForCompany(ctx.company.id)
    : [];

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-white/80">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-xl mx-auto">
              <p className="text-gray-700 mb-4">{t('empty')}</p>
              <Link
                href={`/${locale}/products`}
                className="inline-block px-6 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors"
              >
                {t('emptyCta')}
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('number')}
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('date')}
                    </th>
                    <th className="text-right px-4 py-3 font-medium">
                      {t('items')}
                    </th>
                    <th className="text-right px-4 py-3 font-medium">
                      {t('total')}
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('status')}
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 font-mono text-xs text-navy">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString(
                          locale === 'id' ? 'id-ID' : 'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'Asia/Jakarta',
                          }
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {order.itemCount}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-navy whitespace-nowrap">
                        Rp {order.total.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[order.orderStatus] ??
                            statusStyles.pending
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/${locale}/orders/${order.orderNumber}`}
                          className="text-orange hover:text-orange/80 font-medium whitespace-nowrap"
                        >
                          {t('viewDetail')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-orange mt-4">{t('demoNotice')}</p>
        </div>
      </section>
    </div>
  );
}
