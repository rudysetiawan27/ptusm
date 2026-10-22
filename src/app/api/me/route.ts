import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/context';

export async function GET() {
  const { user, profile, company, isAdmin, isApproved } = await getAuthContext();

  return NextResponse.json({
    authenticated: Boolean(user),
    email: user?.email ?? null,
    fullName: profile?.full_name ?? null,
    companyStatus: company?.status ?? null,
    isAdmin,
    isApproved,
  });
}
