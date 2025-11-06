import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import crypto from 'crypto';

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL;
const MAIN_ADMIN_PASSWORD = process.env.MAIN_ADMIN_PASSWORD;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(_request: NextRequest) {
  try {
    await db.createAdminsTable();

    if (!MAIN_ADMIN_EMAIL || !MAIN_ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'MAIN_ADMIN_EMAIL and MAIN_ADMIN_PASSWORD must be set' }, { status: 400 });
    }

    const existing = await db.getAdminByEmail(MAIN_ADMIN_EMAIL);
    if (!existing) {
      const passwordHash = hashPassword(MAIN_ADMIN_PASSWORD);
      await db.createAdmin({ email: MAIN_ADMIN_EMAIL, password: passwordHash });
    }

    return NextResponse.json({ success: true, message: 'Default admin ensured' });
  } catch (error: any) {
    console.error('Admin bootstrap error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Bootstrap failed' }, { status: 500 });
  }
}