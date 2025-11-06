import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    await db.createAdminsTable();
    const admin = await db.getAdminByEmail(email);
    return NextResponse.json({ success: true, isAdmin: !!admin });
  } catch (error: any) {
    console.error('Admin check error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Check failed' }, { status: 500 });
  }
}