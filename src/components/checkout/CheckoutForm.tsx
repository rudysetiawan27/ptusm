'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type SummaryItem = {
  key: string;
  name: string;
  quantity: number;
  lineTotal: number;
};

type Props = {
  locale: string;
  company: string;
  email: string;
  defaults: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: SummaryItem[];
  subtotal: number;
};

export default function CheckoutForm({
  locale,
  company,
  email,
  defaults,
  items,
  subtotal,
}: Props) {
  const t = useTranslations('checkout');
  const router = useRouter();

  const [form, setForm] = useState({
    recipientName: defaults.recipientName,
    phone: defaults.phone,
    address: defaults.address,
    city: defaults.city,
    postalCode: defaults.postalCode,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        switch (data.code) {
          case 'INVALID_ADDRESS':
            setError(t('errorRequired'));
            break;
          case 'INSUFFICIENT_STOCK':
          case 'PRODUCT_NOT_ACTIVE':
            setError(t('errorStock'));
            break;
          case 'CART_EMPTY':
            setError(t('errorEmpty'));
            break;
          case 'MIGRATION_MISSING':
            setError(t('errorMigration'));
            break;
          default:
            setError(t('errorGeneric'));
        }
        return;
      }

      router.push(`/${locale}/orders/${data.orderNumber}`);
      router.refresh();
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-4">
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
          >
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-800">{company || '-'}</p>
            <p>{email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="recipientName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('recipient')} *
              </label>
              <input
                id="recipientName"
                required
                value={form.recipientName}
                onChange={update('recipientName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('phone')} *
              </label>
              <input
                id="phone"
                required
                value={form.phone}
                onChange={update('phone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('address')} *
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={form.address}
                onChange={update('address')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('city')} *
              </label>
              <input
                id="city"
                required
                value={form.city}
                onChange={update('city')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('postalCode')}
              </label>
              <input
                id="postalCode"
                value={form.postalCode}
                onChange={update('postalCode')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('notes')}
              </label>
              <textarea
                id="notes"
                rows={2}
                maxLength={1000}
                value={form.notes}
                onChange={update('notes')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange resize-none"
              />
            </div>
          </div>
        </div>

        <Link
          href={`/${locale}/cart`}
          className="inline-block text-sm text-navy hover:text-orange"
        >
          {t('backToCart')}
        </Link>
      </div>

      <aside className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-navy mb-4">
            {t('summary')}
          </h2>

          <ul className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span className="text-gray-600">
                  {item.name}{' '}
                  <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="whitespace-nowrap text-gray-800">
                  Rp {item.lineTotal.toLocaleString('id-ID')}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="font-semibold text-navy">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('shipping')}</span>
              <span className="text-gray-500">{t('shippingPending')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold text-navy">{t('total')}</span>
              <span className="font-bold text-navy">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full px-6 py-3 bg-orange hover:bg-orange/90 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? t('submitting') : t('submit')}
          </button>

          <p className="text-xs text-orange mt-4">{t('demoNotice')}</p>
        </div>
      </aside>
    </form>
  );
}
