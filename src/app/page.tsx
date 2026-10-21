'use client';

import Link from 'next/link';
import { products } from '@/data/products';
import ProductGrid from '@/components/products/ProductGrid';
import { useState } from 'react';

type Language = 'id' | 'en';

export default function Home() {
  const [locale] = useState<Language>('id');

  const text = {
    hero: {
      title: {
        id: 'Solusi Peralatan Pemanas Industri Terpercaya',
        en: 'Trusted Industrial Heating Equipment Solutions',
      },
      subtitle: {
        id: 'Peralatan pemanas berkualitas tinggi untuk berbagai kebutuhan industri Anda',
        en: 'High-quality heating equipment for various industrial needs',
      },
      cta: {
        id: 'Lihat Katalog',
        en: 'View Catalog',
      },
      register: {
        id: 'Daftar sebagai Perusahaan',
        en: 'Register as Company',
      },
    },
    features: {
      title: {
        id: 'Mengapa Memilih Kami',
        en: 'Why Choose Us',
      },
      quality: {
        title: { id: 'Kualitas Terjamin', en: 'Guaranteed Quality' },
        desc: {
          id: 'Produk berkualitas tinggi dari manufaktur terpercaya',
          en: 'High-quality products from trusted manufacturers',
        },
      },
      delivery: {
        title: { id: 'Pengiriman Cepat', en: 'Fast Delivery' },
        desc: {
          id: 'Pengiriman ke seluruh Indonesia dengan berbagai pilihan kurir',
          en: 'Delivery across Indonesia with various courier options',
        },
      },
      support: {
        title: { id: 'Dukungan Profesional', en: 'Professional Support' },
        desc: {
          id: 'Tim ahli siap membantu kebutuhan teknis Anda',
          en: 'Expert team ready to help with your technical needs',
        },
      },
    },
    products: {
      title: {
        id: 'Produk Unggulan',
        en: 'Featured Products',
      },
      subtitle: {
        id: 'Lihat beberapa produk populer kami',
        en: 'Check out some of our popular products',
      },
      viewAll: {
        id: 'Lihat Semua Produk',
        en: 'View All Products',
      },
    },
    cta: {
      title: {
        id: 'Siap untuk Memulai?',
        en: 'Ready to Get Started?',
      },
      subtitle: {
        id: 'Daftarkan perusahaan Anda dan dapatkan akses ke harga khusus B2B',
        en: 'Register your company and get access to special B2B pricing',
      },
      button: {
        id: 'Daftar Sekarang',
        en: 'Register Now',
      },
    },
  };

  // Tampilkan 4 produk pertama
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-navy/90 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {text.hero.title[locale]}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {text.hero.subtitle[locale]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-8 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors text-center"
              >
                {text.hero.cta[locale]}
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-white hover:bg-gray-100 text-navy font-semibold rounded-lg transition-colors text-center"
              >
                {text.hero.register[locale]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            {text.features.title[locale]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-xl font-semibold text-navy mb-2">
                {text.features.quality.title[locale]}
              </h3>
              <p className="text-gray-600">{text.features.quality.desc[locale]}</p>
            </div>

            {/* Delivery */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                {text.features.delivery.title[locale]}
              </h3>
              <p className="text-gray-600">{text.features.delivery.desc[locale]}</p>
            </div>

            {/* Support */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                {text.features.support.title[locale]}
              </h3>
              <p className="text-gray-600">{text.features.support.desc[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              {text.products.title[locale]}
            </h2>
            <p className="text-gray-600">{text.products.subtitle[locale]}</p>
          </div>
          <ProductGrid products={featuredProducts} showPrice={false} />
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-navy hover:bg-orange text-white font-semibold rounded-lg transition-colors"
            >
              {text.products.viewAll[locale]}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{text.cta.title[locale]}</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {text.cta.subtitle[locale]}
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors"
          >
            {text.cta.button[locale]}
          </Link>
        </div>
      </section>
    </div>
  );
}
