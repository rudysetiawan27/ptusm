'use client';

import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-lg text-white/90">{t('subtitle')}</p>
        </div>
      </section>
      <div className="bg-orange/10 border-l-4 border-orange py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-orange">{t('placeholder')}</p>
        </div>
      </div>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">{t('contactInfo.title')}</h2>
              <div className="space-y-4">
                <p className="text-gray-700"><strong>{t('contactInfo.address')}:</strong> {t('placeholderData.address')}</p>
                <p className="text-gray-700"><strong>{t('contactInfo.phone')}:</strong> {t('placeholderData.phone')}</p>
                <p className="text-gray-700"><strong>{t('contactInfo.email')}:</strong> {t('placeholderData.email')}</p>
                <p className="text-gray-700"><strong>{t('contactInfo.hours')}:</strong> {t('placeholderData.hours')}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">{t('form.title')}</h2>
              <div className="bg-orange/10 border border-orange/30 rounded-lg p-3 mb-6">
                <p className="text-sm text-orange">{t('form.notice')}</p>
              </div>
              <p className="text-gray-600">{t('form.title')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
