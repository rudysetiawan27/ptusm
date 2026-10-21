'use client';

import { useState } from 'react';

type Language = 'id' | 'en';

export default function PrivacyPage() {
  const [locale] = useState<Language>('id');

  const text = {
    title: {
      id: 'Kebijakan Privasi',
      en: 'Privacy Policy',
    },
    lastUpdated: {
      id: 'Terakhir diperbarui',
      en: 'Last updated',
    },
    placeholder: {
      id: '⚠️ Ini adalah halaman placeholder - Kebijakan privasi lengkap akan ditambahkan sebelum produksi',
      en: '⚠️ This is a placeholder page - Complete privacy policy will be added before production',
    },
    intro: {
      id: 'Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda ketika menggunakan layanan e-commerce B2B kami.',
      en: 'This privacy policy explains how we collect, use, and protect your personal information when using our B2B e-commerce services.',
    },
    sections: {
      collection: {
        title: { id: '1. Informasi yang Kami Kumpulkan', en: '1. Information We Collect' },
        content: {
          id: 'Kami mengumpulkan informasi yang Anda berikan saat mendaftar akun perusahaan, melakukan pemesanan, dan berkomunikasi dengan kami. Ini termasuk nama, email, nomor telepon, informasi perusahaan, dan alamat pengiriman.',
          en: 'We collect information you provide when registering a company account, placing orders, and communicating with us. This includes name, email, phone number, company information, and shipping addresses.',
        },
      },
      usage: {
        title: { id: '2. Penggunaan Informasi', en: '2. Use of Information' },
        content: {
          id: 'Informasi Anda digunakan untuk memproses pesanan, mengelola akun, memberikan dukungan pelanggan, dan meningkatkan layanan kami. Kami tidak akan menjual atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.',
          en: 'Your information is used to process orders, manage accounts, provide customer support, and improve our services. We will not sell or share your personal information with third parties without your consent.',
        },
      },
      security: {
        title: { id: '3. Keamanan Data', en: '3. Data Security' },
        content: {
          id: 'Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran. Data sensitif dienkripsi selama transmisi dan penyimpanan.',
          en: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Sensitive data is encrypted during transmission and storage.',
        },
      },
      rights: {
        title: { id: '4. Hak Anda', en: '4. Your Rights' },
        content: {
          id: 'Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus informasi pribadi Anda. Anda juga dapat meminta kami untuk membatasi pemrosesan data Anda atau menolak pemrosesan tertentu.',
          en: 'You have the right to access, correct, or delete your personal information. You may also request us to restrict data processing or object to certain processing.',
        },
      },
      cookies: {
        title: { id: '5. Cookies', en: '5. Cookies' },
        content: {
          id: 'Website kami menggunakan cookies untuk meningkatkan pengalaman pengguna, menganalisis lalu lintas, dan menyimpan preferensi Anda. Anda dapat mengatur browser untuk menolak cookies, tetapi beberapa fitur mungkin tidak berfungsi dengan baik.',
          en: 'Our website uses cookies to enhance user experience, analyze traffic, and store your preferences. You can set your browser to refuse cookies, but some features may not work properly.',
        },
      },
      contact: {
        title: { id: '6. Hubungi Kami', en: '6. Contact Us' },
        content: {
          id: 'Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau bagaimana kami menangani data Anda, silakan hubungi kami di info@industrialheating.com (placeholder).',
          en: 'If you have questions about this privacy policy or how we handle your data, please contact us at info@industrialheating.com (placeholder).',
        },
      },
    },
    note: {
      id: '⚠️ Catatan: Dokumen ini adalah template dasar. Sebelum produksi, kebijakan privasi harus ditinjau oleh tim legal dan disesuaikan dengan peraturan yang berlaku (misalnya GDPR, UU PDP Indonesia).',
      en: '⚠️ Note: This document is a basic template. Before production, the privacy policy must be reviewed by legal team and adjusted to comply with applicable regulations (e.g., GDPR, Indonesian PDP Law).',
    },
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Page Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{text.title[locale]}</h1>
          <p className="text-sm text-white/70">
            {text.lastUpdated[locale]}: 21 Oktober 2026
          </p>
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
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Introduction */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              {text.intro[locale]}
            </p>

            {/* Sections */}
            <div className="space-y-6">
              {Object.values(text.sections).map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-semibold text-navy mb-3">
                    {section.title[locale]}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content[locale]}
                  </p>
                </div>
              ))}
            </div>

            {/* Legal Notice */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{text.note[locale]}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
