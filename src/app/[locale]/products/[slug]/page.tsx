import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { getProductBySlug } from '@/lib/catalog';
import AddToCart from '@/components/cart/AddToCart';

const FALLBACK_IMAGE = {
  url: 'https://placehold.co/600x600/E5E7EB/6B7280?text=No+Image',
  alt: { id: 'Gambar tidak tersedia', en: 'Image not available' },
  isPrimary: true,
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as 'id' | 'en';
  const t = await getTranslations('product');

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images.find((img) => img.isPrimary) ??
    product.images[0] ??
    FALLBACK_IMAGE;

  const showPrice = product.price !== null;

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/${locale}/products`}
            className="text-navy hover:text-orange transition-colors inline-flex items-center"
          >
            {t('backToCatalog')}
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Product Image */}
              <div>
                <div className="relative aspect-square bg-light-gray rounded-lg overflow-hidden mb-4">
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt[locale]}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* DEMO Badge */}
                  <div className="absolute top-4 left-4 bg-orange text-white text-sm font-bold px-3 py-1.5 rounded">
                    DEMO
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {t('demoNotice')}
                </p>
              </div>

              {/* Product Info */}
              <div>
                {/* SKU */}
                <p className="text-sm text-gray-500 mb-2">
                  {t('sku')}: {product.sku}
                </p>

                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                  {product.name[locale]}
                </h1>

                {/* Short Description */}
                <p className="text-lg text-gray-600 mb-6">
                  {product.shortDescription[locale]}
                </p>

                {/* Price or Login CTA */}
                <div className="bg-light-gray border border-gray-200 rounded-lg p-6 mb-6">
                  {showPrice ? (
                    <div>
                      <p className="text-3xl font-bold text-navy mb-2">
                        Rp {product.price!.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        per {product.unit}
                      </p>
                      <p className="text-green-600 font-medium mb-4">
                        ✓ {t('inStock')}: {product.stock ?? 0} {product.unit}
                      </p>
                      <p className="text-xs text-orange mb-4">
                        {t('demoPriceNote')}
                      </p>

                      <AddToCart
                        productId={product.id}
                        stock={product.stock ?? 0}
                        unit={product.unit}
                        locale={locale}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-navy mb-2">
                        {t('loginToViewPrice')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        {t('loginMessage')}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/${locale}/login`}
                          className="flex-1 px-6 py-3 bg-navy hover:bg-orange text-white font-semibold rounded-lg transition-colors text-center"
                        >
                          {locale === 'id' ? 'Masuk' : 'Login'}
                        </Link>
                        <Link
                          href={`/${locale}/register`}
                          className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-navy border-2 border-navy font-semibold rounded-lg transition-colors text-center"
                        >
                          {locale === 'id' ? 'Daftar' : 'Register'}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-navy mb-3">
                    {t('specifications')}
                  </h2>
                  <div className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex border-b border-gray-200 pb-2"
                      >
                        <span className="font-medium text-gray-700 w-1/3">
                          {spec.attribute}
                        </span>
                        <span className="text-gray-600 w-2/3">
                          {spec.value[locale]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Long Description */}
            <div className="border-t border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-navy mb-4">
                {t('description')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {product.longDescription[locale]}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
