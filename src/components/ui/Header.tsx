'use client';

import Link from 'next/link';
import { useState } from 'react';

type Language = 'id' | 'en';

export default function Header() {
  const [locale, setLocale] = useState<Language>('id');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === 'id' ? 'en' : 'id');
  };

  const nav = {
    home: { id: 'Beranda', en: 'Home' },
    products: { id: 'Produk', en: 'Products' },
    about: { id: 'Tentang', en: 'About' },
    contact: { id: 'Kontak', en: 'Contact' },
    login: { id: 'Masuk', en: 'Login' },
    register: { id: 'Daftar', en: 'Register' },
  };

  return (
    <header className="bg-navy text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-orange px-3 py-1 rounded">
              <span className="text-white font-bold text-xl">IH</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              Industrial Heating
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-orange transition-colors">
              {nav.home[locale]}
            </Link>
            <Link
              href="/products"
              className="hover:text-orange transition-colors"
            >
              {nav.products[locale]}
            </Link>
            <Link href="/about" className="hover:text-orange transition-colors">
              {nav.about[locale]}
            </Link>
            <Link
              href="/contact"
              className="hover:text-orange transition-colors"
            >
              {nav.contact[locale]}
            </Link>
          </nav>

          {/* Right Side: Language Switcher & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border border-white/30 rounded hover:bg-white/10 transition-colors text-sm"
              aria-label="Toggle language"
            >
              {locale === 'id' ? 'EN' : 'ID'}
            </button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors text-sm"
              >
                {nav.login[locale]}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-orange hover:bg-orange/90 rounded transition-colors text-sm font-medium"
              >
                {nav.register[locale]}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {nav.home[locale]}
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {nav.products[locale]}
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {nav.about[locale]}
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {nav.contact[locale]}
              </Link>
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-white/10 rounded transition-colors"
                >
                  {nav.login[locale]}
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-orange hover:bg-orange/90 rounded transition-colors text-center font-medium"
                >
                  {nav.register[locale]}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
