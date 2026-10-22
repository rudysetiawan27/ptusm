import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  // Jalankan i18n middleware lebih dulu
  let response = intlMiddleware(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Lewati refresh session jika env belum dikonfigurasi
  // (misalnya saat build tanpa .env.local)
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh session jika sudah kedaluwarsa
    await supabase.auth.getUser();
  } catch (error) {
    // Jangan blokir render halaman publik jika Supabase bermasalah
    console.error('Supabase session refresh failed:', error);
  }

  return response;
}

export const config = {
  matcher: ['/', '/(id|en)/:path*', '/((?!_next|api|.*\\..*).*)'],
};
