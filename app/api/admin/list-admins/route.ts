import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function GET(_request: NextRequest) {
  try {
    await db.createAdminsTable();
    const admins = await db.getAllAdmins();
    return NextResponse.json({ success: true, admins });
  } catch (error: any) {
    console.error('List admins error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to list admins' }, { status: 500 });
  }
}