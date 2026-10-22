'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { CartLine } from '@/lib/cart';
import type { Locale } from '@/lib/catalog';

type Props = {
  locale: string;
  items: CartLine[];
  subtotal: number;
};

export default function CartView({ locale, items, subtotal }: Props) {
  const t = useTranslations('cart');
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const typedLocale = locale as Locale;

  async function mutate(
    method: 'PUT' | 'DELETE',
    productId: string,
    quantity?: number
  ) {
    setBusy(productId);
    setError(null);

    try {
      const res = await fetch('/api/cart', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          quantity === undefined ? { productId } : { productId, quantity }
        ),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        if (data.code === 'INSUFFICIENT_STOCK') {
          setError(t('errorStock', { count: data.available ?? 0 }));
        } else if (data.code === 'PRODUCT_NOT_ACTIVE') {
          setError(t('errorInactive'));
        } else {
          setError(t('errorGeneric'));
        }
        return;
      }

      router.refresh();
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
          >
            {error}
          </div>
        )}

        {items.map((item) => {
          const name = item.name[typedLocale] ?? item.name.id;
          const isBusy = busy === item.productId;

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative w-24 h-24 shrink-0 bg-light-gray rounded overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/${locale}/products/${item.slug}`}
                  className="font-semibold text-navy hover:text-orange transition-colors"
                >
                  {name}
                </Link>
                <p className="text-xs text-gray-500 font-mono mt-1">{item.sku}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Rp {item.price.toLocaleString('id-ID')} / {item.unit}
                </p>
                <p className="text-xs text-gray-500">
                  {t('stockLeft', { count: item.stock })}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    disabled={isBusy || item.quantity <= 1}
                    onClick={() =>
                      mutate('PUT', item.productId, item.quantity - 1)
                    }
                    className="px-3 py-1.5 text-lg text-navy disabled:text-gray-300 hover:bg-gray-50"
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 min-w-10 text-center text-sm font-medium">
                    {isBusy ? '…' : item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={isBusy || item.quantity >= item.stock}
                    onClick={() =>
                      mutate('PUT', item.productId, item.quantity + 1)
                    }
                    className="px-3 py-1.5 text-lg text-navy disabled:text-gray-300 hover:bg-gray-50"
                    aria-label="+"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold text-navy whitespace-nowrap">
                  Rp {item.lineTotal.toLocaleString('id-ID')}
                </p>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => mutate('DELETE', item.productId)}
                  className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
                >
                  {t('remove')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-navy mb-4">
            {t('subtotal')}
          </h2>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{t('subtotal')}</span>
            <span className="font-semibold text-navy">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-4">{t('shippingNote')}</p>

          <Link
            href={`/${locale}/checkout`}
            className="block w-full text-center px-6 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors"
          >
            {t('checkout')}
          </Link>

          <Link
            href={`/${locale}/products`}
            className="block w-full text-center mt-3 text-sm text-navy hover:text-orange transition-colors"
          >
            {t('continueShopping')}
          </Link>

          <p className="text-xs text-orange mt-4">{t('demoNotice')}</p>
        </div>
      </aside>
    </div>
  );
}
