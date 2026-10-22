'use client';

import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-sm text-white/70">{t('lastUpdated')}: 21 Oktober 2026</p>
        </div>
      </section>
      <div className="bg-orange/10 border-l-4 border-orange py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-orange">{t('placeholder')}</p>
        </div>
      </div>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-8 leading-relaxed">{t('intro')}</p>
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{t('note')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
