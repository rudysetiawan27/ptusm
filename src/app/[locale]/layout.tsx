import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import HtmlLangSync from "@/components/ui/HtmlLangSync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validasi locale
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Aktifkan static rendering untuk locale ini
  setRequestLocale(locale);

  // Dapatkan messages untuk locale ini
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangSync />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
