import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import crypto from 'crypto';

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const requester = request.headers.get('x-admin-email');

    if (!MAIN_ADMIN_EMAIL || !requester || requester !== MAIN_ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    await db.createAdminsTable();

    const existing = await db.getAdminByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, error: 'Admin already exists' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const created = await db.createAdmin({ email, password: passwordHash });

    return NextResponse.json({ success: true, admin: created });
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Create admin failed' }, { status: 500 });
  }
}