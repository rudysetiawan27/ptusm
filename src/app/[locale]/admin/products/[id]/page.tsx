import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { getAdminCategories, getAdminProduct } from '@/lib/catalog';
import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { user, isAdmin } = await getAuthContext();

  if (!user) redirect(`/${locale}/login`);
  if (!isAdmin) notFound();

  const [t, product, categories] = await Promise.all([
    getTranslations('admin'),
    getAdminProduct(id),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('editProduct')}</h1>
            <p className="text-white/80 font-mono text-sm">{product.sku}</p>
          </div>
          <AdminNav locale={locale} active="products" />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <ProductForm
            locale={locale}
            categories={categories}
            initial={{
              id: product.id,
              imageUrl: product.imageUrl ?? '',
              sku: product.sku,
              slug: product.slug,
              nameId: product.nameId,
              nameEn: product.nameEn,
              shortDescriptionId: product.shortDescriptionId,
              shortDescriptionEn: product.shortDescriptionEn,
              longDescriptionId: product.longDescriptionId,
              longDescriptionEn: product.longDescriptionEn,
              categoryId: product.categoryId ?? '',
              status: product.status,
              unit: product.unit,
              price: String(product.price),
              stock: String(product.stock),
            }}
          />
        </div>
      </section>
    </div>
  );
}
