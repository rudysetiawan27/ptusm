'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoutButton from '@/components/auth/LogoutButton';

type Me = {
  authenticated: boolean;
  isAdmin: boolean;
};

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) {
          setMe({ authenticated: data.authenticated, isAdmin: data.isAdmin });
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [pathname]);

  const toggleLanguage = () => {
    const newLocale = locale === 'id' ? 'en' : 'id';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const isAuthenticated = me?.authenticated ?? false;

  return (
    <header className="bg-navy text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="bg-orange px-3 py-1 rounded">
              <span className="text-white font-bold text-xl">IH</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              United Heater
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}`} className="hover:text-orange transition-colors">
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="hover:text-orange transition-colors"
            >
              {t('products')}
            </Link>
            <Link href={`/${locale}/about`} className="hover:text-orange transition-colors">
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-orange transition-colors"
            >
              {t('contact')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href={`/${locale}/cart`}
                  className="hover:text-orange transition-colors"
                >
                  {t('cart')}
                </Link>
                <Link
                  href={`/${locale}/orders`}
                  className="hover:text-orange transition-colors"
                >
                  {t('orders')}
                </Link>
                <Link
                  href={`/${locale}/account`}
                  className="hover:text-orange transition-colors"
                >
                  {t('account')}
                </Link>
              </>
            )}
            {me?.isAdmin && (
              <Link
                href={`/${locale}/admin/companies`}
                className="hover:text-orange transition-colors"
              >
                {t('admin')}
              </Link>
            )}
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
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/${locale}/account`}
                    className="px-4 py-2 hover:bg-white/10 rounded transition-colors text-sm"
                  >
                    {t('account')}
                  </Link>
                  <LogoutButton className="px-4 py-2 bg-orange hover:bg-orange/90 rounded transition-colors text-sm font-medium" />
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="px-4 py-2 hover:bg-white/10 rounded transition-colors text-sm"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="px-4 py-2 bg-orange hover:bg-orange/90 rounded transition-colors text-sm font-medium"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
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
                href={`/${locale}`}
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {t('products')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
              >
                {t('contact')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href={`/${locale}/cart`}
                    className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
                  >
                    {t('cart')}
                  </Link>
                  <Link
                    href={`/${locale}/orders`}
                    className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
                  >
                    {t('orders')}
                  </Link>
                  <Link
                    href={`/${locale}/account`}
                    className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
                  >
                    {t('account')}
                  </Link>
                </>
              )}
              {me?.isAdmin && (
                <Link
                  href={`/${locale}/admin/companies`}
                  className="px-4 py-2 hover:bg-white/10 rounded transition-colors"
                >
                  {t('admin')}
                </Link>
              )}
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                {isAuthenticated ? (
                  <LogoutButton className="block w-full text-left px-4 py-2 hover:bg-white/10 rounded transition-colors" />
                ) : (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      className="block px-4 py-2 hover:bg-white/10 rounded transition-colors"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      className="block px-4 py-2 bg-orange hover:bg-orange/90 rounded transition-colors text-center font-medium"
                    >
                      {t('register')}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
