'use client';

import { useState } from 'react';
import { products, categories } from '@/data/products';
import ProductGrid from '@/components/products/ProductGrid';

type Language = 'id' | 'en';

export default function ProductsPage() {
  const [locale] = useState<Language>('id');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const text = {
    title: {
      id: 'Katalog Produk',
      en: 'Product Catalog',
    },
    subtitle: {
      id: 'Jelajahi berbagai peralatan pemanas industri berkualitas tinggi',
      en: 'Explore various high-quality industrial heating equipment',
    },
    search: {
      id: 'Cari produk...',
      en: 'Search products...',
    },
    allCategories: {
      id: 'Semua Kategori',
      en: 'All Categories',
    },
    demoNotice: {
      id: '⚠️ Data ini adalah DEMO - Bukan katalog atau harga sebenarnya',
      en: '⚠️ This is DEMO data - Not actual catalog or pricing',
    },
  };

  // Filter produk berdasarkan kategori dan pencarian
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      product.name[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription[locale].toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch && product.status === 'active';
  });

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Page Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{text.title[locale]}</h1>
          <p className="text-lg text-white/90">{text.subtitle[locale]}</p>
        </div>
      </section>

      {/* DEMO Notice */}
      <div className="bg-orange/10 border-l-4 border-orange py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-orange">
            {text.demoNotice[locale]}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={text.search[locale]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {text.allCategories[locale]}
                </button>
                {categories
                  .filter((cat) => cat.status === 'active')
                  .map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-navy text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name[locale]}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} showPrice={false} />
        </div>
      </section>
    </div>
  );
}
