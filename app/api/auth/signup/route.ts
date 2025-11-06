import { NextRequest, NextResponse } from 'next/server';
import { db, User } from '@/lib/cloudflare-d1';
import crypto from 'crypto';

// Simple password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, mobile, address, category } = body;

    // Validate required fields
    if (!email || !password || !name || !mobile || !address || !category) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
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

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create new user
    const newUser: User = {
      email,
      password: hashedPassword,
      name,
      mobile,
      address,
      category,
      auth_provider: 'email',
    };

    const createdUser = await db.createUser(newUser);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        mobile: createdUser.mobile,
        address: createdUser.address,
        category: createdUser.category,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
