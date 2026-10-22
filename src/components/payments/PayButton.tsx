'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Props = {
  orderNumber: string;
  locale: string;
};

export default function PayButton({ orderNumber, locale }: Props) {
  const t = useTranslations('order');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/payments/midtrans/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, locale }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        switch (data.code) {
          case 'PAYMENT_NOT_CONFIGURED':
          case 'MIGRATION_MISSING':
            setError(t('paymentNotConfigured'));
            break;
          case 'ALREADY_PAID':
            setError(t('paymentAlreadyPaid'));
            router.refresh();
            break;
          case 'PAYMENT_PENDING':
            setError(t('paymentPendingRetry'));
            break;
          case 'ORDER_CANCELLED':
            setError(t('paymentOrderCancelled'));
            break;
          default:
            setError(t('paymentError'));
        }
        return;
      }

      // Redirect ke halaman Midtrans Snap.
      window.location.assign(data.redirectUrl);
    } catch {
      setError(t('paymentError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sm:text-right">
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="px-6 py-3 bg-orange hover:bg-orange/90 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? t('paying') : t('payNow')}
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <p className="text-xs text-orange mt-2">{t('paymentSandboxNote')}</p>
    </div>
  );
}
