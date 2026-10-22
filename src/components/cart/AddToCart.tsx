'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Props = {
  productId: string;
  stock: number;
  unit: string;
  locale: string;
};

export default function AddToCart({
  productId,
  stock,
  unit,
  locale,
}: Props) {
  const t = useTranslations('product');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
      >
        {t('outOfStock')}
      </button>
    );
  }

  async function handleAdd() {
    setLoading(true);
    setError(null);
    setAdded(false);

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        if (
          data.code === 'NOT_AUTHENTICATED' ||
          data.code === 'NOT_APPROVED'
        ) {
          setError(t('loginToBuy'));
        } else {
          setError(t('addToCartError'));
        }
        return;
      }

      setAdded(true);
    } catch {
      setError(t('addToCartError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t('quantity')}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="quantity"
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              setQuantity(
                Number.isFinite(next)
                  ? Math.min(stock, Math.max(1, Math.trunc(next)))
                  : 1
              );
            }}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
          />
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className="w-full px-6 py-3 bg-orange hover:bg-orange/90 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? t('addToCart') + '…' : t('addToCart')}
      </button>

      {(added || error) && (
        <div className="mt-3 text-sm text-center">
          {added && (
            <p className="text-green-600">
              ✓ {t('addToCartSuccess')}{' '}
              <Link
                href={`/${locale}/cart`}
                className="text-orange hover:underline font-medium"
              >
                {t('viewCart')}
              </Link>
            </p>
          )}
          {error && (
            <p className="text-red-600">
              {error}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-orange hover:underline"
              >
                {locale === 'id' ? 'Masuk' : 'Login'}
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
