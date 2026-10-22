import crypto from 'node:crypto';

/**
 * Integrasi Midtrans Snap (server-only).
 *
 * Tidak ada SDK: Snap cukup dipanggil lewat HTTPS dengan Basic Auth
 * server key. Server key TIDAK boleh pernah sampai ke browser.
 */

const SNAP_SANDBOX = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const SNAP_PRODUCTION = 'https://app.midtrans.com/snap/v1/transactions';

export type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  transaction_id?: string;
  fraud_status?: string;
  payment_type?: string;
  [key: string]: unknown;
};

export type SnapItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type SnapCustomer = {
  firstName: string;
  email?: string | null;
  phone?: string | null;
};

export type MidtransConfig = {
  serverKey: string | null;
  isProduction: boolean;
  configured: boolean;
};

export function getMidtransConfig(): MidtransConfig {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim() || null;
  return {
    serverKey,
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    configured: Boolean(serverKey),
  };
}

/**
 * Signature Midtrans = SHA512(order_id + status_code + gross_amount + server_key).
 * Perbandingan dilakukan constant-time.
 */
export function verifyMidtransSignature(
  payload: MidtransNotification
): boolean {
  const { serverKey } = getMidtransConfig();
  const orderId = payload.order_id;
  const statusCode = payload.status_code;
  const grossAmount = payload.gross_amount;
  const signature = payload.signature_key;

  if (!serverKey || !orderId || !statusCode || !grossAmount || !signature) {
    return false;
  }

  const expected = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  const given = signature.toLowerCase();

  if (expected.length !== given.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'utf8'),
    Buffer.from(given, 'utf8')
  );
}

/** Kunci idempotensi: hash dari body mentah notifikasi. */
export function buildEventId(rawBody: string): string {
  return crypto.createHash('sha256').update(rawBody).digest('hex');
}

export type MappedPaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'refunded';

export type MappedPayment = {
  paymentStatus: MappedPaymentStatus;
  orderStatus: 'confirmed' | 'cancelled' | null;
};

export function mapMidtransStatus(
  transactionStatus?: string,
  fraudStatus?: string
): MappedPayment | null {
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'accept') {
        return { paymentStatus: 'paid', orderStatus: 'confirmed' };
      }
      if (fraudStatus === 'challenge') {
        return { paymentStatus: 'pending', orderStatus: null };
      }
      return { paymentStatus: 'failed', orderStatus: 'cancelled' };

    case 'settlement':
      return { paymentStatus: 'paid', orderStatus: 'confirmed' };

    case 'pending':
      return { paymentStatus: 'pending', orderStatus: null };

    case 'deny':
      return { paymentStatus: 'failed', orderStatus: 'cancelled' };

    case 'cancel':
      return { paymentStatus: 'cancelled', orderStatus: 'cancelled' };

    case 'expire':
      return { paymentStatus: 'expired', orderStatus: 'cancelled' };

    case 'refund':
    case 'partial_refund':
    case 'chargeback':
    case 'partial_chargeback':
      return { paymentStatus: 'refunded', orderStatus: null };

    default:
      return null;
  }
}

export async function createSnapTransaction(input: {
  providerOrderId: string;
  grossAmount: number;
  items: SnapItem[];
  customer: SnapCustomer;
  finishUrl: string;
}): Promise<
  | { ok: true; token: string; redirectUrl: string }
  | { ok: false; error: string; status?: number }
> {
  const { serverKey, isProduction } = getMidtransConfig();

  if (!serverKey) {
    return { ok: false, error: 'MIDTRANS_SERVER_KEY belum dikonfigurasi' };
  }

  const payload = {
    transaction_details: {
      order_id: input.providerOrderId,
      gross_amount: Math.round(input.grossAmount),
    },
    item_details: input.items.map((item) => ({
      id: item.id.slice(0, 50),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.slice(0, 50),
    })),
    customer_details: {
      first_name: input.customer.firstName.slice(0, 50) || 'Customer',
      email: input.customer.email ?? undefined,
      phone: input.customer.phone ?? undefined,
    },
    callbacks: {
      finish: input.finishUrl,
    },
    expiry: {
      unit: 'hour',
      duration: 24,
    },
    credit_card: {
      secure: true,
    },
  };

  let response: Response;

  try {
    response = await fetch(
      isProduction ? SNAP_PRODUCTION : SNAP_SANDBOX,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString(
            'base64'
          )}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      }
    );
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'network error',
    };
  }

  const data = (await response.json().catch(() => null)) as {
    token?: string;
    redirect_url?: string;
    error_messages?: string[];
  } | null;

  if (!response.ok || !data?.redirect_url || !data?.token) {
    const message = Array.isArray(data?.error_messages)
      ? data.error_messages.join('; ')
      : `Midtrans HTTP ${response.status}`;

    return { ok: false, error: message, status: response.status };
  }

  return {
    ok: true,
    token: data.token,
    redirectUrl: data.redirect_url,
  };
}
