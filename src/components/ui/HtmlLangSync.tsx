'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

/**
 * Menyelaraskan atribut lang pada <html> dengan locale aktif.
 * Root layout tidak memiliki akses ke params locale, jadi disinkronkan di client.
 */
export default function HtmlLangSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
