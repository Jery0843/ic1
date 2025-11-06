import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate inputs
    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's name
    await db.updateUser(email, { name: name.trim() });

    // Return updated user (without password)
    const updatedUser = await db.getUserByEmail(email);
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'Name updated successfully',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Update name error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update name' },
      { status: 500 }
    );
  }
}
