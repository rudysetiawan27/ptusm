'use client';

import { useState } from 'react';

type Language = 'id' | 'en';

export default function TermsPage() {
  const [locale] = useState<Language>('id');

  const text = {
    title: {
      id: 'Syarat & Ketentuan',
      en: 'Terms & Conditions',
    },
    lastUpdated: {
      id: 'Terakhir diperbarui',
      en: 'Last updated',
    },
    placeholder: {
      id: '⚠️ Ini adalah halaman placeholder - Syarat dan ketentuan lengkap akan ditambahkan sebelum produksi',
      en: '⚠️ This is a placeholder page - Complete terms and conditions will be added before production',
    },
    intro: {
      id: 'Dengan mengakses dan menggunakan layanan e-commerce B2B kami, Anda setuju untuk terikat oleh syarat dan ketentuan berikut.',
      en: 'By accessing and using our B2B e-commerce services, you agree to be bound by the following terms and conditions.',
    },
    sections: {
      account: {
        title: { id: '1. Akun Perusahaan', en: '1. Company Account' },
        content: {
          id: 'Layanan kami khusus untuk perusahaan (B2B). Anda harus mendaftar dengan informasi perusahaan yang valid dan akurat. Akun Anda akan ditinjau dan harus disetujui sebelum dapat mengakses harga dan melakukan pemesanan. Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda.',
          en: 'Our services are exclusively for companies (B2B). You must register with valid and accurate company information. Your account will be reviewed and must be approved before accessing pricing and placing orders. You are responsible for maintaining the confidentiality of your account credentials.',
        },
      },
      pricing: {
        title: { id: '2. Harga dan Pembayaran', en: '2. Pricing and Payment' },
        content: {
          id: 'Harga yang ditampilkan adalah dalam Rupiah dan belum termasuk pajak kecuali dinyatakan lain. Kami berhak mengubah harga tanpa pemberitahuan sebelumnya. Pembayaran harus dilakukan sesuai metode dan jangka waktu yang ditentukan. Pesanan dapat dibatalkan jika pembayaran tidak diterima dalam waktu yang ditentukan.',
          en: 'Prices displayed are in Indonesian Rupiah and exclude taxes unless stated otherwise. We reserve the right to change prices without prior notice. Payment must be made according to specified methods and timeframes. Orders may be cancelled if payment is not received within the specified time.',
        },
      },
      orders: {
        title: { id: '3. Pesanan dan Pengiriman', en: '3. Orders and Delivery' },
        content: {
          id: 'Pesanan yang telah dikonfirmasi tidak dapat dibatalkan kecuali dengan persetujuan kami. Waktu pengiriman yang disebutkan adalah estimasi dan dapat berubah. Kami tidak bertanggung jawab atas keterlambatan pengiriman yang disebabkan oleh faktor di luar kendali kami. Risiko kerusakan atau kehilangan barang beralih kepada Anda setelah penyerahan kepada kurir.',
          en: 'Confirmed orders cannot be cancelled except with our approval. Delivery times mentioned are estimates and may vary. We are not responsible for delivery delays caused by factors beyond our control. Risk of damage or loss transfers to you upon delivery to the courier.',
        },
      },
      returns: {
        title: { id: '4. Pengembalian dan Garansi', en: '4. Returns and Warranty' },
        content: {
          id: 'Produk dapat dikembalikan dalam kondisi tertentu sesuai kebijakan pengembalian kami. Produk cacat atau rusak saat diterima dapat diklaim sesuai garansi yang berlaku. Klaim harus diajukan dalam jangka waktu yang ditentukan dengan bukti yang memadai. Detail lengkap tentang pengembalian dan garansi akan dikomunikasikan saat pembelian.',
          en: 'Products may be returned under certain conditions according to our return policy. Defective or damaged products upon receipt can be claimed under applicable warranty. Claims must be submitted within the specified timeframe with adequate proof. Complete details about returns and warranty will be communicated at purchase.',
        },
      },
      liability: {
        title: { id: '5. Batasan Tanggung Jawab', en: '5. Limitation of Liability' },
        content: {
          id: 'Kami berusaha memberikan informasi produk yang akurat, tetapi tidak menjamin keakuratan, kelengkapan, atau kesesuaian untuk tujuan tertentu. Tanggung jawab kami terbatas pada nilai pesanan yang bersangkutan. Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan kami.',
          en: 'We strive to provide accurate product information but do not guarantee accuracy, completeness, or fitness for a particular purpose. Our liability is limited to the value of the order in question. We are not liable for indirect, incidental, or consequential damages arising from the use of our services.',
        },
      },
      intellectual: {
        title: { id: '6. Kekayaan Intelektual', en: '6. Intellectual Property' },
        content: {
          id: 'Semua konten di website ini, termasuk teks, gambar, logo, dan desain, dilindungi oleh hak cipta dan kekayaan intelektual lainnya. Anda tidak diperkenankan menggunakan, menyalin, atau mendistribusikan konten kami tanpa izin tertulis.',
          en: 'All content on this website, including text, images, logos, and designs, is protected by copyright and other intellectual property rights. You may not use, copy, or distribute our content without written permission.',
        },
      },
      changes: {
        title: { id: '7. Perubahan Syarat', en: '7. Changes to Terms' },
        content: {
          id: 'Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di website. Penggunaan berkelanjutan layanan kami setelah perubahan dianggap sebagai penerimaan terhadap syarat yang diperbarui.',
          en: 'We reserve the right to change these terms and conditions at any time. Changes will take effect immediately upon publication on the website. Continued use of our services after changes constitutes acceptance of the updated terms.',
        },
      },
      governing: {
        title: { id: '8. Hukum yang Berlaku', en: '8. Governing Law' },
        content: {
          id: 'Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui pengadilan yang berwenang di Indonesia.',
          en: 'These terms and conditions are governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes arising will be resolved through the competent courts in Indonesia.',
        },
      },
    },
    note: {
      id: '⚠️ Catatan: Dokumen ini adalah template dasar. Sebelum produksi, syarat dan ketentuan harus ditinjau oleh tim legal dan disesuaikan dengan peraturan yang berlaku dan kebijakan bisnis perusahaan.',
      en: '⚠️ Note: This document is a basic template. Before production, terms and conditions must be reviewed by legal team and adjusted to comply with applicable regulations and company business policies.',
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
