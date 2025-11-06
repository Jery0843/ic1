import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    // Add new columns to users table for paper submission
    const alterStatements = [
      'ALTER TABLE users ADD COLUMN paper_status TEXT DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN paper_submitted_at TEXT DEFAULT NULL'
    ];
    
    for (const statement of alterStatements) {
      try {
        await (db as any).executeQuery(statement);
      } catch (error: any) {
        // Column might already exist, log but continue
        console.log(`Column might already exist: ${error.message}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database migrated successfully for paper submission'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
