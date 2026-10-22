import { getLocale, getTranslations } from 'next-intl/server';
import { getCatalog, getCategories } from '@/lib/catalog';
import CatalogBrowser from '@/components/products/CatalogBrowser';

export default async function ProductsPage() {
  const locale = (await getLocale()) as 'id' | 'en';
  const t = await getTranslations('catalog');

  const [{ products, pricesVisible }, categories] = await Promise.all([
    getCatalog(locale),
    getCategories(locale),
  ]);

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Page Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-lg text-white/90">{t('subtitle')}</p>
        </div>
      </section>

      {/* DEMO Notice */}
      <div className="bg-orange/10 border-l-4 border-orange py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-orange">{t('demoNotice')}</p>
        </div>
      </div>

      {/* Filters, Search & Product Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <CatalogBrowser
            products={products}
            categories={categories}
            showPrice={pricesVisible}
          />
        </div>
      </section>
    </div>
  );
}
