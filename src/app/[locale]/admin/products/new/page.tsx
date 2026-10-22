import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { getAdminCategories } from '@/lib/catalog';
import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, isAdmin } = await getAuthContext();

  if (!user) redirect(`/${locale}/login`);
  if (!isAdmin) notFound();

  const t = await getTranslations('admin');
  const categories = await getAdminCategories();

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('newProduct')}</h1>
            <p className="text-white/80">{t('productsSubtitle')}</p>
          </div>
          <AdminNav locale={locale} active="products" />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <ProductForm locale={locale} categories={categories} />
        </div>
      </section>
    </div>
  );
}
