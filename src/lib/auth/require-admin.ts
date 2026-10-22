import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/supabase/admin';

/**
 * Verifikasi admin di server. Mengembalikan user hanya bila:
 * - ada sesi Supabase yang valid, dan
 * - email user terdaftar di ADMIN_EMAILS.
 *
 * Dipakai oleh API route admin. Jangan pernah dipakai di komponen client.
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) return null;

  return user;
}
