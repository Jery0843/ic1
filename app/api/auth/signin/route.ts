import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import crypto from 'crypto';

// Simple password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user signed up with Google
    if (user.auth_provider === 'google') {
      return NextResponse.json(
        { success: false, error: 'This account uses Google sign-in. Please sign in with Google.' },
        { status: 400 }
      );
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      message: 'Sign in successful!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        category: user.category,
      },
    });
  } catch (error: any) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sign in failed' },
      { status: 500 }
    );
  }
}
