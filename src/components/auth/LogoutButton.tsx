'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'id';
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ??
        'px-4 py-2 hover:bg-white/10 rounded transition-colors text-sm'
      }
    >
      {t('logout')}
    </button>
  );
}
