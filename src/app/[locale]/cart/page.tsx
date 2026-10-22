import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { getCartForUser } from '@/lib/cart';
import CartView from '@/components/cart/CartView';

export const dynamic = 'force-dynamic';

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const ctx = await getAuthContext();

  if (!ctx.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('cart');
  const cart = ctx.isApproved ? await getCartForUser(ctx.user.id) : null;

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-white/80">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {!ctx.isApproved ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-xl mx-auto">
              <p className="text-gray-700 mb-4">{t('approvalRequired')}</p>
              <Link
                href={`/${locale}/account`}
                className="inline-block px-6 py-3 bg-navy hover:bg-orange text-white font-semibold rounded-lg transition-colors"
              >
                {t('viewAccount')}
              </Link>
            </div>
          ) : !cart || cart.items.length === 0 ? (
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
            <CartView
              locale={locale}
              items={cart.items}
              subtotal={cart.subtotal}
            />
          )}
        </div>
      </section>
    </div>
  );
}
