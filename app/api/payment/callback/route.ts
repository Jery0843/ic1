import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import { checkPaymentStatus } from '@/lib/phonepe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantTransactionId, transactionId, email } = body;

    if (!merchantTransactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Verify payment status with PhonePe
    const statusResponse = await checkPaymentStatus(merchantTransactionId);

    // Find user by transaction ID
    const users = await db.getAllUsers();
    const user = users.find((u: any) => u.payment_transaction_id === merchantTransactionId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found for this transaction' },
        { status: 404 }
      );
    }

    if (statusResponse.success && statusResponse.code === 'PAYMENT_SUCCESS') {
      // Update database with completion status
      await db.updateUser(user.email, {
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
      } as any);

      return NextResponse.json({
        success: true,
        message: 'Payment verified and completed successfully',
        paymentData: statusResponse.data,
      });
    } else {
      // Payment failed - update status
      await db.updateUser(user.email, {
        payment_status: 'failed',
      } as any);

      return NextResponse.json({
        success: false,
        error: 'Payment verification failed',
        code: statusResponse.code,
      });
    }
  } catch (error: any) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Callback processing failed' },
      { status: 500 }
    );
  }
}
