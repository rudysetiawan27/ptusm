import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAuthContext } from '@/lib/auth/context';
import { getAdminProducts, getAdminCategories } from '@/lib/catalog';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-200 text-gray-700',
  draft: 'bg-yellow-100 text-yellow-800',
};

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, isAdmin } = await getAuthContext();

  if (!user) redirect(`/${locale}/login`);
  if (!isAdmin) notFound();

  const t = await getTranslations('admin');
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  const categoryName = new Map(
    categories.map((category) => [
      category.id,
      category.nameId || category.nameEn || category.slug,
    ])
  );

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('productsTitle')}</h1>
            <p className="text-white/80">{t('productsSubtitle')}</p>
          </div>
          <AdminNav locale={locale} active="products" />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex justify-end">
            <Link
              href={`/${locale}/admin/products/new`}
              className="px-5 py-2.5 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg transition-colors"
            >
              + {t('newProduct')}
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            {products.length === 0 ? (
              <p className="p-6 text-gray-600">{t('productEmpty')}</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('productImage')}
                    </th>
                    <th className="text-left px-4 py-3 font-medium">{t('sku')}</th>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('nameId')}
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('categoryLabel')}
                    </th>
                    <th className="text-right px-4 py-3 font-medium">
                      {t('price')}
                    </th>
                    <th className="text-right px-4 py-3 font-medium">
                      {t('stock')}
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      {t('status')}
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-light-gray border border-gray-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.nameId || product.sku}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              —
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 text-navy font-medium">
                        {product.nameId || product.nameEn || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.categoryId
                          ? categoryName.get(product.categoryId) ?? '-'
                          : t('noCategory')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {product.stock} {product.unit}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[product.status] ?? statusStyles.draft
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/${locale}/admin/products/${product.id}`}
                          className="text-orange hover:text-orange/80 font-medium"
                        >
                          {t('editProduct')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
