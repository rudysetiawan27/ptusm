import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Data pesanan (server-only). Selalu dibatasi ke company milik user yang
 * sedang login — pemanggil wajib memverifikasi keanggotaan lebih dulu.
 */

export type OrderSummary = {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
};

export type OrderItemSnapshot = {
  id: string;
  sku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type ShippingAddress = {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string | null;
  company?: string | null;
  email?: string | null;
};

export type OrderDetail = OrderSummary & {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  currency: string;
  notes: string | null;
  shippingAddress: ShippingAddress;
  items: OrderItemSnapshot[];
};

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  total: number | string;
  subtotal: number | string;
  shipping_cost: number | string;
  tax: number | string;
  discount: number | string;
  currency: string | null;
  notes: string | null;
  shipping_address: ShippingAddress | null;
  order_items: {
    id: string;
    sku: string;
    product_name: string;
    unit_price: number | string;
    quantity: number;
    subtotal: number | string;
  }[];
};

export async function getOrdersForCompany(
  companyId: string
): Promise<OrderSummary[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select(
      'id, order_number, created_at, order_status, payment_status, total, order_items(quantity)'
    )
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[orders] gagal memuat daftar pesanan:', error.message);
    return [];
  }

  type Row = {
    id: string;
    order_number: string;
    created_at: string;
    order_status: string;
    payment_status: string;
    total: number | string;
    order_items: { quantity: number }[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    total: Number(row.total),
    itemCount: (row.order_items ?? []).reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
  }));
}

export async function getOrderDetail(
  companyId: string,
  orderNumber: string
): Promise<OrderDetail | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select(
      `id, order_number, created_at, order_status, payment_status,
       subtotal, shipping_cost, tax, discount, total, currency, notes,
       shipping_address,
       order_items(id, sku, product_name, unit_price, quantity, subtotal)`
    )
    .eq('company_id', companyId)
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    console.error('[orders] gagal memuat detail pesanan:', error.message);
    return null;
  }

  if (!data) return null;

  const row = data as unknown as OrderRow;
  const items = (row.order_items ?? []).map((item) => ({
    id: item.id,
    sku: item.sku,
    productName: item.product_name,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
    subtotal: Number(item.subtotal),
  }));

  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    tax: Number(row.tax),
    discount: Number(row.discount),
    total: Number(row.total),
    currency: row.currency ?? 'IDR',
    notes: row.notes,
    shippingAddress: row.shipping_address ?? {},
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
