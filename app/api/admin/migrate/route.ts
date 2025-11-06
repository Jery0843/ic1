import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function GET(_request: NextRequest) {
  try {
    await db.createAdminsTable();
    return NextResponse.json({ success: true, message: 'Admins table ensured' });
  } catch (error: any) {
    console.error('Admin migrate error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Migration failed' }, { status: 500 });
  }
}