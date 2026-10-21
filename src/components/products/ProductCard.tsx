'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useState } from 'react';

type Language = 'id' | 'en';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
}

export default function ProductCard({ product, showPrice = false }: ProductCardProps) {
  const [locale] = useState<Language>('id');

  const text = {
    loginToViewPrice: {
      id: 'Login untuk melihat harga',
      en: 'Log in to view pricing',
    },
    viewDetails: {
      id: 'Lihat Detail',
      en: 'View Details',
    },
    inStock: {
      id: 'Tersedia',
      en: 'In Stock',
    },
  };

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
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
        <Link href={`/products/${product.slug}`}>
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
          {showPrice ? (
            <div>
              <p className="text-2xl font-bold text-navy">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500">per {product.unit}</p>
              <p className="text-sm text-green-600 mt-1">
                ✓ {text.inStock[locale]}
              </p>
            </div>
          ) : (
            <div className="bg-light-gray border border-gray-200 rounded p-3 text-center">
              <p className="text-sm text-gray-700 font-medium">
                {text.loginToViewPrice[locale]}
              </p>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={`/products/${product.slug}`}
          className="block w-full text-center px-4 py-2 bg-navy text-white rounded hover:bg-orange transition-colors"
        >
          {text.viewDetails[locale]}
        </Link>
      </div>
    </div>
  );
}
