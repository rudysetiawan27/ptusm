import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { getOrderDetail } from '@/lib/orders';
import PayButton from '@/components/payments/PayButton';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, orderNumber } = await params;
  const query = await searchParams;
  const paymentNotice =
    typeof query.payment === 'string' ? query.payment : undefined;
  const ctx = await getAuthContext();

  if (!ctx.user) {
    redirect(`/${locale}/login`);
  }

  if (!ctx.company) {
    notFound();
  }

  const company = ctx.company;
  const t = await getTranslations('order');
  const order = await getOrderDetail(company.id, orderNumber);

  if (!order) {
    notFound();
  }

  const address = order.shippingAddress;

  const paymentLabels: Record<string, string> = {
    pending: t('paymentPending'),
    paid: t('paymentPaid'),
    failed: t('paymentFailed'),
    expired: t('paymentExpired'),
    refunded: t('paymentRefunded'),
    partially_refunded: t('paymentRefunded'),
    cancelled: t('paymentCancelled'),
  };

  const canPay =
    order.orderStatus !== 'cancelled' &&
    ['pending', 'failed', 'expired'].includes(order.paymentStatus);

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-white/70 font-mono mb-1">
            {order.orderNumber}
          </p>
          <h1 className="text-4xl font-bold mb-2">{t('detailTitle')}</h1>
          <p className="text-white/80">
            {new Date(order.createdAt).toLocaleDateString(
              locale === 'id' ? 'id-ID' : 'en-GB',
              { day: '2-digit', month: 'long', year: 'numeric' }
            )}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Link
            href={`/${locale}/orders`}
            className="inline-block text-sm text-navy hover:text-orange"
          >
            {t('backToList')}
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                {t('shippingAddress')}
              </h2>
              <p className="font-medium text-gray-800">
                {address.name ?? '-'}
              </p>
              {address.company && (
                <p className="text-sm text-gray-600">{address.company}</p>
              )}
              <p className="text-sm text-gray-600 mt-2">{address.address}</p>
              <p className="text-sm text-gray-600">
                {[address.city, address.postal_code].filter(Boolean).join(', ')}
              </p>
              {address.phone && (
                <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
              )}
              {address.email && (
                <p className="text-sm text-gray-600">{address.email}</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                {t('status')}
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-600">{t('status')}</dt>
                  <dd className="font-medium text-gray-800 capitalize">
                    {order.orderStatus}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-600">{t('paymentStatus')}</dt>
                  <dd className="font-medium text-gray-800">
                    {paymentLabels[order.paymentStatus] ??
                      order.paymentStatus}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-600">{t('items')}</dt>
                  <dd className="font-medium text-gray-800">
                    {t('itemsCount', { count: order.itemCount })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              {t('payment')}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-800">
                  {paymentLabels[order.paymentStatus] ?? order.paymentStatus}
                </p>
                {paymentNotice === 'finish' && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('paymentFinishNotice')}
                  </p>
                )}
              </div>

              {canPay && (
                <PayButton orderNumber={order.orderNumber} locale={locale} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">
                    {t('items')}
                  </th>
                  <th className="text-right px-4 py-3 font-medium">
                    {t('unitPrice')}
                  </th>
                  <th className="text-right px-4 py-3 font-medium">
                    {t('quantity')}
                  </th>
                  <th className="text-right px-4 py-3 font-medium">
                    {t('subtotal')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {item.sku}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy whitespace-nowrap">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <dl className="space-y-2 text-sm max-w-sm ml-auto">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">{t('subtotal')}</dt>
                <dd className="text-gray-800">
                  Rp {order.subtotal.toLocaleString('id-ID')}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">{t('shipping')}</dt>
                <dd className="text-gray-800">
                  Rp {order.shippingCost.toLocaleString('id-ID')}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">{t('tax')}</dt>
                <dd className="text-gray-800">
                  Rp {order.tax.toLocaleString('id-ID')}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-600">{t('discount')}</dt>
                <dd className="text-gray-800">
                  Rp {order.discount.toLocaleString('id-ID')}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-gray-200 pt-2">
                <dt className="font-semibold text-navy">{t('total')}</dt>
                <dd className="font-bold text-navy">
                  Rp {order.total.toLocaleString('id-ID')}
                </dd>
              </div>
            </dl>

            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600">
                  {t('notes')}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-orange">{t('demoNotice')}</p>
        </div>
      </section>
    </div>
  );
}
