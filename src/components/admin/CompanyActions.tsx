'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Props = {
  companyId: string;
};

export default function CompanyActions({ companyId }: Props) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [loading, setLoading] = useState<null | 'approve' | 'reject'>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: 'approve' | 'reject') {
    setError(null);
    setLoading(action);

    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, action, reason }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message ?? t('error'));
        return;
      }

      setShowReason(false);
      setReason('');
      router.refresh();
    } catch {
      setError(t('error'));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => submit('approve')}
          disabled={loading !== null}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm rounded transition-colors"
        >
          {loading === 'approve' ? t('processing') : t('approve')}
        </button>
        <button
          type="button"
          onClick={() => setShowReason((v) => !v)}
          disabled={loading !== null}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm rounded transition-colors"
        >
          {t('reject')}
        </button>
      </div>

      {showReason && (
        <div className="space-y-2">
          <label htmlFor={`reason-${companyId}`} className="sr-only">
            {t('reason')}
          </label>
          <textarea
            id={`reason-${companyId}`}
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('reasonPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange"
          />
          <button
            type="button"
            onClick={() => submit('reject')}
            disabled={loading !== null || reason.trim().length === 0}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm rounded transition-colors"
          >
            {loading === 'reject' ? t('processing') : t('reject')}
          </button>
        </div>
      )}
    </div>
  );
}
