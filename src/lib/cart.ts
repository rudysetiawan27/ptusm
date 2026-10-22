import { createAdminClient } from '@/lib/supabase/admin';
import type { Locale } from '@/lib/catalog';

/**
 * Lapisan data keranjang (server-only).
 *
 * Catatan keamanan:
 * - Fungsi di sini hanya dipanggil dari server (page/route) setelah
 *   `getAuthContext()` memastikan user login dan perusahaannya approved.
 * - Harga di keranjang HANYA untuk tampilan. Saat checkout, harga dihitung
 *   ulang dari tabel products di dalam RPC create_order_from_cart().
 */

export type CartLine = {
  id: string;
  productId: string;
  sku: string;
  slug: string;
  name: { id: string; en: string };
  unit: string;
  quantity: number;
  price: number;
  stock: number;
  lineTotal: number;
  imageUrl: string | null;
};

export type CartSummary = {
  cartId: string | null;
  items: CartLine[];
  subtotal: number;
  itemCount: number;
};

export const emptyCart: CartSummary = {
  cartId: null,
  items: [],
  subtotal: 0,
  itemCount: 0,
};

type CartItemRow = {
  id: string;
  product_id: string;
  quantity: number;
  products:
    | {
        sku: string;
        slug: string;
        unit: string | null;
        price: number | string;
        stock: number;
        status: string;
        product_translations:
          | { locale: string; name: string }[]
          | null;
        product_images:
          | {
              url: string;
              is_primary: boolean | null;
              sort_order: number | null;
            }[]
          | null;
      }
    | {
        sku: string;
        slug: string;
        unit: string | null;
        price: number | string;
        stock: number;
        status: string;
        product_translations:
          | { locale: string; name: string }[]
          | null;
        product_images:
          | {
              url: string;
              is_primary: boolean | null;
              sort_order: number | null;
            }[]
          | null;
      }[]
    | null;
};

export async function getActiveCartId(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('[cart] gagal mencari cart:', error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function getOrCreateCartId(userId: string): Promise<string | null> {
  const existing = await getActiveCartId(userId);
  if (existing) return existing;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('carts')
    .insert({ user_id: userId, status: 'active' })
    .select('id')
    .single();

  if (error) {
    // Race condition: user lain/request lain membuat cart lebih dulu.
    if (error.code === '23505') {
      return getActiveCartId(userId);
    }
    console.error('[cart] gagal membuat cart:', error.message);
    return null;
  }

  return data.id;
}

function pickProduct(row: CartItemRow) {
  return Array.isArray(row.products) ? row.products[0] ?? null : row.products;
}

export async function getCartForUser(userId: string): Promise<CartSummary> {
  const cartId = await getActiveCartId(userId);
  if (!cartId) return emptyCart;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('cart_items')
    .select(
      `id, product_id, quantity,
       products(
         sku, slug, unit, price, stock, status,
         product_translations(locale, name),
         product_images(url, is_primary, sort_order)
       )`
    )
    .eq('cart_id', cartId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[cart] gagal memuat item:', error.message);
    return { ...emptyCart, cartId };
  }

  const items: CartLine[] = [];

  for (const row of (data ?? []) as unknown as CartItemRow[]) {
    const product = pickProduct(row);
    if (!product) continue;

    const translations = product.product_translations ?? [];
    const nameId =
      translations.find((t) => t.locale === 'id')?.name ?? product.sku;
    const nameEn =
      translations.find((t) => t.locale === 'en')?.name ?? nameId;

    const images = [...(product.product_images ?? [])].sort(
      (a, b) =>
        Number(b.is_primary ?? false) - Number(a.is_primary ?? false) ||
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    const price = Number(product.price);

    items.push({
      id: row.id,
      productId: row.product_id,
      sku: product.sku,
      slug: product.slug,
      name: { id: nameId, en: nameEn },
      unit: product.unit ?? 'pcs',
      quantity: row.quantity,
      price,
      stock: product.stock,
      lineTotal: price * row.quantity,
      imageUrl: images[0]?.url ?? null,
    });
  }

  return {
    cartId,
    items,
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function cartLineName(line: CartLine, locale: Locale): string {
  return line.name[locale] ?? line.name.id;
}
