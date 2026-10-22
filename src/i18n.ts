import { getRequestConfig } from 'next-intl/server';

// Bahasa yang didukung
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'id';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale);
}

export default getRequestConfig(async ({ requestLocale, locale }) => {
  // `locale` hanya terisi bila pemanggil memberi locale eksplisit
  // (mis. getMessages({ locale })). Selain itu gunakan segmen [locale].
  const requested = locale ?? (await requestLocale);

  // Locale tidak dikenal (mis. /unknown.txt yang cocok dengan [locale])
  // diganti ke locale default, bukan 404.
  const resolved: Locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`./messages/${resolved}.json`)).default,
  };
});
