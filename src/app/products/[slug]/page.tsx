'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';

type Language = 'id' | 'en';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [locale] = useState<Language>('id');
  const [showPrice] = useState<boolean>(false); // Simulasi: user belum login

  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const text = {
    backToCatalog: {
      id: '← Kembali ke Katalog',
      en: '← Back to Catalog',
    },
    sku: {
      id: 'SKU',
      en: 'SKU',
    },
    specifications: {
      id: 'Spesifikasi Teknis',
      en: 'Technical Specifications',
    },
    description: {
      id: 'Deskripsi Produk',
      en: 'Product Description',
    },
    loginToViewPrice: {
      id: 'Login untuk melihat harga',
      en: 'Log in to view pricing',
    },
    loginMessage: {
      id: 'Harga dan informasi stok hanya tersedia untuk akun perusahaan yang telah disetujui.',
      en: 'Pricing and stock information are only available for approved company accounts.',
    },
    loginButton: {
      id: 'Login',
      en: 'Login',
    },
    registerButton: {
      id: 'Daftar sebagai Perusahaan',
      en: 'Register as Company',
    },
    addToCart: {
      id: 'Tambah ke Keranjang',
      en: 'Add to Cart',
    },
    inStock: {
      id: 'Stok Tersedia',
      en: 'In Stock',
    },
    quantity: {
      id: 'Kuantitas',
      en: 'Quantity',
    },
    demoNotice: {
      id: '⚠️ Ini adalah produk DEMO',
      en: '⚠️ This is a DEMO product',
    },
  };

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/products"
            className="text-navy hover:text-orange transition-colors inline-flex items-center"
          >
            {text.backToCatalog[locale]}
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
                  {text.demoNotice[locale]}
                </p>
              </div>

              {/* Product Info */}
              <div>
                {/* SKU */}
                <p className="text-sm text-gray-500 mb-2">
                  {text.sku[locale]}: {product.sku}
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
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        per {product.unit}
                      </p>
                      <p className="text-green-600 font-medium mb-4">
                        ✓ {text.inStock[locale]}: {product.stock} {product.unit}
                      </p>

                      {/* Quantity Selector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {text.quantity[locale]}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          defaultValue="1"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-full px-6 py-3 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors">
                        {text.addToCart[locale]}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-navy mb-2">
                        {text.loginToViewPrice[locale]}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        {text.loginMessage[locale]}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/login"
                          className="flex-1 px-6 py-3 bg-navy hover:bg-orange text-white font-semibold rounded-lg transition-colors text-center"
                        >
                          {text.loginButton[locale]}
                        </Link>
                        <Link
                          href="/register"
                          className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-navy border-2 border-navy font-semibold rounded-lg transition-colors text-center"
                        >
                          {text.registerButton[locale]}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-navy mb-3">
                    {text.specifications[locale]}
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
                {text.description[locale]}
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
