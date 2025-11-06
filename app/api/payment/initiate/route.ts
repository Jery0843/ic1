import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import { initiatePayment } from '@/lib/phonepe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, accompanyingPersons, workshopParticipants } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, error: 'Email and amount are required' },
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

    // Check if payment already completed
    if (user.payment_status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Payment already completed' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID (max 38 chars for PhonePe)
    // Format: TXN + timestamp (13 digits) + random 4 chars = ~21 chars
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const merchantTransactionId = `TXN${timestamp}${randomStr}`;
    
    // Generate merchant user ID (use numeric ID if available, otherwise create from email)
    const merchantUserId = user.id?.toString() || user.email.replace(/[@.]/g, '_').substring(0, 38);

    // Initiate payment with PhonePe
    const paymentResponse = await initiatePayment({
      amount: Math.round(amount * 100), // Convert to paise
      merchantTransactionId,
      merchantUserId,
      mobileNumber: user.mobile,
      email: user.email,
      name: user.name,
    });

    // Store payment details in database
    await db.updateUser(email, {
      payment_status: 'pending',
      payment_transaction_id: merchantTransactionId,
      payment_amount: amount,
      accompanying_persons: accompanyingPersons || 0,
      workshop_participants: workshopParticipants || 0,
    } as any);

    // Return payment URL to frontend
    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.data.instrumentResponse.redirectInfo.url,
      merchantTransactionId,
      message: 'Payment initiated successfully',
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
