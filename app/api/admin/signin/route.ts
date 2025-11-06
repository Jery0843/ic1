import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    await db.createAdminsTable();
    const admin = await db.getAdminByEmail(email);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const hashed = hashPassword(password);
    if (hashed !== admin.password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, admin: { email: admin.email } });
  } catch (error: any) {
    console.error('Admin signin error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Signin failed' }, { status: 500 });
  }
}