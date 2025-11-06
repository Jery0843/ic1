import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, status } = body;

    if (!email || !status) {
      return NextResponse.json(
        { success: false, error: 'Email and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['submitted', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Use: submitted, accepted, or rejected' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update abstract status
    await db.updateUser(email, {
      abstract_status: status as 'submitted' | 'accepted' | 'rejected',
    } as any);

    return NextResponse.json({
      success: true,
      message: `Abstract status updated to: ${status}`,
    });
  } catch (error: any) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Update failed' },
      { status: 500 }
    );
  }
}
