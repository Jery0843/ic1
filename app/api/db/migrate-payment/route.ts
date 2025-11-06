import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    // Add payment-related columns to users table
    const alterStatements = [
      'ALTER TABLE users ADD COLUMN payment_transaction_id TEXT DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN payment_amount REAL DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN payment_date TEXT DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN accompanying_persons INTEGER DEFAULT 0',
      'ALTER TABLE users ADD COLUMN workshop_participants INTEGER DEFAULT 0',
    ];
    
    const results = [];
    for (const statement of alterStatements) {
      try {
        await (db as any).executeQuery(statement);
        results.push({ statement, success: true });
      } catch (error: any) {
        // Column might already exist
        const message = error.message || 'Unknown error';
        if (message.includes('duplicate column name')) {
          results.push({ statement, success: true, message: 'Column already exists' });
        } else {
          results.push({ statement, success: false, error: message });
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment columns migration completed',
      results
    });
  } catch (error: any) {
    console.error('Payment migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
