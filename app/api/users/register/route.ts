import { NextRequest, NextResponse } from 'next/server';
import { db, User } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, mobile, address, category, auth_provider } = body;

    // Validate required fields
    if (!email || !name || !mobile || !address || !category || !auth_provider) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      email,
      name,
      mobile,
      address,
      category,
      auth_provider: auth_provider as 'email' | 'google',
    };

    const createdUser = await db.createUser(newUser);

    return NextResponse.json({
      success: true,
      user: createdUser,
    });
  } catch (error: any) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
