'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
}

export default function ProductCard({ product, showPrice = false }: ProductCardProps) {
  const locale = useLocale() as 'id' | 'en';
  const t = useTranslations('product');

  const primaryImage =
    product.images.find((img) => img.isPrimary) ??
    product.images[0] ?? {
      url: 'https://placehold.co/600x400/E5E7EB/6B7280?text=No+Image',
      alt: { id: 'Gambar tidak tersedia', en: 'Image not available' },
      isPrimary: true,
    };

  const canShowPrice = showPrice && product.price !== null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <Link href={`/${locale}/products/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-light-gray">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt[locale]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* DEMO Badge */}
          <div className="absolute top-2 left-2 bg-orange text-white text-xs font-bold px-2 py-1 rounded">
            DEMO
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* SKU */}
        <p className="text-xs text-gray-500 mb-1">{product.sku}</p>

        {/* Product Name */}
        <Link href={`/${locale}/products/${product.slug}`}>
          <h3 className="font-semibold text-navy text-lg mb-2 hover:text-orange transition-colors line-clamp-2">
            {product.name[locale]}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription[locale]}
        </p>

        {/* Key Spec */}
        {product.specifications.length > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium">{product.specifications[0].attribute}:</span>{' '}
            {product.specifications[0].value[locale]}
          </div>
        )}

        {/* Price or Login CTA */}
        <div className="mb-3">
          {canShowPrice ? (
            <div>
              <p className="text-2xl font-bold text-navy">
                Rp {product.price!.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500">per {product.unit}</p>
              <p className="text-sm text-green-600 mt-1">
                ✓ {t('inStock')} ({product.stock ?? 0} {product.unit})
              </p>
              <p className="text-xs text-orange mt-1">{t('demoPriceNote')}</p>
            </div>
          ) : (
            <div className="bg-light-gray border border-gray-200 rounded p-3 text-center">
              <p className="text-sm text-gray-700 font-medium">
                {t('loginToViewPrice')}
              </p>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="block w-full text-center px-4 py-2 bg-navy text-white rounded hover:bg-orange transition-colors"
        >
          {t('viewDetails')}
        </Link>
      </div>
    </div>
  );
}
