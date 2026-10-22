import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

type Props = {
  locale: string;
  active: 'companies' | 'products' | 'categories';
};

export default async function AdminNav({ locale, active }: Props) {
  const t = await getTranslations('admin');

  const items = [
    {
      key: 'companies' as const,
      href: `/${locale}/admin/companies`,
      label: t('navCompanies'),
    },
    {
      key: 'products' as const,
      href: `/${locale}/admin/products`,
      label: t('navProducts'),
    },
    {
      key: 'categories' as const,
      href: `/${locale}/admin/categories`,
      label: t('navCategories'),
    },
  ];

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === item.key
              ? 'bg-orange text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
