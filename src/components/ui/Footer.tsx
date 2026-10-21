'use client';

import Link from 'next/link';
import { useState } from 'react';

type Language = 'id' | 'en';

export default function Footer() {
  const [locale] = useState<Language>('id');

  const footer = {
    company: { id: 'Perusahaan', en: 'Company' },
    about: { id: 'Tentang Kami', en: 'About Us' },
    contact: { id: 'Kontak', en: 'Contact' },
    products: { id: 'Produk', en: 'Products' },
    legal: { id: 'Legal', en: 'Legal' },
    privacy: { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
    terms: { id: 'Syarat & Ketentuan', en: 'Terms & Conditions' },
    contactInfo: { id: 'Informasi Kontak', en: 'Contact Information' },
    email: 'info@industrialheating.com',
    phone: '+62 21 1234 5678',
    address: {
      id: 'Jakarta, Indonesia',
      en: 'Jakarta, Indonesia',
    },
    copyright: {
      id: '© 2024 Industrial Heating. Semua hak dilindungi.',
      en: '© 2024 Industrial Heating. All rights reserved.',
    },
    placeholder: {
      id: '⚠️ Ini adalah placeholder identitas perusahaan',
      en: '⚠️ This is a company identity placeholder',
    },
  };

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
              <span className="font-semibold">Industrial Heating</span>
            </div>
            <p className="text-sm text-white/70 mb-2">
              {footer.placeholder[locale]}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">{footer.company[locale]}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {footer.about[locale]}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {footer.products[locale]}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {footer.contact[locale]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold mb-3">{footer.contactInfo[locale]}</h3>
            <ul className="space-y-2 text-sm text-white/70 mb-4">
              <li>{footer.email}</li>
              <li>{footer.phone}</li>
              <li>{footer.address[locale]}</li>
            </ul>
            <h3 className="font-semibold mb-3">{footer.legal[locale]}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {footer.privacy[locale]}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/70 hover:text-orange transition-colors"
                >
                  {footer.terms[locale]}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/70">
          {footer.copyright[locale]}
        </div>
      </div>
    </footer>
  );
}
