import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, status, payment_date } = body;

    if (!email || !status) {
      return NextResponse.json({ success: false, error: 'Email and status are required' }, { status: 400 });
    }
    if (!['failed', 'completed'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Only allow editing when current status is pending
    if (user.payment_status && user.payment_status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Only pending payments can be edited' }, { status: 400 });
    }

    const updates: any = { payment_status: status };

    // If a payment_date was provided, always persist it
    if (payment_date) {
      updates.payment_date = payment_date;
    }

    // If marking completed and no explicit date provided, set now
    if (status === 'completed' && !updates.payment_date) {
      updates.payment_date = new Date().toISOString();
    }

    await db.updateUser(email, updates);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update payment error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Update failed' }, { status: 500 });
  }
}