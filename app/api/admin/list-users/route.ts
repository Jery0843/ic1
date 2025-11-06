import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function GET(_request: NextRequest) {
  try {
    const users = await db.getAllUsers();
    const mapped = users.map((u: any) => ({
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      abstract_status: u.abstract_status,
      payment_transaction_id: u.payment_transaction_id,
      payment_date: u.payment_date,
      payment_status: u.payment_status,
      paper_status: u.paper_status,
      accompanying_persons: u.accompanying_persons || 0,
      workshop_participants: u.workshop_participants || 0,
    }));
    return NextResponse.json({ success: true, users: mapped });
  } catch (error: any) {
    console.error('List users error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to list users' }, { status: 500 });
  }
}