import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  try {
    const requester = request.headers.get('x-admin-email');
    if (!MAIN_ADMIN_EMAIL || !requester || requester !== MAIN_ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Prevent deletion of main admin to avoid lock-out
    if (email === MAIN_ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Cannot delete main admin' }, { status: 400 });
    }

    await db.createAdminsTable();

    const existing = await db.getAdminByEmail(email);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    await db.deleteAdminByEmail(email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Delete failed' }, { status: 500 });
  }
}