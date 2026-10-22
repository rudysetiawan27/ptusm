import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthContext } from '@/lib/auth/context';
import type { Category, Product } from '@/types/product';

export type Locale = 'id' | 'en';

/**
 * CATATAN PROTEKSI HARGA (PRD 12.1)
 * ---------------------------------
 * Semua fungsi di file ini HANYA dipanggil dari server component.
 * - Kolom price/stock tidak pernah ikut di SELECT katalog.
 * - Harga diambil lewat RPC get_product_pricing() yang memeriksa sesi +
 *   status perusahaan approved di database (supabase/migrations/003).
 * - Bila RPC belum tersedia (migrasi belum dijalankan), dipakai fallback
 *   service-role yang tetap di-gate oleh isApproved di server.
 */

const PRODUCT_SELECT = `
  id,
  sku,
  slug,
  status,
  unit,
  categories(slug),
  product_translations(locale, name, short_description, long_description),
  product_specifications(attribute, value_id, value_en, sort_order),
  product_images(url, alt_id, alt_en, is_primary, sort_order)
`
  .replace(/\s+/g, ' ')
  .trim();

type TranslationRow = {
  locale: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
};

type SpecRow = {
  attribute: string;
  value_id: string;
  value_en: string;
  sort_order: number | null;
};

type ImageRow = {
  url: string;
  alt_id: string | null;
  alt_en: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

type ProductRow = {
  id: string;
  sku: string;
  slug: string;
  status: string;
  unit: string | null;
  categories: { slug: string } | { slug: string }[] | null;
  product_translations: TranslationRow[] | null;
  product_specifications: SpecRow[] | null;
  product_images: ImageRow[] | null;
};

type Pricing = { price: number; stock: number };

function pickTranslation(rows: TranslationRow[] | null, locale: Locale) {
  const list = rows ?? [];
  return (
    list.find((row) => row.locale === locale) ??
    list.find((row) => row.locale === 'id') ??
    list.find((row) => row.locale === 'en') ??
    null
  );
}

function toBilingual(
  rows: TranslationRow[] | null,
  field: 'name' | 'short_description' | 'long_description',
  fallback: string
) {
  const list = rows ?? [];
  const pick = (locale: Locale) =>
    list.find((row) => row.locale === locale)?.[field] ?? '';

  const id = pick('id');
  const en = pick('en');

  return {
    id: id || en || fallback,
    en: en || id || fallback,
  };
}

function mapProduct(
  row: ProductRow,
  locale: Locale,
  pricing?: Pricing
): Product {
  const categorySlug = Array.isArray(row.categories)
    ? row.categories[0]?.slug
    : row.categories?.slug;

  const specs = [...(row.product_specifications ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const images = [...(row.product_images ?? [])].sort(
    (a, b) =>
      Number(b.is_primary ?? false) - Number(a.is_primary ?? false) ||
      (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    category: categorySlug ?? '',
    status: row.status === 'inactive' ? 'inactive' : 'active',
    name: toBilingual(row.product_translations, 'name', row.sku),
    shortDescription: toBilingual(
      row.product_translations,
      'short_description',
      ''
    ),
    longDescription: toBilingual(
      row.product_translations,
      'long_description',
      ''
    ),
    specifications: specs.map((spec) => ({
      attribute: spec.attribute,
      value: { id: spec.value_id, en: spec.value_en },
    })),
    images: images.map((image) => ({
      url: image.url,
      alt: { id: image.alt_id ?? '', en: image.alt_en ?? '' },
      isPrimary: Boolean(image.is_primary),
    })),
    price: pricing ? pricing.price : null,
    stock: pricing ? pricing.stock : null,
    unit: row.unit ?? 'pcs',
  };
}

/**
 * Mengambil harga untuk sekumpulan produk, hanya jika user adalah anggota
 * perusahaan yang sudah approved.
 */
async function getPricingMap(ids: string[]): Promise<Map<string, Pricing>> {
  const map = new Map<string, Pricing>();
  if (ids.length === 0) return map;

  const { isApproved } = await getAuthContext();
  if (!isApproved) return map;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_product_pricing', {
    p_product_ids: ids,
  });

  if (!error && Array.isArray(data)) {
    for (const row of data as {
      product_id: string;
      price: number | string;
      stock: number;
    }[]) {
      map.set(row.product_id, {
        price: Number(row.price),
        stock: Number(row.stock),
      });
    }
    return map;
  }

  console.warn(
    '[catalog] RPC get_product_pricing gagal, memakai fallback service role. ' +
      'Jalankan supabase/migrations/003_price_protection.sql. Pesan:',
    error?.message
  );

  const admin = createAdminClient();
  const { data: rows, error: adminError } = await admin
    .from('products')
    .select('id, price, stock')
    .in('id', ids);

  if (adminError) {
    console.error('[catalog] fallback pricing gagal:', adminError.message);
    return map;
  }

  for (const row of rows ?? []) {
    map.set(row.id, { price: Number(row.price), stock: Number(row.stock) });
  }

  return map;
}

export type CatalogResult = {
  products: Product[];
  pricesVisible: boolean;
};

export async function getCatalog(locale: Locale): Promise<CatalogResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .order('sku', { ascending: true });

  if (error) {
    console.error('[catalog] gagal memuat produk:', error.message);
    return { products: [], pricesVisible: false };
  }

  const rows = (data ?? []) as unknown as ProductRow[];
  const pricing = await getPricingMap(rows.map((row) => row.id));

  return {
    products: rows.map((row) => mapProduct(row, locale, pricing.get(row.id))),
    pricesVisible: pricing.size > 0,
  };
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('[catalog] gagal memuat produk:', error.message);
    return null;
  }

  if (!data) return null;

  const row = data as unknown as ProductRow;
  const pricing = await getPricingMap([row.id]);

  return mapProduct(row, locale, pricing.get(row.id));
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, status, sort_order, category_translations(locale, name)')
    .eq('status', 'active')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[catalog] gagal memuat kategori:', error.message);
    return [];
  }

  type CategoryRow = {
    id: string;
    slug: string;
    status: string;
    category_translations: { locale: string; name: string }[] | null;
  };

  return ((data ?? []) as unknown as CategoryRow[]).map((row) => {
    const translations = row.category_translations ?? [];
    const id = translations.find((t) => t.locale === 'id')?.name ?? '';
    const en = translations.find((t) => t.locale === 'en')?.name ?? '';

    return {
      id: row.id,
      slug: row.slug,
      status: row.status === 'inactive' ? 'inactive' : 'active',
      name: {
        id: id || en || row.slug,
        en: en || id || row.slug,
      },
    };
  });
}

/**
 * Dipakai halaman admin (service role). Sengaja terpisah agar tidak pernah
 * dipanggil dari render publik.
 */
export async function getAdminProducts(): Promise<
  {
    id: string;
    sku: string;
    slug: string;
    status: string;
    unit: string;
    price: number;
    stock: number;
    categoryId: string | null;
    nameId: string;
    nameEn: string;
    imageUrl: string | null;
  }[]
> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('products')
    .select(
      'id, sku, slug, status, unit, price, stock, category_id, product_translations(locale, name), product_images(url, is_primary, sort_order)'
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[catalog] gagal memuat produk admin:', error.message);
    return [];
  }

  type Row = {
    id: string;
    sku: string;
    slug: string;
    status: string;
    unit: string | null;
    price: number | string;
    stock: number;
    category_id: string | null;
    product_translations: { locale: string; name: string }[] | null;
    product_images:
      | { url: string; is_primary: boolean | null; sort_order: number | null }[]
      | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => {
    const translations = row.product_translations ?? [];
    const images = [...(row.product_images ?? [])].sort(
      (a, b) =>
        Number(b.is_primary ?? false) - Number(a.is_primary ?? false) ||
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    return {
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      status: row.status,
      unit: row.unit ?? 'pcs',
      price: Number(row.price),
      stock: Number(row.stock),
      categoryId: row.category_id,
      nameId: translations.find((t) => t.locale === 'id')?.name ?? '',
      nameEn: translations.find((t) => t.locale === 'en')?.name ?? '',
      imageUrl: images[0]?.url ?? null,
    };
  });
}

export function pickName(product: Product, locale: Locale): string {
  return product.name[locale] ?? product.name.id;
}

export type AdminCategory = {
  id: string;
  slug: string;
  status: string;
  sortOrder: number;
  nameId: string;
  nameEn: string;
};

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('categories')
    .select('id, slug, status, sort_order, category_translations(locale, name)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[catalog] gagal memuat kategori admin:', error.message);
    return [];
  }

  type Row = {
    id: string;
    slug: string;
    status: string;
    sort_order: number | null;
    category_translations: { locale: string; name: string }[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => {
    const translations = row.category_translations ?? [];
    return {
      id: row.id,
      slug: row.slug,
      status: row.status,
      sortOrder: row.sort_order ?? 0,
      nameId: translations.find((t) => t.locale === 'id')?.name ?? '',
      nameEn: translations.find((t) => t.locale === 'en')?.name ?? '',
    };
  });
}

export async function getAdminProduct(id: string) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('products')
    .select(
      'id, sku, slug, status, unit, price, stock, category_id, product_translations(locale, name, short_description, long_description), product_images(url, is_primary, sort_order)'
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('[catalog] gagal memuat produk admin:', error.message);
    return null;
  }

  type Row = {
    id: string;
    sku: string;
    slug: string;
    status: string;
    unit: string | null;
    price: number | string;
    stock: number;
    category_id: string | null;
    product_translations: {
      locale: string;
      name: string;
      short_description: string | null;
      long_description: string | null;
    }[] | null;
    product_images:
      | { url: string; is_primary: boolean | null; sort_order: number | null }[]
      | null;
  };

  const row = data as unknown as Row;
  const translations = row.product_translations ?? [];
  const tr = (locale: Locale) =>
    translations.find((t) => t.locale === locale);
  const images = [...(row.product_images ?? [])].sort(
    (a, b) =>
      Number(b.is_primary ?? false) - Number(a.is_primary ?? false) ||
      (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    status: row.status,
    unit: row.unit ?? 'pcs',
    price: Number(row.price),
    stock: Number(row.stock),
    categoryId: row.category_id,
    nameId: tr('id')?.name ?? '',
    nameEn: tr('en')?.name ?? '',
    shortDescriptionId: tr('id')?.short_description ?? '',
    shortDescriptionEn: tr('en')?.short_description ?? '',
    longDescriptionId: tr('id')?.long_description ?? '',
    longDescriptionEn: tr('en')?.long_description ?? '',
    imageUrl: images[0]?.url ?? null,
  };
}

export { pickTranslation };
