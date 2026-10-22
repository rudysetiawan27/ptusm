'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-orange px-3 py-1 rounded">
                <span className="text-white font-bold text-xl">IH</span>
              </div>
              <span className="font-semibold">United Heater</span>
            </div>
            <p className="text-sm text-white/70 mb-2">
              {t('placeholder')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">{t('company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold mb-3">{t('contactInfo')}</h3>
            <ul className="space-y-2 text-sm text-white/70 mb-4">
              <li>{t('email')}</li>
              <li>{t('phone')}</li>
              <li>{t('address')}</li>
            </ul>
            <h3 className="font-semibold mb-3">{t('legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/70">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
