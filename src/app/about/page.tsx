'use client';

import { useState } from 'react';

type Language = 'id' | 'en';

export default function AboutPage() {
  const [locale] = useState<Language>('id');

  const text = {
    title: {
      id: 'Tentang Kami',
      en: 'About Us',
    },
    subtitle: {
      id: 'Supplier Terpercaya Peralatan Pemanas Industri',
      en: 'Trusted Supplier of Industrial Heating Equipment',
    },
    placeholder: {
      id: '⚠️ Ini adalah halaman placeholder',
      en: '⚠️ This is a placeholder page',
    },
    content: {
      id: 'Informasi lengkap tentang perusahaan akan ditambahkan setelah identitas brand dan konten perusahaan tersedia.',
      en: 'Complete company information will be added after brand identity and company content are available.',
    },
    mission: {
      title: { id: 'Misi Kami', en: 'Our Mission' },
      content: {
        id: 'Menyediakan solusi peralatan pemanas industri berkualitas tinggi dengan layanan profesional untuk mendukung pertumbuhan bisnis pelanggan.',
        en: 'To provide high-quality industrial heating equipment solutions with professional service to support our customers\' business growth.',
      },
    },
    values: {
      title: { id: 'Nilai Perusahaan', en: 'Company Values' },
      quality: {
        title: { id: 'Kualitas', en: 'Quality' },
        desc: {
          id: 'Produk berkualitas tinggi dari manufaktur terpercaya',
          en: 'High-quality products from trusted manufacturers',
        },
      },
      trust: {
        title: { id: 'Kepercayaan', en: 'Trust' },
        desc: {
          id: 'Membangun hubungan jangka panjang dengan pelanggan',
          en: 'Building long-term relationships with customers',
        },
      },
      innovation: {
        title: { id: 'Inovasi', en: 'Innovation' },
        desc: {
          id: 'Terus berinovasi untuk solusi terbaik',
          en: 'Continuously innovating for the best solutions',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Page Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{text.title[locale]}</h1>
          <p className="text-lg text-white/90">{text.subtitle[locale]}</p>
        </div>
      </section>

      {/* Placeholder Notice */}
      <div className="bg-orange/10 border-l-4 border-orange py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-orange">
            {text.placeholder[locale]}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <p className="text-gray-600 mb-6">{text.content[locale]}</p>

            {/* Mission */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-navy mb-4">
                {text.mission.title[locale]}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {text.mission.content[locale]}
              </p>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-6">
                {text.values.title[locale]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-navy mb-2">
                    {text.values.quality.title[locale]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {text.values.quality.desc[locale]}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-navy mb-2">
                    {text.values.trust.title[locale]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {text.values.trust.desc[locale]}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-orange"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-navy mb-2">
                    {text.values.innovation.title[locale]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {text.values.innovation.desc[locale]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
