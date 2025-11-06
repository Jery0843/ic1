import { NextRequest, NextResponse } from 'next/server';
import { checkPaymentStatus } from '@/lib/phonepe';
import { db } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantTransactionId } = body;

    if (!merchantTransactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Check payment status with PhonePe
    const statusResponse = await checkPaymentStatus(merchantTransactionId);

    // Find user by transaction ID
    const users = await db.getAllUsers();
    const user = users.find((u: any) => u.payment_transaction_id === merchantTransactionId);

    if (user) {
      // If payment is successful, update database
      if (statusResponse.success && statusResponse.code === 'PAYMENT_SUCCESS') {
        if (user.payment_status !== 'completed') {
          await db.updateUser(user.email, {
            payment_status: 'completed',
            payment_date: new Date().toISOString(),
          } as any);
        }
      } 
      // If payment failed, update to failed status
      else if (statusResponse.code === 'PAYMENT_ERROR' || 
               statusResponse.code === 'PAYMENT_DECLINED' || 
               statusResponse.code === 'PAYMENT_CANCELLED' ||
               statusResponse.code === 'BAD_REQUEST' ||
               statusResponse.code === 'AUTHORIZATION_FAILED' ||
               statusResponse.code === 'INTERNAL_SERVER_ERROR' ||
               statusResponse.code === 'TRANSACTION_NOT_FOUND') {
        if (user.payment_status !== 'completed') {
          await db.updateUser(user.email, {
            payment_status: 'failed',
          } as any);
        }
      }
    }

    return NextResponse.json({
      success: true,
      status: statusResponse.code,
      data: statusResponse.data,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
