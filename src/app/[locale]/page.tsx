import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { getCatalog } from '@/lib/catalog';
import ProductGrid from '@/components/products/ProductGrid';

export default async function Home() {
  const locale = (await getLocale()) as 'id' | 'en';
  const t = await getTranslations('home');

  const { products, pricesVisible } = await getCatalog(locale);
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-navy/90 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/products`}
                className="px-8 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors text-center"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="px-8 py-3 bg-white hover:bg-gray-100 text-navy font-semibold rounded-lg transition-colors text-center"
              >
                {t('hero.register')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            {t('features.title')}
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
                {t('features.quality.title')}
              </h3>
              <p className="text-gray-600">{t('features.quality.desc')}</p>
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
                {t('features.delivery.title')}
              </h3>
              <p className="text-gray-600">{t('features.delivery.desc')}</p>
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
                {t('features.support.title')}
              </h3>
              <p className="text-gray-600">{t('features.support.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              {t('products.title')}
            </h2>
            <p className="text-gray-600">{t('products.subtitle')}</p>
          </div>
          <ProductGrid products={featuredProducts} showPrice={pricesVisible} />
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/products`}
              className="inline-block px-8 py-3 bg-navy hover:bg-orange text-white font-semibold rounded-lg transition-colors"
            >
              {t('products.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link
            href={`/${locale}/register`}
            className="inline-block px-8 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
